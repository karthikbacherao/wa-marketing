const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentDay = new Date().getDay();
const currentTime = Date.now();
const currentHour = new Date().getHours();
const currentMinutes = new Date().getMinutes();
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bskarthik:bskbhag123@cluster0.xkvbtje.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function weeklySchedule() {
    var nextSlotDay = currentDay;
    var newDay;
    let outputArray = [];
    await client.connect();
    console.log("connected to database eventMaster");
    const db = client.db("eventMaster");


    for (let count = 0; count <= 2; count++) {

        if (nextSlotDay >= 6 || nextSlotDay === 0) {
            newDay = 1;
        }
        else {
            newDay = 0;
        }

        if (nextSlotDay === 5 && currentHour >= 20 && nextSlotDay !== 6 && nextSlotDay !== 0) {
            nextSlotDay = 1;
        }


        // change the collection to on the next working day
        //console.log(nextSlotDay, currentHour);
        let tempDay = daysOfWeek[(nextSlotDay % 6) + newDay];
        let temp = 'cn' + tempDay;

        let collName = db.collection(temp);

        // delete outdated events
        await collName.deleteMany({ eventTime: { $lt: currentTime } });

        //if no events on working day, display the whole day as available 
        // and increment to the next working day
        let docCount = await collName.countDocuments({});

        if (docCount === 0 && nextSlotDay !== currentDay) {
            outputArray.push(`Time Slots available on ${daysOfWeek[(nextSlotDay % 6) + newDay]}#`);
            outputArray.push(`8:00:00 am to 8:00:00 pm#`);
        }
        else if (docCount === 0 && nextSlotDay === currentDay && currentHour < 20) {
            outputArray.push(`Time Slots available on ${daysOfWeek[currentDay]}#`);
            outputArray.push(`${new Date().toLocaleTimeString()} to 8:00:00 pm#`);
            nextSlotDay++;
            continue;
        }
        //let outDatedEvent = await collName.deleteMany({ eventTime: { $lt: CurrentTime } });

        // console.log(`Obosolete event docs deleted ${outDatedEvent.deletedCount} from collection ${temp}`);

        const result = await collName.find().sort({ eventTime: 1 }).toArray();
        try {

            if (result !== null || result == undefined) {
                let len = result.length;
                // console.log("result length:" + result.length);
                outputArray.push(`Time Slots available on ${tempDay}#`);

                if (currentTime < result[0].eventStartTime) {
                    outputArray.push(`${new Date(result[0].eventStartTime).toLocaleTimeString()} to ${new Date(result[0].eventTime - 60000).toLocaleTimeString()}#`)
                }

                else {
                    outputArray.push(`${currentTime.toLocaleString()} to ${new Date(result[0].eventTime - 60000).toLocaleTimeString()}#`);
                }
                for (let m = 0; m < result.length; m++) {
                    if (m === result.length - 1) { break; }
                    outputArray.push(`${new Date(result[m].eventTime + 60000).toLocaleTimeString()} to ${new Date(result[m + 1].eventTime - 60000).toLocaleTimeString()}#`);
                }

                outputArray.push(`${new Date(result[len - 1].eventTime + 60000).toLocaleTimeString()} to ${new Date(result[0].eventEndTime).toLocaleTimeString()}#`);
            }
        } catch (error) {
            console.error(error);
        }
        nextSlotDay++;
    }

    await client.close();
    console.log("disconnected from db");

    JSON.stringify(outputArray);
    const newline = outputArray.join(' ').replace(/#/g, '\n');
    console.log(newline);
}

module.exports = weeklySchedule;