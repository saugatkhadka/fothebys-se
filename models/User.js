const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  tokens: Array,

  role: String,
  verification_status: {type: Boolean, default: 0},
  profile: {
    title: String,
    fname: String,
    lname: String,
    location: String,
    phone_number: String,
    picture: String
  },

  joined_on: {type: Date, default: Date.now},
  added_by: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    // username is a combination of fname and lname of an admin
    username: String
  },
  note: String,
  admin: {
    post: String
  },
  buyer: {
    approved_status: String,
    bank_account_no: String,
    bank_sort_card: String,
    item_bought: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
      }
    ],
    commission_bid: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
      }
    ],
  },
  seller: {
    item_sold: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
      }
    ],
    pending_sales: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
      }
    ],
  }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
UserSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
UserSchema.methods.gravatar = function gravatar(size) {
  if (!size) {
    size = 200;
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
