const Hobby = require('../models/hobby');
const {cloudinary} = require('../cloudinary');
const mapboxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mapboxGeocoding({accessToken: mapboxToken});

module.exports.index = (async (req, res) => {
  const hobbyMap = await Hobby.find({});
  if (!req.query.page){
    const hobby = await Hobby.paginate({}, {
      populate: {
        path: 'popUpText'
      }
    });
    res.render('hobbies/index', { hobby, hobbyMap });
  } else {
    const {page} = req.query;
    const hobby = await Hobby.paginate({}, {
      page,
      populate: {path: 'popUpText'}
    });
    res.status(200).json(hobby);
  }
})

module.exports.renderNewForm = (req, res) => {
  res.render('hobbies/new')
}

module.exports.createHobby = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.hobby.location,
    limit: 1
  }).send();
  const hobby = new Hobby(req.body.hobby);
  hobby.geometry = geoData.body.features[0].geometry;
  hobby.images = req.files.map(file => ({url: file.path, filename: file.filename}));
  hobby.author = req.user._id;
  await hobby.save();
  req.flash('success', 'Successfully posted a new hobby spot!') 
  res.redirect(`hobbies/${hobby._id}`)
  }

  module.exports.showHobby = async (req, res) => {
    const hobby  = await Hobby.findById(req.params.id).populate({
      path: 'reviews', //This is a nested populate to get authors to show up on reviews
      populate: {
        path: 'author'
      }
    }).populate('author');
    if(!hobby){
      req.flash('error', 'Cannot find the specified hobby spot.')
      return res.redirect('/hobbies')
    }
    res.render('hobbies/show', { hobby })
  }

  module.exports.renderEditForm = async (req, res) => {
    const hobby = await Hobby.findById(req.params.id)
    if(!hobby){
      req.flash('error', 'Cannot find the specified hobby spot.')
      return res.redirect('/hobbies')
    }
    res.render('hobbies/edit', { hobby })
  }

  module.exports.updateHobby = async (req, res) => {
    const {id} = req.params;
    const hobby = await Hobby.findByIdAndUpdate(id, {...req.body.hobby});
    const newImages = req.files.map(file => ({url: file.path, filename: file.filename}));
    hobby.images.push(...newImages)
    await hobby.save()
    if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename)
      }
      await hobby.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages }}}})
    }
    req.flash('success', 'Successfully updated hobby spot')  
    res.redirect(`/hobbies/${hobby._id}`)
  }

  module.exports.deleteHobby = async (req, res) => {
    const {id} = req.params;
    const hobbyDelete = await Hobby.findByIdAndDelete(id, {...req.body.hobby});
    req.flash('success', 'Successfully removed the hobby spot')  
    res.redirect(`/hobbies`)
  }