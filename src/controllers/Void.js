/*
* The Void.js script defines how the server sends data to the client
* I use this lame naming scheme to fit with the desired theme of the project
* Proper behavior requires access to the database
*/

var models = require('../models');
var Response = models.Response;

// Define the function that sends the user the page to chat with
var sendRedirect = function(request, response) {

	// This function is protected by middleware which requres the user to be logged in
	// This function executing means that a user is, in fact, logged in
	response.render('app');
};

// Define how the server sends down information to the user
var sendResponse = function(request, response) {

	// This function isn't explicitly protected by middleware because it shouldn't be called without already passing through it once
	// For safety's sake, make sure the user is logged in. If not, redirect them to the login page (root directory)
	if(!request.session.account) {
		return response.redirect('/');
	}

	var voidResponse = Response.ResponseModel.GetRandomEntry().toAPI();

	// The response is compacted into JSON format from the toAPI
	response.json(voidResponse);

};

module.exports.sendRedirect = sendRedirect;
module.exports.sendResponse = sendResponse;