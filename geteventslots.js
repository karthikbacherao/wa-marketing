const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentDay = new Date().getDay();
const currentTime = Date.now();
const currentHour = new Date().getHours();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://bskarthik:bskbhag123@cluster0.xkvbtje.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function weeklySchedule() {
    let nextSlotDay = currentDay + 1;
    let newDay;
    let outputArray = [];
    let oneSlot = [];
    await client.connect();

    const db = client.db("eventMaster");


    for (let count = 0; count <= 2; count++) {

        if (nextSlotDay >= 6 || nextSlotDay === 0) {
            newDay = 1;
        }
        else {
            newDay = 0;
        }

        if (currentDay === 5 && currentHour >= 20) {
            nextSlotDay = 1;

        }

        // change the collection to on the next working day

        let tempDay = daysOfWeek[(nextSlotDay % 6) + newDay];

        let temp = 'cn' + tempDay;

        let collName = db.collection(temp);

        // delete outdated events
        await collName.deleteMany({ eventTime: { $lt: currentTime } });

        //if no events on working day, display the whole day as available 
        // and increment to the next working day
        let docCount = await collName.countDocuments({});

        if (docCount === 0) {
            outputArray.push(`Time Slots available on ${daysOfWeek[(nextSlotDay % 6) + newDay]}#`);
            outputArray.push(`8:00:00 am to 8:00:00 pm#`);
            nextSlotDay++;
            continue;
        }

        const result = await collName.find().sort({ eventTime: 1 }).toArray();
        try {

            if (result !== null || result === undefined) {
                let len = result.length;

                outputArray.push(`Time Slots available on ${tempDay}#`);

                if (result.length === 1) {
                    oneSlot.push(result[0].eventTime - result[0].eventStartTime);
                    oneSlot.push(result[0].eventEndTime - result[0].eventTime);

                    if (oneSlot[0] < oneSlot[1]) {
                        outputArray.push(`From ${new Date(result[0].eventTime).toLocaleTimeString()} to ${new Date(result[0].eventEndTime).toLocaleTimeString()}#`);
                        nextSlotDay++;
                        oneSlot = [];
                        continue;
                    }
                    else {
                        outputArray.push(`From ${new Date(result[0].eventStartTime).toLocaleTimeString()} to ${new Date(result[0].eventTime).toLocaleTimeString()}#`);
                        nextSlotDay++;
                        oneSlot = [];
                        continue;
                    }

                }
                else {
                    oneSlot.push(result[0].eventTime - result[0].eventStartTime);
                    for (let m = 0; m < len - 1; m++) {

                        oneSlot.push(result[m + 1].eventTime - result[m].eventTime);
                    }
                    oneSlot.push(result[len - 1].eventEndTime - result[len - 1].eventTime);
                }

                const maxFree = Math.max(...oneSlot);
                const finalSelect = oneSlot.indexOf(maxFree);

                if (finalSelect === 0) {
                    outputArray.push(`From ${new Date(result[0].eventStartTime).toLocaleTimeString()} to ${new Date(result[0].eventTime).toLocaleTimeString()}#`);
                    oneSlot = []
                }
                else if (finalSelect === (oneSlot.length - 1)) {
                    outputArray.push(`From ${new Date(result[finalSelect - 1].eventTime).toLocaleTimeString()} to ${new Date(result[finalSelect - 1].eventEndTime).toLocaleTimeString()}#`);
                    oneSlot = []
                }
                else {

                    outputArray.push(`From ${new Date(result[finalSelect - 1].eventTime).toLocaleTimeString()} to ${new Date(result[finalSelect].eventTime).toLocaleTimeString()}#`);
                    oneSlot = []
                }

            }
        } catch (error) {
            console.error(error);
        }
        nextSlotDay++;
    }
    await client.close();
    JSON.stringify(outputArray);
    const newline = outputArray.join(' ').replace(/#/g, '\n');
    return (newline);
}

module.exports = weeklySchedule;

