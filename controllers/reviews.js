const Hobby = require('../models/hobby');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const hobby = await Hobby.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  hobby.reviews.push(review);
  await review.save();
  await hobby.save();
  req.flash('success', 'Your review was successfully posted!')  
  res.redirect(`/hobbies/${hobby._id}`)
}

module.exports.deleteReview = async (req, res) => {
  const {id, reviewId} = req.params;
  await Hobby.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Your review has been deleted.')  
  res.redirect(`/hobbies/${id}`)
}