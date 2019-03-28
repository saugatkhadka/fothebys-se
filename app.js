var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// ROUTES
// Main Route
app.get('/', indexRouter);

//Login
app.get('/login', function(req, res, next){
  res.render('main/login', {
    title: "Login"
  });
});

// Users
// User Dashboard
app.get('/dashboard', function(req, res, next){
  res.render('users/dashboard', {
    title: 'Dashboard'
  });
});

// Admin
// Admin Dashboard
app.get('/admin', function(req, res, next){
  res.render('admin/admin', {
    title: 'Admin Dashboard'
  });
});
// // View Users
// app.get('/admin/users', function (req, res, next) {
//   res.render('admin/users', {
//     title: "Users"
//   });
// });

// app.get('/admin/users/new', function (req, res, next) {
//   res.render('admin/addUsers', {
//     title: "Add Users"
//   });
// });

// Auction View
app.get('/admin/auction', function(req, res, next){
  res.render('admin/auction', {
    title: 'Auction'
  });
});

// Item Add Form
app.get('/admin/item/add', function (req, res, next) {
  res.render('admin/addItem', {
    title: 'Add Item'
  });
});






//test page for testing the bootstrap dashboard panel
app.get('/test', function (req, res, next) {
  res.render('main/test', {
    title: "Test"
  });
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
