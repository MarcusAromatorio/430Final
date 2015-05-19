/*
 * The Response.js file describes the schema to provide text or links to the user when desired
 * The schema has two data points that the client uses: referral and displayText
 *
**/

// Grab mongoose to interface with MongoDB
var mongoose = require('mongoose');

// Declare the ResponseModel, to be made by mongoose
var ResponseModel;

// Define the schema by which mongoose assembles the model
var ResponseSchema = new mongoose.Schema({
	// displayText is the string that is rendered by the webpage
	displayText: {
		type: String,
		required: true,
		match: /^[A-Za-z0-9_\-\.]{1,16}$/
	},

	link: {
		type: Boolean,
		required: true
	},

	referral: {
		type: String,
		required: false,
		match: /^[A-Za-z0-9_\-\.]{1,16}$/
	}
});

// Define a static method that populates the database with default entries
ResponseSchema.statics.populateDataBase = function() {
	// This method only populates the database if the database doesn't already have a special entry
	// The presence of this special entry skips the population process - implying it is already done
	var shouldPopulate = false;
	// Define the callback that determines whether to populate the database
	function popCallback(error, doc) {
		if(error) {
			return; // Failure
		}
		if(!doc) {
			shouldPopulate = true;
		}
	}
	// Define the search key
	var search = {
		displayText: 'How can mirrors be real if our eyes arent real?'
	};

	ResponseModel.findOne(search, popCallback);

	if(shouldPopulate) {
		// Make a few default entries for the database
		var void1 = {
			displayText: 'How can mirrors be real if our eyes arent real?',
			link: false
		};

		var void2 = {
			displayText: 'The void does not give good advice.',
			link: false
		};

		var void3 = {
			displayText: 'Try not to lose too much time here!',
			link: true,
			referral: 'http://www.reddit.com'
		};

		var void4 = {
			displayText: 'The Institute that the site author attended.',
			link: true,
			referral: 'http://www.rit.edu'
		};

		// Create models from each of the default entries
		var entry1 = ResponseModel(void1);
		var entry2 = ResponseModel(void2);
		var entry3 = ResponseModel(void3);
		var entry4 = ResponseModel(void4);

		// Define the error callback for saving the new entries
		function errorCallback(error) {
			if(error) {
				console.log(error);
			}
		}

		entry1.save(errorCallback);
		entry2.save(errorCallback);
		entry3.save(errorCallback);
		entry4.save(errorCallback);
	}

};

ResponseSchema.methods.toAPI = function() {
	// _id is built into the MongoDb document and is guaranteed to be unique
	return {
		displayText: this.displayText,
		link: this.link,
		referral: this.referral
	};
};

// Function to return a random database entry
ResponseSchema.statics.GetRandomEntry = function() {
	// Count database entries
	var count = ResponseModel.count().exec(function(err, count) {return count});
	// Define the random number
	var random = Math.floor(Math.random() * count);

	// Skip to the desired document within the database
	var doc = ResponseModel.findOne().skip(random).exec(
		function returnResult(err, result) {
			return result;
		});
	return doc;
};

// Define the ResponseModel now, using the given schema
ResponseModel = mongoose.model('Response', ResponseSchema);

// Add the model and schema to the module exports
module.exports.ResponseModel = ResponseModel;
module.exports.ResponseSchema = ResponseSchema;