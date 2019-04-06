const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
	uid: String,
	title: String,	
	category: String,	
	classification: String,	
	artistName: String,	
	yearProduced: Number,	
	itemDesc: String,	
	auctionDate: String,	
	estimatedPrice: {
		min: String,
		max: String
	},
	categoryInfo: {
		drawingMedium: String,
		paintingMedium: String,
		imageType: String,
		materialUsed: String,
		isFramed: Boolean,
		dimensions: {
			height: Number,
			length: Number,
			width: Number
		},
		weight: Number
	}
}, {timestamps: true});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;