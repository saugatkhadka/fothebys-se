var mongoose = require("mongoose");
var User = require("../models/User");

var data = [
    {
      email: "test@email.com",
      password: "123456789",
      role: "admin",
      verification_status: true,
      profile: {
        title: "Mr",
        fname: "Saugat",
        lname: "K",
        location: "Napol",
        phone_number: 9865322154,
        // picture: req.body.user.picture
      },

      // joined_on: Date.now,

      // added_by: {
      //   id: req.user._id
      // },

      note: "Good guy",

      admin: {
        post: "Manager",
      },

      // buyer: {
      //   approved_status: req.body.user.buyer_approved_status,
      //   bank_account_no: req.body.user.buyer_bank_account_no,
      //   bank_sort_card: req.body.user.buyer_bank_sort_card
      // }
    } 
];

function seedDB(){

    // Removed all campgrounds
    // User.deleteMany({}, function(err){
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log("Removed Users");

    //     // Add some Users
    //     data.forEach((seed) => {
    //         User.create(seed, (err, user) => {
    //             if(err){
    //                 console.log(err);
    //             } else {
    //                 console.log("Added a User!");
    //                 // Add some comments
    //                 user.save();
    //             }
    //         });
    //     });
    // });

    // Add some Users
      data.forEach((seed) => {
          User.create(seed, (err, user) => {
              if(err){
                  console.log(err);
              } else {
                  console.log("Added a User!");
                  // Add some comments
                  user.save();
              }
          });
      });
}


// exporting function
module.exports = seedDB;