const express = require('express');

//set Router{mergeParams} to true to obtain params(id) from hobbies route
const router = express.Router({mergeParams: true});

const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/expressError');

const Hobby = require('../models/hobby');
const Review = require('../models/review');
const {reviewSchema} = require('../schemas')

//Post Validation
const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

//Add Review Route
router.post('/', validateReview, catchAsync(async (req, res) => {
  const hobby = await Hobby.findById(req.params.id);
  const review = new Review(req.body.review);
  hobby.reviews.push(review);
  await review.save();
  await hobby.save();
  req.flash('success', 'Your review was successfully posted!')  
  res.redirect(`/hobbies/${hobby._id}`)
}))

//Delete Review Route
router.delete('/:reviewId', catchAsync(async (req, res) => {
  const {id, reviewId} = req.params;
  await Hobby.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Your review has been deleted.')  
  res.redirect(`/hobbies/${id}`)
}))

module.exports = router;
