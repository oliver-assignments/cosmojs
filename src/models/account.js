const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

//                                                                           //
//  PLEASE NOTE: Passport handles salting and hashing, I've checked the db!  //
//                                                                           //

const Account = new mongoose.Schema({
  username: String,
  password: String,
});
Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('accounts', Account);
