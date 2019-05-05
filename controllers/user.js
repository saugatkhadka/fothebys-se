var User = require("../models/User");
const flash = require('express-flash');

/* 
* GET /admin/user
* User List page
*/
exports.index = (req, res, next) => {
  User.find({}, (err, foundUsers) => {
    if(err) {return next(err);}
    if(foundUsers){
      res.render('user/index', {
        title: "Users",
        selectedTab: 'user',
        users: foundUsers
      });
    }
  });
}


/* 
* GET /admin/user/new
* User Create Form Route
*/
exports.getNewUser = (req, res, next) => {
  res.render('user/new', {
    title: "Add User",
    selectedTab: 'user',
  });
}


/* 
* GET /admin/user/:id
* User VIEW Route
*/
exports.getUser = (req, res, next) => {
	User.findOne({_id: req.params.id}, (err, foundUser) => {
		if(err) {return next(err)};
	  res.render('user/view', {
	    title: "User",
	    selectedTab: 'user',
	    foundUser: foundUser
	  });
	});
}

/* 
* DELETE /admin/user/:id
* User Delete Route
*/
exports.deleteUser = (req, res, next) => {
  console.log(req.body.current_user_id);
  console.log(req.params.id);
  if(req.params.id == req.body.current_user_id) {
    req.flash('errors', 'Cannot delete current account');
    return res.redirect("/admin/user");
  }

  User.findByIdAndDelete(req.params.id, (err) => {
      if(err) {return next(err); }
      else {
        console.log("User successfully deleted");
        res.redirect("/admin/user");
      }
  });
}

/* 
* GET /admin/user/:id/edit
* User EDIT Route
*/
exports.getEditUser = (req, res, next) => {
	User.findOne({_id: req.params.id}, (err, foundUser) => {
		if(err) {return next(err)};
	  res.render('user/edit', {
	    title: "Edit User",
	    selectedTab: 'user',
	    foundUser: foundUser
	  });
	});
}



/* 
* POST /admin/user
* User Create Route
*/
exports.postUser = (req, res, next) => {
	// Creating User
  // const user = new User({
  //     email: req.body.user.email,
  //     password: req.body.user.password,
  //     role: req.body.user.role,
  //     verification_status: true,
  //     profile: {
  //       title: req.body.user.title,
  //       fname: req.body.user.fname,
  //       lname: req.body.user.lname,
  //       location: req.body.user.location,
  //       phone_number: req.body.user.phone_number,
  //       picture: req.body.user.picture
  //     },
      

  //     joined_on: req.body.user.joined_on,

  //     // added_by: {
  //     //   id: req.user._id
  //     // },

  //     note: req.body.user.note,

  //     admin: {
  //       post: req.body.user.admin_post,
  //     },

  //     buyer: {
  //       approved_status: req.body.user.buyer_approved_status,
  //       bank_account_no: req.body.user.buyer_bank_account_no,
  //       bank_sort_card: req.body.user.buyer_bank_sort_card
  //     }
  // });

    const user = {
      email: req.body.user.email,
      password: req.body.user.password,
      role: req.body.user.role,
      verification_status: true,
      profile: {
        title: req.body.user.title,
        fname: req.body.user.fname,
        lname: req.body.user.lname,
        location: req.body.user.location,
        phone_number: req.body.user.phone_number,
        picture: req.body.user.picture
      },
      

      joined_on: req.body.user.joined_on,

      // added_by: {
      //   id: req.user._id
      // },

      note: req.body.user.note,

      admin: {
        post: req.user.admin_post,
      },

      buyer: {
        approved_status: req.body.user.buyer_approved_status,
        bank_account_no: req.body.user.buyer_bank_account_no,
        bank_sort_card: req.body.user.buyer_bank_sort_card
      }
  };

  User.create(user, (err, createdUser) => {
    if(err) {
      console.log("Shit hit the fan");
      return next(err);
    }
    if(createdUser) {
      console.log(createdUser);
      res.redirect('/admin/user');
    }
  });



  // console.log("Before the user saving process");
  // // Saving the User
  // User.findOne({
  //   email: req.body.user.email
  //   },(err, foundUser) => {
  //     if(err) {return next(err)};
  //     // TODO: Handle error if the user is already created
  //     user.save((err) => {
  //         if(err) {return next(err)};

  //         console.log("User Successfully Added");
  //         // Runs only if the user is found the db
  //         // console.log(foundUser);
  //         // Redirects back after success
  //         res.redirect("/admin/user");
  //     });
  //   }
  // );
  // console.log("After the user saving process");

}


/* 
 * PUT /admin/user/:id
 * User Editing page
 */
exports.putUser = (req, res, next) => {

  const updates = {
    email: req.body.user.email,
    password: req.body.user.password,
    role: req.body.user.role,
    verification_status: true,
    profile: {
      title: req.body.user.title,
      fname: req.body.user.fname,
      lname: req.body.user.lname,
      location: req.body.user.location,
      phone_number: req.body.user.phone_number,
      picture: req.body.user.picture
    },

    note: req.body.user.note,

    admin: {
      post: req.user.admin_post,
    },

    buyer: {
      approved_status: req.body.user.buyer_approved_status,
      bank_account_no: req.body.user.buyer_bank_account_no,
      bank_sort_card: req.body.user.buyer_bank_sort_card
    }
};


  User.findByIdAndUpdate(req.params.id, updates, (err, updatedUser) => {
        if(err) {return next(err);}
        console.log("updatedUser");
        console.log(updatedUser);
        if(updatedUser){
          console.log(updatedUser);
          req.flash('success', { msg: 'User Successfully Updated.' });
          res.redirect('/admin/user/' + updatedUser._id);
        }
    });
}