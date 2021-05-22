const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
})

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200')
})

//This lets mongoose pass virtuals into results that are visible on dev console
const opts = { toJSON: {virtuals: true}};

const HobbySchema = new Schema ({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: { 
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
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
  ],
}, opts)

HobbySchema.virtual('properties.popUpMarkup').get(function() {
  return `
  <strong><a href="/hobbies/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0,100)}...</p>
  `
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