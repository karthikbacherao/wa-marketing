
function processReply(tokenArray) {

    if (tokenArray.includes("date")) {
        const date = new Date().toLocaleDateString();
        return date;
    }

    else if (tokenArray.includes("month")) {
        const allmonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthindex = new Date().getMonth();
        const currentmonth = allmonth[monthindex];
        return currentmonth;
    }

    else if (tokenArray.includes("time")) {
        const time = new Date().toLocaleTimeString();
        return time;
    }

    else if (tokenArray.includes("day")) {
        const daysofweek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayofweekindex = new Date().getDay();
        const today = daysofweek[dayofweekindex];
        return today;
    }

    return ("no response");

}

module.exports = processReply;