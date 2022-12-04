const cheerio = require("cheerio");
const axios = require("axios");
const { Products } = require("../database/database.js");

async function scrap(url, params, cb) {
  // Requesting the page and loading it to cheerio.
  const page = await axios.get(url);
  const $ = cheerio.load(page.data);

  // The varibale to store the data.
  const productData = [];

  // Extracting the names.
  $(params.name).each((index, data) => {
    productData.push({
      name: $(data).text().replace(/\s\s+/g, ""),
    });
  });
  // Extracting the prices.
  $(params.price).each((index, data) => {
    if (productData[index]) {
      productData[index]["price"] = $(data).text().replace(/\s\s+/g, "");
    }
  });
  // Extracting the image urls.
  $(params.image).each((index, data) => {
    if (productData[index]) {
      productData[index]["image"] = $(data).attr("src");
    }
  });

  // If there is only one image that is used for every product.
  productData.forEach((product) => {
    if (!product.image) {
      product["image"] = productData[0].image;
    }
  });

  // If we successfully scrapped the data,
  // insert them to the database.
  const website = url.split("https://")[1].split("/")[0];

  // let currProducts = await Products.find();

  if (productData.length) {
    productData.forEach(async (data) => {
      const currProduct = await Products.find({ name: data.name });
      const alreadyThere = currProduct.length !== 0;

      if (alreadyThere) {
        currProduct[0].price_history.push({ price: data.price });
        currProduct[0].save();
        // does this work?
      } else {
        Products({
          name: data.name,
          website, // should be name of website. E.G. Steam, Amazon,
          link: url,
          image: data.image,
          price_history: [
            {
              price: data.price,
            },
          ],
        })
          .save()
          .catch((err) => {
            // Do Nothing right now. This just prevents showing error
            // when could not get price data because the class is
            // different for sales.
          });
      }
    });
  }

  // Running any callback if passed.
  if (cb) cb(productData);
  // return data.price;
}

module.exports = scrap;
