// Importing external modules
var express = require('express');
// Importing internal modules
const { Products } = require('../database/database');
const loginRequired = require('../middleware/loginRequired');


var router = express.Router();

// Router ends
router.get('/', async (req, res, next) => {
    let currProducts = await Products.find();
    let refinedArray = [];
    currProducts.forEach(el => {
        let lastTwo = [0, 0];
        let label = ["➡️", "Stable"]
        const lenPrice = el.price_history.length;
        if (lenPrice > 1) {
            lastTwo = [el.price_history[lenPrice - 1].price, el.price_history[lenPrice - 2].price];
            if (lastTwo[0] > lastTwo[1]) {
                label = ["⬆️", "Going up"]
            } else if (lastTwo[0] < lastTwo[1]) {
                label = ["⬇️", "Going down"]
            }
            refinedArray.push({ el, label, lastTwo });

        } else {
            lastTwo = [el.price_history[lenPrice - 1].price, el.price_history[lenPrice - 1].price];
            refinedArray.push({ el, label, lastTwo });
        }
    });
    res.render('tracking', { products: refinedArray });
});


router.get('/prod/:id',async (req, res) => {
// Receive ID of a specific product to show its' price history in graph
    const ID = req.params.id;
    const desiredProduct = await Products.find({_id: ID});
    const prices = desiredProduct[0].price_history.map(({price}) => parseFloat(price.replace(/[^\d.-]/g, '')));
    const times = desiredProduct[0].price_history.map(({timestamp}) => new Date(`${timestamp}`).toLocaleTimeString()); // Bloody hell timestamp!!
    const link = desiredProduct[0].link;
    res.render('product', {title: desiredProduct[0].name, link: desiredProduct[0].link, prices, times, ID});
});

module.exports = router;
