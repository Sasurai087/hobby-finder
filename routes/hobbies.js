const express = require('express');
const router = express.Router();
const catchAsync = require('../helpers/catchAsync');
const {isLoggedIn, isAuthor, validateHobby} = require('../middleware')
const hobbyControl = require('../controllers/hobby');
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage});


//ROUTES
router.route('/')
  .get(catchAsync(hobbyControl.index))
  .post(isLoggedIn, upload.array('image'), validateHobby, catchAsync(hobbyControl.createHobby))

router.get('/new', isLoggedIn, hobbyControl.renderNewForm)

router.route('/:id')
  .get(catchAsync(hobbyControl.showHobby))
  .put(isLoggedIn, isAuthor, validateHobby, catchAsync(hobbyControl.updateHobby))
  .delete(isLoggedIn, isAuthor, catchAsync(hobbyControl.deleteHobby))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hobbyControl.renderEditForm))


module.exports = router;
