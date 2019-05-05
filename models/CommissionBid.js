/* eslint-disable no-mixed-spaces-and-tabs */
const mongoose = require('mongoose');

const commissionBidSchema = new mongoose.Schema({
	auction: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Auction"
	},
	item : {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Item"
	},
	bidder_name: String,
	bidder: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	opening_amount: String,
	maximum_amount: String,

}, {timestamps: true});

const CommissionBid = mongoose.model('CommissionBid', commissionBidSchema);

module.exports = CommissionBid;