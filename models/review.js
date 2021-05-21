const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ReviewSchema = new Schema ({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

//mongoose.model('Name that Schema will be called', Schema class to be used from this file)
module.exports = mongoose.model('Review', ReviewSchema)