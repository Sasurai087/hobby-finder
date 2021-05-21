const { hobbySchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./helpers/ExpressError');
const Hobby = require('./models/hobby');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must sign in first before you can do that.');
    res.redirect('/login')
  };
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const {id} = req.params;
  const hobby = await Hobby.findById(id)
  if(!hobby.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/hobbies/${id}`)
  };
  next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  console.log(req.params)
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId)
  if(!review.author.equals(req.user._id)){
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/hobbies/${id}`)
  };
  next();
}

//Post Validation
module.exports.validateHobby = (req, res, next) => {
  const {error} = hobbySchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
};

module.exports.validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}