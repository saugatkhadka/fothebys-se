const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
	title: String,	
	category: String,	
	classification: String,	
	artistName: String,	
	yearProduced: String,	
	itemDesc: String,	
	auctionDate: String,	
	estimatedPrice: String
}, {timestamps: true});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;