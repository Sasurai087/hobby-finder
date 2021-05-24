const express = require('express');
//set Router{mergeParams} to true to obtain params(id) from hobbies route
const router = express.Router({mergeParams: true});
const catchAsync = require('../helpers/catchAsync');
const expressError = require('../helpers/expressError');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviewControl = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(reviewControl.createReview))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewControl.deleteReview))

module.exports = router;
