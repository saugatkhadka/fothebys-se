// var express = require('express');
// var router = express.Router();

const passport        = require('passport');
const flash           = require('express-flash');


/* GET home page. */
// router.getHomePage('/', function(req, res, next) {
//   res.render('main/index', { 
//   	title: "Home"
//   });
// });

// module.exports = router;

/* 
* GET /
* Home page
*/

exports.index = (req, res, next) => {
  res.render('main/index', { 
  	title: "Home"
  });
}


/* 
* GET /login
* Login page
*/
exports.getLogin = (req, res, next) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('main/login', {
    title: "Login"
  }); 
}


/* 
* POST /login
* Login Check
*/
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();
  req.sanitize('email');

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) { return next(err); }
      req.flash('success', { msg: 'Success! You are logged in.' });
      console.log(req.session.returnTo);
      res.redirect(req.session.returnTo || '/admin');
    });
  })(req, res, next);
}


/* 
* GET /logout
* Logout Route
*/
exports.getLogout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) console.log('Error : Failed to destroy the session during logout.', err);
    req.user = null;
    res.redirect('/');
  });
}