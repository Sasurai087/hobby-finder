module.exports.isLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must sign in first before you can do that.');
    res.redirect('/login')
  }
  next();
}