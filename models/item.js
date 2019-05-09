/* eslint-disable no-mixed-spaces-and-tabs */
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
	reference_no: String, //lot reference number
	lot_number: Number,

	name: String,	
	category: String,	
  classification: String,
  images: [
      {    
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number
    }
  ],

	categoryInfo: {
		drawingMedium: String,
		paintingMedium: String,
		imageType: String,
		materialUsed: String,
		isFramed: Boolean,
		dimension: String,
		weight: Number
	},

	authorship: String,	
	yearProduced: String,	
	description: String,

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
		min: String,
		max: String
	},
	salesPrice: Number,
	sold_on: Date,
	sold: Boolean,
  notes: String,
  bids: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "CommissionBid"
	 	}
	],
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
  },
  evaluation_requested: Boolean,
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {timestamps: true});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;