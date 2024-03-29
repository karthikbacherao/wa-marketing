const logger = require('ololog');
const natural = require('natural');
const tokenizer = new natural.RegexpTokenizer({ pattern: /\s+/ });
const times = require('./times');
const callApp = require('./calendarApp');
const getSchedule = require('./geteventschedule');
const getSlots = require('./geteventslots');

/*
 * One more task: install loggly (search for npm loggly)
 * create a loggly account. https://www.loggly.com/
 * and configure it to send logs to your loggly account.
 */

/*
 * WhatsApp API Message Handler.
 */
async function init() {
	logger.blue("initializing whatsapp api handler...");
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
			text: "Hello, what is your query",
		};
		logger.yellow("response: " + JSON.stringify(response));
		return response;
	}

	else if (m.type == "text" && m.text.body != "Hello") {
		let tokenArray = tokenizer.tokenize(m.text.body.toLowerCase());


		let fn = await processInput(tokenArray)

		response = {
			responseType: "text",
			text: fn,
		}

		//logger.yellow("response: " + JSON.stringify(response));
		return (response);
	}

	return { responseType: "text", text: "Admin message received" };

}


async function processInput(tokenArray) {

	let response;
	for (let i = 0; i < tokenArray.length; i++) {
		const token = tokenArray[i];
		if (token === "add" || token === "delete" && token === "event") {
			response = await callApp.calAppMain(tokenArray);
			return response;
		}
		else if (token === "slots") {
			response = await getSlots();
			return response;
		}
		else if (token === "schedule") {
			response = await getSchedule();
			return response;
		}

		else if (token === "date" || token === "time" || token === "day" || token === "month") {
			return times(tokenArray);

		}
	}

}

module.exports =
{
	init,
	handleCustomerMessage,
	handleAdminMessage
};
