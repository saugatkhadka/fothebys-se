var Item = require("../models/Item");
var Counter = require('../models/Counter');

/* 
* GET /admin/item
* Lot Item List page
*/
exports.getItemList = (req, res, next) => {

    Item.find({},(err, founditems) => {
        if(err) {return next(err)};
        // TODO: Implement a way to display errors for already exisiting item
        if(founditems) {
            // console.log(founditems);
            res.render('admin/item', {
                title: 'Items',
                items: founditems,
                selectedTab: 'item'
            });
        };
    });
}


/* 
* POST /admin/item
* Lot Item Create Route
*/
exports.postItem = (req, res, next) => {

    // Creates/Initializes the counter for the first time
    Counter.create({lastCounter: 0}, (err, counter) => {
      if(err) {
        console.log("ERROR WITH THE COUNTER");
        res.redirect("back");
      } else {
        counter.save();
        console.log("COUNTER SAVED");
        res.redirect("back");
      }
    });


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
}


/* 
* GET /admin/item/new
* Lot Item Registration Form page
*/
exports.getItemCreate = (req, res, next) => {
    res.render('admin/addItem', {
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
        if(err) {return next(err); }
        else {
            console.log("Item successfully deleted");
            res.redirect("back");
        }
    });
}

/* 
* PUT /admin/item/:id/edit
* Lot Item Editing page
*/
exports.getItemEdit = (req,res, next) => {
    Item.findById({_id: req.params.id}, (err, foundItem) => {
        if(err) {
            return next(err);
            //TODO: Add a error message on return
            // console.log("Item not found");
            // res.redirect("back");
        } else {
            res.render('admin/editItem', {
                title: "Edit Item",
                item: foundItem,
                selectedTab: 'item'
            });
        }
    });
}
