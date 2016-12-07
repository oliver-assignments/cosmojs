module.exports.requiresLogin = (req,res,next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    next();
  }
};
module.exports.requiresLogout = (req,res,next) => {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
  	next();
  }
};