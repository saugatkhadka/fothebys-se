var User = require("../models/User");
const flash = require('express-flash');


/* 
* GET /admin
* Admin Dashboard page
*/
exports.getDashboard = (req, res, next) => {
  // console.log(req);
    res.render('admin/admin', {
        title: 'Admin Dashboard',
        selectedTab: 'home'
    });
}

