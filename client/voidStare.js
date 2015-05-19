/*
* This script is attached to the application where the user "calls" the server to "chat"
* On this page exists a form whose submission sends a POST event to the server
* When POSTing, the server takes the message from the body, and forms a response out of it
* The response is added to the chatWindow div on the application's document
*/

"use strict";

$(document).ready(function() {

	// When the user decides to post a message to Cat
	function postChatMessage(message) {
		// Wrap the message in HTML to style it properly
		var wrapped = "<p class=\"sent\">You: " + message + "</p>";

		// Add the message to the chat window
		$("#chatWindow").append(wrapped);
	}


	// Describe how the application handles errors
	function handleError(message) {
		// Just log the message to the console of the window
		console.log("Error: " + message);
		$("#errorMessage").text(message);
	}

	// Describe how the ajax request is formatted
	function sendAjax(action, data) {
		$.ajax({
			cache: false,
			type: "POST",
			url: action,
			data: data,
			dataType: "json",
			success: function(result, status, xhr){
				// Responses may be text or links, and so are differentiated between via a flag
				// Links are given special treatment to render correctly
				var response = "<p>The Void stares back</p>";

				// See if the result is a referral link
				if(result.link) {
					response += "<a class=\"voidLink\" href=" + result.referral + ">" + result.displayText + "</a>";
				}
				else {
					response += "<p>" + result.displayText + "</p>";

				// Add the response to the chat window
				$("#voidReturn").html(response);

			},
			error: function(xhr, status, error) {
				var messageObject = JSON.parse(xhr.responseText);
				handleError(messageObject.error);
			}
		});
	}

	// Attach the event listener to the submitMessage link
	$("#stare").on("click", function(e) {
		e.preventDefault();

		// Send the message to the server
		sendAjax('/void', {});
	});
});