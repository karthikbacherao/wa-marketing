const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

function processReply(m1) {
    const tokenArray = tokenizer.tokenize(m1.text.body.toLowerCase());


    if (tokenArray.includes("date") == true) {
        const date = new Date().toLocaleDateString();
        return (date);
    }

    else if (tokenArray.includes("month") == true) {
        const allmonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthindex = new Date().getMonth();
        const currentmonth = allmonth[monthindex];
        return currentmonth;
    }

    else if (tokenArray.includes("time") == true) {
        const time = new Date().toLocaleTimeString();
        return time;
    }

    else if (tokenArray.includes("day") == true) {
        const daysofweek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayofweekindex = new Date().getDay();
        const today = daysofweek[dayofweekindex];
        return (today);
    }

    return ("hmm... I have to learn to answer that");

}

module.exports = processReply;
