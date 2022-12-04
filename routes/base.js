var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
// Importing database modules.
const { User, Products } = require("../database/database.js");

const { Request } = require('../database/database.js');
const loginRequired = require('../middleware/loginRequired');

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.status(200).send("Came from the wild...");
});*/

router.get('/user',loginRequired, (req, res) => {
  res.render('user', { user: req.user });
})


   
router.post('/userRequest', loginRequired, async (req, res) => {
  // console.log(req.body, req.user);
//  const request = await Request.find({name:req.body.name });
 const request = new Request({
    user_id: req.user._id,
    name: req.body.name,
    website: req.body.website,
    link: req.body.link
  });

  request.save();
  
  
  res.send('Success');
});


router.get("/", async (req, res) => {
  const products = await Products.find().limit(9);
  //console.log(products);
  res.render("homepage", { user: req.user, products });
});


router.get("/userRequest", loginRequired, (req, res) => {
  res.render("userRequest");
});

router.get("/userEdit", (req, res) => {
  res.render("userEdit", { user: req.user });
});

router.get("/search",async (req, res) => {
  const searchproduct = await Products.find({
    name: new RegExp(req.query.name, "i"),
  });
  res.json(searchproduct);
});

//********************************** */

router.put("/userEditInfo",loginRequired, async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { name: req.body.name, email: req.body.email } }
  );
  user.save();
  //console.log(req.user);
  res.send("");
});

router.put("/changepassword", loginRequired, async (req, res) => {
  req.body.password = bcrypt.hashSync(req.body.password, 14);
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { password: req.body.password } }
  );
  user.save();
  //console.log(req.user);
  res.send("");
});



module.exports = router;

