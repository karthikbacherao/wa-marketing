const natural = require('natural');
const tokenizer = new natural.WordTokenizer();


function replyquery(query) {

    const tokens = tokenizer.tokenize(query.toLowerCase());

    if (tokens.includes("date")) {
        const myquery = new Date();
        const formattedquery = myquery.toLocaleDateString();
        return (formattedquery);

    }

    else if (tokens.includes("time")) {
        const myquery = new Date();
        const formattedquery = myquery.toLocaleTimeString();
        return (formattedquery);

    }

    else if (tokens.includes("day")) {
        const daysofweek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const mydate = new Date();
        const dayofweekindex = mydate.getDay();
        const today = daysofweek[dayofweekindex];
        return (today);
    }
    else return ("I need to learn that!")
}


module.exports = replyquery;
