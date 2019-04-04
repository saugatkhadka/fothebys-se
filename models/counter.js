const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
	lastCounter: Number, 
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
