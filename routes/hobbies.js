const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const {isLoggedIn, isAuthor, validateHobby} = require('../middleware')
const hobbyControl = require('../controllers/hobby');

//ROUTES
router.route('/')
  .get(catchAsync(hobbyControl.index))
  .post(isLoggedIn, validateHobby, catchAsync(hobbyControl.createHobby))

router.get('/new', isLoggedIn, hobbyControl.renderNewForm)

router.route('/:id')
  .get(catchAsync(hobbyControl.showHobby))
  .put(isLoggedIn, isAuthor, validateHobby, catchAsync(hobbyControl.updateHobby))
  .delete(isLoggedIn, isAuthor, catchAsync(hobbyControl.deleteHobby))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hobbyControl.renderEditForm))


module.exports = router;
