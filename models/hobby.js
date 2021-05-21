const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const HobbySchema = new Schema ({
  title: String,
  images: [
    {    
      url: String,
      filename: String,
    }
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

HobbySchema.post('findOneAndDelete', async function(doc) {
  if(doc){
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

//mongoose.model('Name that Schema will be called', Schema class to be used from this file)
module.exports = mongoose.model('Hobby', HobbySchema)