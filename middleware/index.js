// var User = require("../models/User");

// var middlewareObj = {};

// middlewareObj.isAuthorized = (req, res, next) => {
//     if(req.isAuthenticated()){
//         if(req.user.role == "admin" || req.user.role == "staff"){
//             next();
//         } else {
//             req.flash("error", "You don't have permissions to access that");
//             res.redirect("back");
//         }
//     } else {
//         res.redirect('/login');
//     }
// }


// middlewareObj.isLoggedIn = function (req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     req.flash("error", "You need to be logged in to do that");
//     res.redirect("/login");
// }

// module.exports = middlewareObj;