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
		minEstimatedPrice: String,
		maxEstimatedPrice: String
	},
	categoryInfo: {
		drawingMedium: String,
		paintingMedium: String,
		imageType: String,
		materialUsed: String,
		isFramed: Boolean,
		// TODO: Make the form accept diff values for height, length and width
		// dimensions: {
		// 	height: Number,
		// 	length: Number,
		// 	width: Number
		// },
		dimension: String,
		weight: Number
	}
}, {timestamps: true});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;