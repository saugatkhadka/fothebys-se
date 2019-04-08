var createError = require('http-errors'),
    express     = require('express'),
    app         = express(),
    bodyParser  = require("body-parser"),
    // Allowing the env file to load and use env variables in .env file
    dotenv      = require('dotenv').config(),
    methodOverride = require("method-override"),
    mongoose    = require('mongoose'),
    path        = require('path'),
    cookieParser = require('cookie-parser'),
    logger      = require('morgan');


// For temporary use only
// Needs refactor
// TODO: Refactor the routers and the controllers
// DB Models
var Item = require("./models/item");
var Counter = require('./models/counter');

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
app.use(methodOverride("_method"));
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


// Items Pages
// No current page view
// TODO: Add new page
app.get("/admin/item", function(req, res, next){

  Item.find({},(err, founditems) => {
      if(err) {return next(err)};
      // TODO: Implement a way to display errors for already exisiting item
      if(founditems) { 
        // console.log(founditems);
        res.render('admin/item', {
          title: 'Items',
          items: founditems
        });
      };
    }
  );
});

// New Item creation POST routes
// Handles creating new item/piece
app.post('/admin/item', function(req, res, next){
  
  // Creates/Initializes the counter for the first time
    // Counter.create({lastCounter: 0}, (err, counter) => {
    //   if(err) {
    //     console.log("ERROR WITH THE COUNTER");
    //     res.redirect("back");
    //   } else {
    //     counter.save();
    //     console.log("COUNTER SAVED");
    //     res.redirect("back");
    //   }
    // });


  // TODO: Fix the way that counter updates
  // Right now, the counter updates regardless of whether or not something saves to the Item collection
  // Change it so that counter is only updated when the item is successfully saved


  // Updates the counter each time
   Counter.findOne({}, (err, counter) => {
    Counter.findOneAndUpdate(counter._id, {lastCounter: Number(counter.lastCounter) + 1}, (err, updatedCounter) => {
      // console.log("Counter: " + updatedCounter.lastCounter);
      var uidCounter = updatedCounter.lastCounter.toString().padStart(8, "0");

      // Creating new Item
      const item = new Item({
        // padStart() pads the current string with another specified string with (for now) 0.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
        // This adds '0' before the unique 8 digit number to meet the criteria
        // Since storing the unique number with leading zeros in mongodb removes the leading zeros
        // the number is stored as string and increased using a counter with a function
        // estimatedPrice: req.body.item.estimatedPrice.padStart(8, "0")
        // uid: TODO: call counter from the funtion and add here, along with .padStart(8, "0")

        uid: uidCounter,

        title: req.body.item.title,  
        category: req.body.item.category, 
        classification: req.body.item.classification, 
        artistName: req.body.item.artistName, 
        yearProduced: req.body.item.yearProduced, 
        itemDesc: req.body.item.itemDesc, 
        auctionDate: req.body.item.auctionDate,  
        estimatedPrice: {
          minEstimatedPrice: req.body.item.minEstimatedPrice,
          maxEstimatedPrice: req.body.item.maxEstimatedPrice
        },
        categoryInfo: {
          drawingMedium: req.body.item.drawingMedium,
          paintingMedium: req.body.item.paintingMedium,
          imageType: req.body.item.imageType,
          materialUsed: req.body.item.materialUsed,
          dimension: req.body.item.dimension,
          weight: req.body.item.weight,
          isFramed: req.body.item.isFramed
        }


        // Test Data
        // title: "test3",  
        // category: "Painting", 
        // classification: "Nude", 
        // artistName: "Harambe", 
        // yearProduced: 1998, 
        // itemDesc: "Nothing you need to know", 
        // auctionDate: "2019-04-04",  
        // estimatedPrice: {
        //   min: 12000,
        //   max: 13000
        // },
        // categoryInfo: {
        //   drawingMedium: "Pencil"
        // }

      });

      console.log(req.body.item);

      // TODO: Create a new serial number for the item/piece to be inserted into the DB
      // TODO: This should search for the serial number and see if they match, and throw error then

      Item.findOne({
          title: req.body.item.title
        },(err, founditem) => {
          if(err) {return next(err)};
          // TODO: Implement a way to display errors for already exisiting item
          // TODO: Current implementation requires using uid to verify that saved item is unique

          // Since no implementation is done, this statement is commented out
          // if(founditem) { 
          //   console.log("This item already exists"); 
          //   return res.redirect("back")
          // };
          item.save((err) => {
            if(err) {return next(err)};
            // TODO: Use flash message to show the successful operation
            console.log("Item Successfully Added");
            console.log(item);
            // Redirects back after success
            res.redirect("/admin/item");
          });
        }
      );
    });
  });

});

// Item registration form
app.get('/admin/item/new', (req, res, next) => {

  res.render('admin/addItem', {
    title: 'Add Item'
  });
});

// Delete/Destroy Item Route
// TODO: Add middleware to check item ownership and who uploaded, so only who added the item can delete it or the admins. Clarify and confirm feature
app.delete("/admin/item/:id", (req, res, next) => {
  Item.findByIdAndDelete(req.params.id, (err) => {
    if(err) {return next(err); }
    else {
      console.log("Item successfully deleted");
      res.redirect("back");
    }
  })
});






app.get('/admin/item/:id/edit', (req,res, next) => {
  Item.findById({_id: req.params.id}, (err, foundItem) => {
    if(err) {
      return next(err);
      //TODO: Add a error message on return
      // console.log("Item not found");
      // res.redirect("back");
    } else {
      res.render('admin/editItem', {
        title: "Edit Item",
        item: foundItem
      });
    }
    
  });

});

// DELETE ROUTE FOR ITEMS
// app.delete('/admin/item/:id', function(req, res) {

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
