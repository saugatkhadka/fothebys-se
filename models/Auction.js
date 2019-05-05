/* eslint-disable no-mixed-spaces-and-tabs */
const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    name: String,
    theme_type: String,
    theme: String,
    description: String,
    location: String,
    date: Date,
    period: String,
    lotItems: [
        {
            type: mongoose.Schema.Types.ObjectId,
	        ref: "Item"
        }
    ],
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true});

const Auction = mongoose.model('Auction', auctionSchema);

module.exports = Auction;