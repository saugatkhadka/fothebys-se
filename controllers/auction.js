/* eslint-disable no-undef */
var Auction = require("../models/Auction");
var Item = require("../models/Item");
var Bid = require("../models/CommissionBid");
const flash = require('express-flash');


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/* 
 * GET /admin/auction
 * auction page
 */
exports.getIndex = (req, res, next) => {
  Auction.find()
    .sort({
      _id: -1
    })
    .exec((err, foundAuctions) => {
      if (err) {
        return next(err)
      }
      if (foundAuctions) {
        res.render('auction/index', {
          title: 'Auction List',
          selectedTab: 'auction',
          auctions: foundAuctions
        });
      }
    });

}


/* 
 * GET /admin/auction/new
 * new auction page
 */
exports.getNewAuction = (req, res, next) => {

  res.render('auction/new', {
    title: 'Auction List',
    selectedTab: 'auction'
  });

}


/* 
 * POST /admin/auction
 * Lot Item Create Route
 */
exports.postAuction = (req, res, next) => {

  Auction.create(req.body.auction, function(err, newlyCreated){
    if(err){return next(err)}
    console.log("Auction Created");
    
    console.log(newlyCreated);
    
    req.flash('success', {msg: "Auction Created"});
    return res.redirect('/admin/auction');
  });
}


/* 
 * DELETE /admin/auction/:id
 * Auction Detetion page
 */
exports.deleteItem = (req, res, next) => {
  Auction.findByIdAndDelete(req.params.id, (err) => {
    if (err) {
      return next(err);
    } else {
      console.log("Auction successfully deleted");
      res.redirect("back");
    }
  });
}


/* 
 * GET /admin/auction/:id
 * auction page
 */
exports.getAuction = (req, res, next) => {

  Auction.findById(req.params.id)
    .populate('lotItems')
    .exec((err, foundAuction) => {
      if (err) {
        return next(err)
      }

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
        .populate('bids')
        .exec((err, founditems) => {
          if (err) {
            return next(err)
          }
          // TODO: Implement a way to display errors for already exisiting item
          
          if (founditems) {
            // console.log(founditems);
            res.render('auction/view', {
              title: 'Items',
              items: founditems,
              auction: foundAuction,
              selectedTab: 'item'
            });
            // res.send(founditems);
          }
        });
      } else {
        if (foundAuction) {
          res.render('auction/view', {
            title: 'Auction',
            selectedTab: 'auction',
            auction: foundAuction,
            items: ''
          });
        }
      }

      
    });
}


/* 
 * POST /admin/auction/:id/item/:itemID
 * Item add to auction Route
 */
exports.postAuctionItem = (req, res, next) => {
  Auction.findById(req.params.id)
    .exec((err, auction) => {
      if(err){return next(err);}
      var itemUpdates;
      if(auction.lotItems.toString().includes(req.params.itemID)){
        console.log("auction tested first");
        console.log(auction.lotItems.toString().includes(req.params.itemID));

      } else {
        itemUpdates = {
          auction: {
            id: auction._id
          }
        }
      }

      var url_redirect;
      Item.findByIdAndUpdate(req.params.itemID, itemUpdates, (err, updatedItems) => {
        if(err) { return next(err);}
        if(itemUpdates){
          Auction.findByIdAndUpdate(req.params.id, {$push : { lotItems : updatedItems }}, {new: true, upsert: true}, (err, updatedAuction) => {
            if(err) {return next(err);}
    
            console.log("Item Added to auction");
            console.log(updatedAuction);
            req.flash('success', { msg: "Item added to Auction" });
            url_redirect = '/admin/auction/' + updatedAuction._id ;
            res.redirect(url_redirect);
         });
        } else {
          req.flash('success', { msg: "Item added to Auction" });
          res.redirect('/admin/auction/' + auction._id);
         }    
      });
  });


}

/* 
 * GET /admin/auction/:id/item/:itemID/bid
 * new item commision bid page
 */
exports.getBidItemForm = (req, res, next) => {

  res.render('auction/bid', {
    title: 'Commission Bid',
    selectedTab: 'auction',
    itemID: req.params.itemID,
    auctionID: req.params.id
  });

}


/* 
 * POST /admin/auction/:id/item/:itemID/bid
 * new item commision bid route
 */
exports.postBidItemForm = (req, res, next) => {
  var bidObj = new Bid({
    auction: req.body.bid.auctionID,
    item: req.body.bid.itemID,
    bidder_name: req.user.profile.fname + ' ' + req.user.profile.lname,
    bidder: req.user._id,
    opening_amount: req.body.bid.opening,
    maximum_amount: req.body.bid.maximum
  });

  console.log(bidObj);
  

  bidObj.save((err)=> {
    if(err) {return next(err);}

    console.log("Bid added to item");
    console.log(bidObj);

    Item.findByIdAndUpdate(req.body.bid.itemID, {'$push' :{bids: bidObj._id}}, (err, updatedItem) => {
      if(err) {return next(err)}
  
      console.log('after item is updated');
      console.log(updatedItem);
      

      req.flash('success', { msg: "Bid added to item" });
      url_redirect = '/admin/auction/' + req.body.bid.auctionID ;
      res.redirect(url_redirect);
    });
  
    
    
  });


}


/* 
 * GET /admin/commissionbids
 * commissionbids page
 */
exports.getCommissionBids = (req, res, next) => {
  var foundBids
  Bid.find({})
    .populate('auction')
    .populate('item')
    .populate('bidder')
    .exec((err, foundBids) => {
      if (err) {
        return next(err)
      }
      console.log("Found Bids");
      console.log(foundBids);
        res.render('auction/catalogue', {
          title: 'Auction List',
          selectedTab: 'auction',
          bids: foundBids
        });
    });

}