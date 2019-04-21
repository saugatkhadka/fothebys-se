const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
	uid: String, //lot reference number
	lot_number: Number,

	name: String,	
	category: String,	
	classification: String,

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
	},

	authorship: String,	
	yearProduced: Number,	
	itemDesc: String,

	provenanceDetail: String,
	conditionReport: String,

	auction: {
		id: {
	        type: mongoose.Schema.Types.ObjectId,
	        ref: "Auction"
     	}
    },

	reservePrice: String,
	estimatedPrice: {
		minEstimatedPrice: String,
		maxEstimatedPrice: String
	},
	salesPrice: Number,

	authentic: Boolean,

	appriaserName: String, // Use appraiser Object ID id possible
	dateAppraised: Date,

	notes: String,
	pictures: [String],

	seller: {
		id: {
	        type: mongoose.Schema.Types.ObjectId,
	        ref: "User"
     	},
	    name: String
	},

	buyer: {
		id: {
	        type: mongoose.Schema.Types.ObjectId,
	        ref: "User"
     	},
	    name: String
	}
	
}, {timestamps: true});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;