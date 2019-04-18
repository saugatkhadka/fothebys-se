const createError     = require('http-errors');
const express         = require('express');
const session         = require('express-session');
const bodyParser      = require("body-parser");
const lusca           = require('lusca');
const dotenv          = require('dotenv').config();  // Allowing the env file to load and use env variables in .env file
const MongoStore      = require('connect-mongo')(session);
const flash           = require('express-flash');
const chalk           = require('chalk');
const methodOverride  = require("method-override");
const expressSanitizer = require("express-sanitizer");
const expressValidator = require('express-validator');
const mongoose        = require('mongoose');
const passport        = require('passport');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');
const moment          = require('moment');


// For temporary use only
// Needs refactor
// TODO: Refactor the routers and the controllers
// DB Models
var Item = require("./models/Item");
var User = require("./models/User");
var Counter = require('./models/Counter');

/**
 * Controllers (route handlers).
 */
var indexController = require('./controllers/index');
var adminController = require('./controllers/admin');
var usersController = require('./controllers/user');
var itemController = require('./controllers/item');


/* 
*  Middleware
*  middleware must be kept inside the routes or controller when they are created
*/
// var middleware = require("./middleware");  // index.js is automatically run or called

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');


/**
 * Create Express server.
 */
const app  = express();

/**
 * Connect to MongoDB.
 */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
    process.exit();
});


/**
 * Express configuration.
 */

// For restful routing
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.use(logger('dev'));
// app.use(express.json());

//Changed from false to true
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// Sets view path
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
  store: new MongoStore({
    url: process.env.MONGODB_URI,
    autoReconnect: true,
  })
}));


/*
** Passport
*/
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.path === '/api/upload') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
// Making user information available where needed on all routes
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user
    && req.path !== '/login'
    && req.path !== '/signup'
    && !req.path.match(/^\/auth/)
    && !req.path.match(/\./)) {
    req.session.returnTo = req.originalUrl;
  } else if (req.user
    && (req.path === '/account' || req.path.match(/^\/api/))) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});



/*
** ROUTES
*/
// Main Route
app.get('/', indexController.index);
app.get('/login', indexController.getLogin);
app.post('/login', indexController.postLogin);
app.get('/logout', passportConfig.isAuthenticated, indexController.getLogout);

// Admin Routes
// TODO: Add middleware in passport config to check if the given user is admin or not
// Some routes cannot be access by buyers and seller
app.get('/admin', passportConfig.isAuthenticated, adminController.getDashboard);
app.get('/admin/user', passportConfig.isAuthenticated, adminController.getUserList);
app.post('/admin/user', passportConfig.isAuthenticated, adminController.postUser);
app.get('/admin/user/new', passportConfig.isAuthenticated, adminController.getUserForm); 

// Items Pages
// No current page view
// TODO: Add new individual item page
app.get("/admin/item", passportConfig.isAuthenticated, itemController.getItemList);
app.post('/admin/item', passportConfig.isAuthenticated, itemController.postItem);
app.get('/admin/item/new', passportConfig.isAuthenticated, itemController.getItemCreate);

// Delete/Destroy Item Route
// TODO: Add middleware to check item ownership and who uploaded, so only who added the item can delete it or the admins. Clarify and confirm feature
app.delete("/admin/item/:id", passportConfig.isAuthenticated, itemController.deleteItem);
app.get('/admin/item/:id/edit', passportConfig.isAuthenticated, itemController.getItemEdit);


// Auction View
// app.get('/admin/auction', function(req, res, next){
//     res.render('admin/auction', {
//         title: 'Auction'
//     });
// });




//test page for testing the bootstrap dashboard panel
app.get('/test', function (req, res) {
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
