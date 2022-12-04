// Importing external modules.
const router = require('express').Router();
const axios = require('axios');
let cron = require('node-cron');

// Importing user defined modules.
const loginRequired = require('../middleware/loginRequired');
const scrap = require('../functions/scrap.js');

const { Scrape, Monitor, Products } = require("../database/database.js");

let startTime = 0;
let running = false;
let _expr = null;
const { mail } = require('../functions/mailer');


router.post('/scrap', loginRequired , async (req, res) => {
  let jobs = cron.getTasks();
  if (jobs.length != 0) {
    jobs.forEach((el) => {
      el.stop();
      // el.destroy(); Why it didn't work?
    });
    running = false;

  }

  _expr = req.body.cronExpr;

  // console.log(_expr);
  const results = await Scrape.find();
  startTime = Date.now();
  running = true;
  cron.schedule(_expr, () => {
    console.log(`scraping going on: ${new Date().toString()}`);
    results.forEach(result => {

      const { url, params } = result;
      scrap(url, params, async (productData) => {
        // console.log(`god does it work? ${productData}`);
        productData.forEach(async (el) => {
          // console.log(el.price);
          try {
            const justPrice = parseFloat(el.price.replace(/[^\d.-]/g, ''));
            const monitorDB = await Monitor.find({ link: url }).where('minDesiredPrice').gt(justPrice + 1);
            monitorDB.forEach(shit => {
              mail(shit.emailTo, el.name, el.price);
            });
          } catch (error) {

          }

        })
      });
      // console.log(price);
    });
  });

  res.json({ message: 'Success' });
});

router.post('/stopscraping',loginRequired , async (req, res) => {
  running = false;
  // console.log(cron.getTasks())
  console.log(`This schedule is running for ${(Date.now() - startTime) / 1000 / 60} minutes`);
  let jobs = cron.getTasks();
  if (jobs.length != 0) {
    jobs.forEach((el) => {
      el.stop();
      // el.destroy(); Why it didn't work?
    });
  }
  res.json({ msg: "duh!", _expr });


});

router.post('/log', (req, res) => {
  res.json({ running });
});


// Get routes
router.get('/scrap', async (req, res) => {
  if (req.query.name) {
    const searchValue = req.query.name.replace(" ", "|");
    const data = await Scrape.find({ url: new RegExp(searchValue, "i") });
    res.json(data);
  }
  else {
    res.json({ error: 'Please give the name of the product.' })
  }
});

router.get('/allproducts', loginRequired, async (req, res) => {
  const products = await Products.find();
  res.json(products);
})

router.get('/userinfo', loginRequired, (req, res) => {
  res.json({user: req.user});
})

module.exports = router;
