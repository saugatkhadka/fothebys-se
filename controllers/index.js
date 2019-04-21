// var express = require('express');
// var router = express.Router();

const passport        = require('passport');
const flash           = require('express-flash');

// Models
var User = require('../models/User');

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


/* 
* GET /request-estimate
* Item Seller Info page 
* Front facing page
*/
exports.getRequestEstimatePage = (req, res) => {
  res.render('main/request-estimate', { 
  	title: "Request an Estimate"
  });
}



/* 
* GET /request-account
* Account Request page 
* Front facing page
*/
exports.getRequestAccountPage = (req, res) => {
  res.render('main/request-account', { 
  	title: "Request an Account"
  });
}



/**
 * POST /request-account
 * Request a new account.
 */
exports.postRequestAccount = (req, res, next) => {

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }
  console.log("Signup Running");
  const user = new User({
  	profile: {
	    title: req.body.user.title,
	    fname: req.body.user.fname,
	    lname: req.body.user.lname,
	    email: req.body.user.email,
	    phone_number: req.body.user.phone
  	},
    note: req.body.user.intent,
    verification_status: 0 // 0 -> means verification is pending
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that email address already exists.' });
      return res.redirect('/login');
    }
    user.save((err) => {
      if (err) { return next(err); }
        req.flash('success', { msg: 'Account request sent.' });
        res.redirect('/');
    });
  });
};




/* 
* GET /item-submission
* Item Submission page 
* Front facing page
*/
exports.getItemSubmissionPage = (req, res) => {
  res.render('main/item-submission', { 
  	title: "Submit an Item"
  });
}