const Hobby = require('../models/hobby');

module.exports.index = (async (req, res) => {
  const hobby  = await Hobby.find({});
  res.render('hobbies/index', { hobby });
})

module.exports.renderNewForm = (req, res) => {
  res.render('hobbies/new')
}

module.exports.createHobby = async (req, res, next) => {
  const hobby = new Hobby(req.body.hobby);
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
    req.flash('success', 'Successfully updated hobby spot')  
    res.redirect(`/hobbies/${hobby._id}`)
  }

  module.exports.deleteHobby = async (req, res) => {
    const {id} = req.params;
    const hobbyDelete = await Hobby.findByIdAndDelete(id, {...req.body.hobby});
    req.flash('success', 'Successfully removed the hobby spot')  
    res.redirect(`/hobbies`)
  }