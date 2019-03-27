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

app.use('/', indexRouter);

//Login
app.use('/login', function(req, res, next){
  res.render('main/login', {
    title: "Login"
  });
});

// Users
// User Dashboard
app.use('/dashboard', function(req, res, next){
  res.render('users/dashboard', {
    title: 'Dashboard'
  });
});


// Admin
// Admin Dashboard
app.use('/admin', function(req, res, next){
  res.render('admin/admin', {
    title: 'Admin Dashboard'
  });
});
// View Users
app.use('/users', function (req, res, next) {
  res.render('admin/users', {
    title: "Users"
  });
});

app.use('/users/new', function (req, res, next) {
  res.render('admin/addUsers', {
    title: "Add Users"
  });
});


//test page for testing the bootstrap dashboard panel
app.use('/test', function (req, res, next) {
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
