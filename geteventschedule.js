const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentDay = new Date().getDay();
const currentTime = Date.now();
const currentHour = new Date().getHours();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bskarthik:bskbhag123@cluster0.xkvbtje.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function weeklySchedule() {
    let outputArray = [];

    await client.connect();
    //console.log("connected to db");
    for (const days in daysOfWeek) {
        const db = client.db('eventMaster');
        const col = `cn${daysOfWeek[days]}`;
        //console.log(col, days);
        if (col === 'cnSunday' || col === 'cnSaturday') {

            continue;
        }
        else if (currentDay === 5 && currentHour >= 20) {
            outputArray = ["No events scheduled for the weekend"];
            break;
        }

        else if (parseInt(days, 10) === currentDay && currentHour >= 20 || parseInt(days, 10) < currentDay) {
            continue;
        }
        const collection = db.collection(col);
        const count = await collection.countDocuments({});
        if (count === 0) {
            continue;
        }
        await collection.deleteMany({ eventTime: { $lt: currentTime } })
        let result = await collection.find().sort({ eventTime: 1 }).toArray();
        if (result === null && currentHour < 20) {
            continue;
        }
        else {
            outputArray.push(`Events on ${result[0].day}#`);
            for (let time of result) {
                outputArray.push(`${time.title} ${new Date(time.eventTime).toLocaleTimeString()}#`);
            }
        }
        /* for (let string of outputArray) {
            console.log(string);
        } */
    }

    await client.close();
    JSON.stringify(outputArray);
    const newline = outputArray.join(' ').replace(/#/g, '\n');
    return newline;
}



module.exports = weeklySchedule;