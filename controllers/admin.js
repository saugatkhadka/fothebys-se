var User = require("../models/User");


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

/* 
* GET /admin/user
* User List page
*/

exports.getUserList = (req, res, next) => {
  User.find({}, (err, foundUsers) => {
    if(err) {return next(err);}
    if(foundUsers){
      res.render('admin/user', {
        title: "Users",
        selectedTab: 'user',
        users: foundUsers
      });
    }
  });
}


/* 
* POST /admin/user
* User Create Route
*/
exports.postUser = (req, res, next) => {

  // // Creating User

  const user = new User({
      email: req.body.user.email,
      password: req.body.user.password,
      role: req.body.user.role,
      verification_status: req.body.user.approved_status,
      profile: {
        title: req.body.user.title,
        fname: req.body.user.fname,
        lname: req.body.user.lname,
        location: req.body.user.location,
        phone_number: req.body.user.phone_number,
        picture: req.body.user.picture
      },
      

      joined_on: req.body.user.joined_on,

      added_by: {
        id: req.body.user.adminId,
        username: req.body.user.adminUserName,
      },

      note: req.body.user.note,

      admin: {
        post: req.body.user.admin_post,
      },

      buyer: {
        approved_status: req.body.user.buyer_approved_status,
        bank_account_no: req.body.user.buyer_bank_account_no,
        bank_sort_card: req.body.user.buyer_bank_sort_card
      }
  });

  console.log("From User Post");
  console.log(req.body.user);


  // Saving the User
  User.findOne({
    email: req.body.user.email
    },(err, foundUser) => {
        if(err) {return next(err)};
        // TODO: Handle error if the user is already created
        user.save((err) => {
            if(err) {return next(err)};

            console.log("User Successfully Added");
            // Runs onlt if the user is found the db
            // console.log(foundUser);
            // Redirects back after success
            res.redirect("/admin/user");
        });
    }
  );
}

/* 
* GET /admin/user/new
* User Create Form Route
*/
exports.getUserForm = (req, res, next) => {
  res.render('admin/addUser', {
    title: "Add Users",
    selectedTab: 'user',
  });
}