const { compareSync } = require('bcrypt');
const { User } = require('../database/database.js')

// storing the data if logged in.
module.exports.authenticate = async (req, res, next) => {
  global.user = undefined;
  if (!(req.session && req.session.userId)) {
    return next();
  }
  const user = await User.findOne({ _id: req.session.userId });
  if(user) {
    user.password = undefined;
    req.user = user;
    res.locals.user = user;
  }
  next();
};
