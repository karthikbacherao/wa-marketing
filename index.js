const logger = require('ololog');
const replytoadmin = require('./reply.js');

/*
 * One more task: install loggly (search for npm loggly)
 * create a loggly account. https://www.loggly.com/
 * and configure it to send logs to your loggly account.
 */

/*
 * WhatsApp API Message Handler.
 */
async function init() {
	logger.green("initializing whatsapp api handler...");
}

/*
 * Handle messages from Customers.
 * Returns an object with a response type and response.
 * Response: {
 * 	 responseType: "text"
 * 	 text: "text response",
 * }
 */
async function handleCustomerMessage(m) {

	var response = null;

	/*
	 * On receiving a message, identify the type, intent 
	 * and respond accordingly.
	 */
	logger.blue("message received from: ", m.from, " message: ", m);

	// Respond to "hi" with "Hello, how are you?"
	if (m.type == "text" &&
		m.text.body == "hi") {

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
 * 
 */
async function handleAdminMessage(m) {

	var response = null;

	logger.yellow("message received from admin: ", m);
	// If Hello, respond with a greeting
	if (m.type == "text" &&
		(m.text.body == "Hello" || m.text.body == "hello")) {
		response = {
			responseType: "text",
			text: "Hello, how can I help?",
		};
		logger.yellow("response: " + JSON.stringify(response));
		return response;
	}
	// Respond to sentence queries ex: what is the date / day / time etc.
	else {
		(m.type == "text")
		response = {
			responseType: "text",
			text: result,
		}
		let result = replytoadmin(m);
		logger.blue("response: " + JSON.stringify(response));

	}
	/* // if Date, respond with the current date
	else if (m.type == "text" && m.text.body == "Date") {
		let fd = formatDate();
		response = {
			responseType: "text",
			text: fd,
		}
		logger.yellow("response: " + JSON.stringify(response));
		return (response);
	}
	// if Time, respond with current local time
	else if (m.type == "text" && m.text.body == "Time") {
		let ft = formatTime();
		response = {
			responseType: "text",
			text: ft,
		}
		logger.yellow("response: " + JSON.stringify(response));
		return (response);
	} */


	// return { responseType: "text", text: "Admin message received" };

}

module.exports =
{
	init,
	handleCustomerMessage,
	handleAdminMessage
};

/* function formatDate() {
	let cd = new Date();
	let fd = cd.toLocaleDateString();
	return fd;
}

function formatTime() {
	let cd = new Date();
	let ft = cd.toLocaleTimeString();
	return ft;
} */