const logger = require('ololog'); 

/*
 * WhatsApp API Message Handler
 */
async function init() {
	logger.green("initializing...");
}

/*
 * Handle messages from Customers.
 * Returns an object with a response type and response.
 * Response: {
 * 	 responseType: "text"
 * 	 text: "text response",
 * }
 */
async handleCustomerMessage (m) {

	var response = null;

	/*
	 * On receiving a message, identify the type, intent 
	 * and respond accordingly.
	 */
	logger.blue("message received from: ", m.from, " message: ", m);

	// Respond to "hi" with "Hello, how are you?"
	if (m.type == "text" &&
		m.body == "hi") {

		// received a greeting, respond with a greeting
		response = {
			responseType: "text",
			text: "Hello, how are you?",
		};
	}

	logger.blue("response: " + JSON.stringify(response));
	return response;
}

/*
 * Handle messages from Admins.
 */
async handleAdminMessage (m) {

	var response = null;

	logger.yellow("message received from admin: " + m);

	return { responseType: "text", text: "Admin message received." };
}

module.exports =
{
	init,
	handleCustomerMessage,
	handleAdminMessage
};