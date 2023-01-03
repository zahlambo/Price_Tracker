var express = require('express');
var router = express.Router();
const axios = require('axios');
const { Monitor, Products, Scrape } = require('../database/database');
const { CalculateNextTime, getNextTimeInterval } = require('../functions/misc');
const scrap = require('../functions/scrap');
let running = false;

router.post("/createSchedule", async (req, res) => {
    const { productID, interval, hourOrMinute, emailOfRequester, minimumDesiredPriceOfRequester, link } = req.body;

    const increaseNext = `${interval}:${hourOrMinute == "0" ? "M" : "H"}`;
    const nextTime = CalculateNextTime(increaseNext);
    console.log(link);
    const DBObj = {
        productID,
        nextTime,
        minDesiredPrice: minimumDesiredPriceOfRequester,
        emailTo: emailOfRequester,
        increaseNext,
        link
    }
    // console.log(await Monitor.find());
    const currState = await Monitor.find({ productID, emailTo: emailOfRequester });
    if (currState.length !== 0) {
        res.send({ msg: "You have already set this product." });
    } else {
        Monitor(DBObj).save();
        // res.redirect(`/monitor/checkEmailScheduler`);
        res.redirect('hitScraping');
    }
});

router.get('/hitScraping', async (req, res) => {
    
    axios.post('http://localhost:80/api/log', {

    })
        .then(function (response) {
            if (response.data.running) {
                axios.post('http://localhost:80/api/stopscraping', {

                })
                    .then(function (response) {
                        console.log(response.data._expr);
                        axios.post('http://localhost:80/api/scrape', {
                            cronExpr: _expr
                })
                    .then(function (response) {
                        console.log(response.data.message);
                        
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                console.log("Scraping algo not running.. trying to fire it...");
                axios.post('http://localhost:80/api/scrap', {
                            cronExpr: "*/1 * * * *"
                })
                    .then(function (response) {
                        console.log(response.data.message);
                        
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    res.redirect('/tracking');
})

module.exports = router;