const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const ExpressError = require('../helpers/expressError');
const Hobby = require('../models/hobby');
const {hobbySchema} = require('../schemas')

//Post Validation
const validateHobby = (req, res, next) => {
  const {error} = hobbySchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
};


//ROUTES
router.get('/', catchAsync(async (req, res) => {
  const hobby  = await Hobby.find({});
  res.render('hobbies/index', { hobby });
}))

router.get('/new', (req, res) => {
  res.render('hobbies/new')
})

router.post('/', validateHobby, catchAsync(async (req, res, next) => {
    const hobby = new Hobby(req.body.hobby);
    await hobby.save();
    res.redirect(`hobbies/${hobby._id}`)
}))

//SHOW Page
router.get('/:id', catchAsync(async (req, res) => {
  const hobby  = await Hobby.findById(req.params.id).populate('reviews');
  res.render('hobbies/show', { hobby })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
  const hobby  = await Hobby.findById(req.params.id);
  res.render('hobbies/edit', { hobby })
}))

//DATA MANIPULATION ROUTES
//Edit Route
router.put('/:id', validateHobby, catchAsync(async (req, res) => {
  const {id} = req.params;
  const hobby = await Hobby.findByIdAndUpdate(id, {...req.body.hobby});
  res.redirect(`/hobbies/${hobby._id}`)
}))

//Delete Route
router.delete('/:id', catchAsync(async (req, res) => {
  const {id} = req.params;
  const hobby = await Hobby.findByIdAndDelete(id, {...req.body.hobby});
  res.redirect(`/hobbies`)
}))

module.exports = router;
