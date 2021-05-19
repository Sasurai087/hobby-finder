const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

//Passport secretly adds a unique username + password field with some methods
//Docs for passport-local-mongoose have more details on this
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema)
