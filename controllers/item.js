/* eslint-disable no-undef */
/* eslint-disable no-console */
var Item = require("../models/Item");
var Counter = require('../models/Counter');
var Bid = require("../models/CommissionBid");
const flash = require('express-flash');

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


/* 
 * GET /admin/item
 * Lot Item List page
 */
exports.getItemList = (req, res, next) => {
  // Search funtionality

  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Item.find({
      $or : [
        {name: regex},
        {category: regex},
        {authorship:regex}
      ]
    })
    .sort({_id: -1})
    .exec((err, founditems) => {
      if (err) {
        return next(err)
      }
      // TODO: Implement a way to display errors for already exisiting item
      
      if (founditems) {
        // console.log(founditems);
        res.render('item/index', {
          title: 'Items',
          items: founditems,
          selectedTab: 'item'
        });
        // res.send(founditems);
      }
    });
  } else {
    Item.find()
    .sort({_id: -1})
    .exec((err, founditems) => {
      if (err) {
        return next(err)
      }
      // TODO: Implement a way to display errors for already exisiting item
      if (founditems) {
        // console.log(founditems);
        res.render('item/index', {
          title: 'Items',
          items: founditems,
          selectedTab: 'item'
        });
      }
    });
  }
  
}


/* 
 * POST /admin/item
 * Lot Item Create Route
 */
exports.postItem = (req, res, next) => {

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

  console.log(req.files);
  
  // TODO: Fix the way that counter updates
  // Right now, the counter updates regardless of whether or not something saves to the Item collection
  // Change it so that counter is only updated when the item is successfully saved


  // Updates the counter each time
  Counter.findOne({}, (err, counter) => {
    Counter.findOneAndUpdate(counter._id, {
      lastCounter: Number(counter.lastCounter) + 1
    }, (err, updatedCounter) => {
      // console.log("Counter: " + updatedCounter.lastCounter);
      // padStart() pads the current string with another specified string with (for now) 0.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
      // This adds '0' before the unique 8 digit number to meet the criteria
      // Since storing the unique number with leading zeros in mongodb removes the leading zeros
      // the number is stored as string and increased using a counter with a function
      // estimatedPrice: req.body.item.estimatedPrice.padStart(8, "0")
      // uid: TODO: call counter from the funtion and add here, along with .padStart(8, "0")
      var uidCounter = updatedCounter.lastCounter.toString().padStart(8, "0");

      // Creating new Item
      const item = new Item({
        reference_no: uidCounter,

        name: req.body.item.name,
        category: req.body.item.category,
        classification: req.body.item.classification,
        authorship: req.body.item.authorship,
        yearProduced: req.body.item.yearProduced,
        description: req.body.item.description,
        estimatedPrice: {
          min: req.body.item.minEstimatedPrice,
          max: req.body.item.maxEstimatedPrice
        },
        categoryInfo: {
          drawingMedium: req.body.item.drawingMedium,
          paintingMedium: req.body.item.paintingMedium,
          imageType: req.body.item.imageType,
          materialUsed: req.body.item.materialUsed,
          dimension: req.body.item.dimension,
          weight: req.body.item.weight,
          isFramed: req.body.item.isFramed
        },
        reservePrice: req.body.item.reservePrice,
        added_by: req.user._id,
        images: req.files
      });

      console.log(req.body.item);

      // TODO: Create a new serial number for the item/piece to be inserted into the DB
      // TODO: This should search for the serial number and see if they match, and throw error then

      Item.findOne({
        name: req.body.item.name
      }, (err, foundItem) => {
        if (err) {
          return next(err)
        }
        // TODO: Implement a way to display errors for already exisiting item
        // TODO: Current implementation requires using uid to verify that saved item is unique

        // Since no implementation is done, this statement is commented out
        if(foundItem) {
          console.log("This item already exists");
          req.flash('errors', { msg: "Item with this name already exists" });
          return res.redirect('back');
        }

        item.save((err) => {
          if (err) {
            return next(err)
          }
          // TODO: Use flash message to show the successful operation
          console.log("Item Successfully Added");
          console.log(item);
          // Redirects back after success
          res.redirect("/admin/item");
        });
      });
    });
  });
}


/* 
 * GET /admin/item/:id
 * Lot Item  page
 */
exports.getItem = (req, res, next) => {
  Item.findById(req.params.id)
    .exec((err, founditem) => {
      if (err) {
        return next(err)
      }
      // TODO: Implement a way to display errors for already exisiting item
      if (founditem) {
        // console.log(founditem);
        res.render('item/view', {
          title: 'Item',
          item: founditem,
          selectedTab: 'item'
        });
      }
    });
}

/* 
 * GET /admin/item/new
 * Lot Item Registration Form page
 */
exports.getItemCreate = (req, res, next) => {
  res.render('item/new', {
    title: 'Add Item',
    selectedTab: 'item'
  });
}

/* 
 * DELETE /admin/item/:id
 * Lot Item Detetion page
 */
exports.deleteItem = (req, res, next) => {
  Item.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      return next(err);
    } else {
      console.log("Item successfully deleted");
      res.redirect("back");
    }
  });
}

