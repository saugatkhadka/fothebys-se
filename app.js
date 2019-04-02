var createError = require('http-errors'),
    express     = require('express'),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require('mongoose'),
    path        = require('path'),
    cookieParser = require('cookie-parser'),
    logger      = require('morgan');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });

// For temporary use only
// Needs refactor
// TODO: Refactor the routers and the controllers
// DB Models
var Item = require("./models/item");

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


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
// Tells express to use body parser 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// app.use(express.json());

//Changed from false to true
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));








// ROUTES
// Main Route
app.get('/', indexRouter);

//Login-----
app.get('/login', function(req, res){
  res.render('main/login', {
    title: "Login"
  });
});

// Users
// User Dashboard
app.get('/dashboard', function(req, res){
  res.render('users/dashboard', {
    title: 'Dashboard'
  });
});

// Admin
// Admin Dashboard
app.get('/admin', function(req, res){
  res.render('admin/admin', {
    title: 'Admin Dashboard'
  });
});
// // View Users
// app.get('/admin/users', function (req, res) {
//   res.render('admin/users', {
//     title: "Users"
//   });
// });

// app.get('/admin/users/new', function (req, res) {
//   res.render('admin/addUsers', {
//     title: "Add Users"
//   });
// });

// Auction View
app.get('/admin/auction', function(req, res){
  res.render('admin/auction', {
    title: 'Auction'
  });
});


// Items Pages
// No current page view
// TODO: Add new page
app.get("/admin/item", function(req, res){
  res.send("ITEM PAGE");
});

// Item registration form
app.get('/admin/item/new', function (req, res) {
  res.render('admin/addItem', {
    title: 'Add Item'
  });
});

// New Item creation POST routes
// Handles creating new item/piece
app.post('/admin/item', function(req, res){

  const item = new Item({
    title: req.body.item.title,  
    category: req.body.item.category, 
    classification: req.body.item.classification, 
    artistName: req.body.item.artistName, 
    yearProduced: req.body.item.yearProduced, 
    itemDesc: req.body.item.itemDesc, 
    auctionDate: req.body.item.auctionDate,  
    estimatedPrice: req.body.item.estimatedPrice
  });

  // TODO: Create a new serial number for the item/piece to be inserted into the DB
  // TODO: This should search for the serial number and see if they match, and throw error then

  Item.findOne({
      title: req.body.item.title
    },(err, founditem) => {
      if(err) {return next(err)};
      // TODO: Implement a way to display errors for already exisiting item
      if(founditem) { 
        console.log("This item already exists"); 
        return res.redirect("back")
      };
      item.save((err) => {
        if(err) {return next(err)};
        // TODO: Use flash message to show the successful operation
        console.log("Item Successfully Added");
        res.redirect("/admin/item");
      })

    }
  );


  console.log(req.body.item);
});








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
