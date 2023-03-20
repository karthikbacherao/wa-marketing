const logger = require('ololog');



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

	else if (m.type == "text" && m.text.body == "Date") {
		let fd = new Date().toLocaleDateString();
		response = {
			responseType: "text",
			text: fd,
		}
		logger.yellow("response: " + JSON.stringify(response));
		return (response);
	}
	// if Time, respond with current local time
	else if (m.type == "text" && m.text.body == "Time") {
		let ft = new Date().toLocaleTimeString();
		response = {
			responseType: "text",
			text: ft,
		}
		logger.yellow("response: " + JSON.stringify(response));
		return (response);
	}

	else if (m.type == "text" && m.text.body == "Day") {
		let fd = formatDay();
		response = {
			responseType: "text",
			text: fd,
		}
		logger.yellow("response: " + JSON.stringify(response));
		return (response);
	}

	else if (m.type == "text" && m.text.body == "Month") {
		let fm = formattedMonth();
		response = {
			responseType: "text",
			text: fm,
		}
		logger.yellow("response: " + JSON.stringify(response));
		return (response);

	}
	// check sentence for month
	else if (typeof m.text.body == "string" && (m.text.body.includes("month") || m.text.body.includes("Month"))) {
		let fm = formattedMonth();
		response = {
			responseType: "text",
			text: fm,
		}
		logger.yellow("response: " + JSON.stringify(response));
		return (response)
	}
	return { responseType: "text", text: "Admin message received" };

}


module.exports =
{
	init,
	handleCustomerMessage,
	handleAdminMessage
};

function formattedMonth() {
	const monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	const currentMonthIndex = new Date().getMonth();
	const month = monthList[currentMonthIndex];
	return (month);
}

function formatDay() {
	const daysofweek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const dayofweekindex = new Date().getDay();
	const today = daysofweek[dayofweekindex];
	return (today);
}