/* 
 * GET /admin/item/:id/edit
 * Lot Item Editing page
 */
exports.getItemEdit = (req, res, next) => {
  Item.findById({
    _id: req.params.id
  }, (err, foundItem) => {
    if (err) {
      return next(err);
      //TODO: Add a error message on return
      // console.log("Item not found");
      // res.redirect("back");
    } else {
      res.render('item/edit', {
        title: "Edit Item",
        item: foundItem,
        selectedTab: 'item'
      });
    }
  });
}


/* 
 * PUT /admin/item/:id
 * Lot Item Editing page
 */
exports.updateItem = (req, res, next) => {
  console.log(req.body.item);
  // var tempImages;
  // if(req.files){
  //   tempImages: req.files;
  // } else {
  //   tempImages: req.body.imagesArray;
  // }
  const updates = {
    name: req.body.item.name,
    category: req.body.item.category,
    classification: req.body.item.classification,
    authorship: req.body.item.authorship,
    yearProduced: req.body.item.yearProduced,
    description: req.body.item.description,
    estimatedPrice: {
      min: req.body.item.minEstimatedPrice,
      max: req.body.item.maxEstimatedPrice
    },
    categoryInfo: {
      drawingMedium: req.body.item.drawingMedium,
      paintingMedium: req.body.item.paintingMedium,
      imageType: req.body.item.imageType,
      materialUsed: req.body.item.materialUsed,
      dimension: req.body.item.dimension,
      weight: req.body.item.weight,
      isFramed: req.body.item.isFramed
    },
    reservePrice: req.body.item.reservePrice,
    added_by: req.user._id,
    // images: [tempImages]
  }
  Item.findByIdAndUpdate(
      req.body.itemID,
      updates,
      (err, updatedItem) => {
        if(err) {return next(err);}

        if(updatedItem){
          console.log(updatedItem);
          req.flash('success', { msg: 'Item Successfully Updated.' });
          res.redirect('/admin/item');
        }
      }
    );

  // Item.findById({
  //   _id: req.params.id
  // }, (err, foundItem) => {
  //   if (err) {
  //     return next(err);
  //   } 
  //   if(foundItem){
  //     // foundItem.name= req.body.item.name;
  //     // foundItem.category= req.body.item.category;
  //     // foundItem.classification= req.body.item.classification;
  //     // foundItem.authorship= req.body.item.authorship;
  //     // foundItem.yearProduced= req.body.item.yearProduced;
  //     // foundItem.description= req.body.item.description;
  //     // foundItem.estimatedPrice.min= req.body.item.minEstimatedPrice;
  //     // foundItem.estimatedPrice.max= req.body.item.maxEstimatedPrice;
  //     // foundItem.categoryInfo.drawingMedium= req.body.item.drawingMedium;
  //     // foundItem.categoryInfo.paintingMedium= req.body.item.paintingMedium;
  //     // foundItem.categoryInfo.imageType= req.body.item.imageType;
  //     // foundItem.categoryInfo.materialUsed= req.body.item.materialUsed;
  //     // foundItem.categoryInfo.dimension= req.body.item.dimension;
  //     // foundItem.categoryInfo.weight= req.body.item.weight;
  //     // foundItem.categoryInfo.isFramed= req.body.item.isFramed;
  //     // foundItem.reservePrice= req.body.item.reservePrice;
  //     // // if(req.body.images){
  //     // //   foundItem.images = req.body.imagesArray;
  //     // // } else {
  //     // //   foundItem.images = req.files;
  //     // // }
  
  //     // foundItem.save((err) => {
  //     //   if (err) {
  //     //     return next(err);
  //     //   }
  //     //   req.flash('success', { msg: 'Item Successfully Updated.' });
  //     //   res.redirect('/admin/item');
  //     // });
  //   }
  // });
}


/* 
 * GET /admin/item/:id/sold
 * Lot Item Sales Form page
 */
exports.getSoldItemForm = (req, res, next) => {
  res.render('item/sold', {
    title: 'Sold item',
    selectedTab: 'sales',
    itemID: req.params.id
  });
}

/* 
 * PUT /admin/item/:id
 * Lot Item Editing page
 */
exports.postSoldItem = (req, res, next) => {
  console.log(req.body.sales);
  const updates = {
    salesPrice: req.body.sales.price,
    buyer: {
      id: req.body.sales.userID
    },
    sold_on: Date.now(),
    sold: true
  }

  Item.findByIdAndUpdate(req.params.id, updates, (err, updatedItem) => {
        if(err) {return next(err);}
        console.log("updatedItem");
        console.log(updatedItem);
        if(updatedItem){
          console.log(updatedItem);
          req.flash('success', { msg: 'Item Successfully Updated.' });
          res.redirect('/admin/item/' + updatedItem._id);
        }
    });
}


/* 
 * GET /admin/sales
 * Lot Item page
 */
exports.getItemSales = (req, res, next) => {
  Item.find({})
  .populate('buyer.id')
    .exec((err, founditems) => {
      if (err) {
        return next(err)
      }

      if (founditems) {
        res.render('item/salesList', {
          title: 'Sales',
          items: founditems,
          selectedTab: 'item'
        });
      }

      
    });
}