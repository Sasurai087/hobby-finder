const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReviewSchema = new Schema ({
  body: String,
  rating: Number
});

//mongoose.model('Name that Schema will be called', Schema class to be used from this file)
module.exports = mongoose.model('Review', ReviewSchema)