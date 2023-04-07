const currentDate = new Date();
const newDate = new Date(currentDate);
const currentDay = new Date().getDay();
const CurrentTime = new Date().getTime();
const currentHour = new Date().getHours();

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://bskarthik:bskbhag123@cluster0.xkvbtje.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function calAppMain(ut) {

    const eventDetails = eventOrg(ut);

    if (typeof eventDetails === "string") {
        return (eventDetails);
    }

    else if (ut.text.body.includes("add") && ut.text.body.includes("event") && typeof eventDetails !== "string") {
        if (eventDetails !== null && typeof eventDetails === 'object') {
            return addEvent(eventDetails).then(showR1 => {
                return showR1;
            });


        }
    }

    else if (ut.text.body.includes("cancel") || ut.text.body.includes("delete") && ut.text.body.includes("event")) {
        //let eventDetails = eventOrg(ut);
        return deleteEvent(eventDetails).then(showR2 => {

            return (showR2);
        });
    }

    else if (ut.text.body.includes("get") && ut.text.body.includes("schedule")) {

        getEventSchedule();
    }

    else if (ut.text.body.includes("get") && ut.text.body.includes("free") && ut.text.body.includes("slot")) {
        nextAvailableSlot();
    }
    else {
        console.log("Enter/Delete an event or View your schedule");
    }

}




function eventOrg(ut) {

    if (ut.text.body.includes("get") && ut.text.body.includes("schedule")) {

        return null;
    }

    if (ut.text.body.includes("get") && ut.text.body.includes("free") && ut.text.body.includes("slot")) {
        return null;
    }

    var eventObj = null; // event variable with formatted event details to be fed to database
    //const checkDayInput = ['mon', 'tue', 'wed', 'thu', 'fri'];

    // capture event title & name from user input
    const str = ut.text.body;
    const eventTitleStart = str.indexOf("call ");
    const eventTitleEnd = str.indexOf(" at ");
    const et = str.substring(eventTitleStart, eventTitleEnd);

    // capture name of the person to call
    const etNameStart = str.indexOf("with ") + "with ".length;
    const etName = str.substring(etNameStart, eventTitleEnd);



    // parse the user input to capture event day
    const dayRegex = /(?<day>monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|sat|saturday|sun|sunday)/i;
    const dayCapture = ut.text.body.match(dayRegex);
    if (dayCapture !== null && dayCapture.groups !== undefined) {
        dayCapture.groups.day = dayCapture.groups.day.toLowerCase();


        switch (dayCapture.groups.day) {
            case 'mon':
            case 'monday':
                dayCapture.groups.day = 'Monday';
                break;
            case 'tue':
            case 'tuesday':
                dayCapture.groups.day = 'Tuesday';
                break;
            case 'wed':
            case 'wednesday':
                dayCapture.groups.day = 'Wednesday';
                break;
            case 'thu':
            case 'thursday':
                dayCapture.groups.day = 'Thursday';
                break;
            case 'fri':
            case 'friday':
                dayCapture.groups.day = 'Friday';
                break;
            case 'sat':
            case 'saturday':
                dayCapture.groups.day = 'Saturday';
            case 'sun':
            case 'sunday':
                dayCapture.groups.day = 'Sunday';
        }

    }
    const edm = daysOfWeek.indexOf(dayCapture.groups.day);

    //console.log(edm);
    // parse the user input to capture event time
    const timeRegex = /(?<hours>0?[1-9]|1[0-2])(?:[:.](?<minutes>0?\d{1,2}))?\s*(?<ampm>am|pm)/i;
    const timeCapture = ut.text.body.match(timeRegex);
    const oh = parseInt(timeCapture.groups.hours, 10);
    const om = parseInt(timeCapture.groups.minutes, 10);

    //console.log(timeCapture);

    if (timeCapture.groups.minutes == undefined) {
        timeCapture.groups.minutes = "00"
    };

    // convert target event time to 24 hr format
    let targetaddHours = oh;

    if (oh !== 12 && timeCapture.groups.ampm === 'pm') {
        targetaddHours = targetaddHours + 12;
    }
    else if (oh === 12 && timeCapture.groups.ampm === 'am') {
        targetaddHours = 0;
    }

    // convert event time to milliseconds

    daysUntilTargetDay = (edm - currentDay + 7) % 7;
    let targetDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() + daysUntilTargetDay, timeCapture.groups.hours, timeCapture.groups.minutes);
    targetDate.setHours(targetaddHours, timeCapture.groups.minutes);
    timeinMS = targetDate.getTime();

    const startHour = 8;
    const endHour = 20;
    const startTimeInMS = targetDate.setHours(startHour, '00');
    const endTimeMS = targetDate.setHours(endHour, '00');
    // console.log(`daystart: ${startTimeInMS}, dayend: ${endTimeMS}`);
    // check if the new event falls within the working days and hours limits
    // and request for correct input
    if (dayCapture === null || dayCapture.groups === undefined) {
        return ("1. day input format is invalid");
    }

    else if (edm === 6 || edm === 0) {
        console.log("Next available slots to add an event are listed below:");
        nextAvailableSlot();
    }

    if (dayCapture.groups.day == "Saturday" || dayCapture.groups.day == "Sunday") {
        console.log("Next available slots to store an event are listed below");
        nextAvailableSlot();
    }

    else if (oh < 8 && timeCapture.groups.ampm == 'am') {

        console.log(" Event should be set between 8am to 8pm only");
        nextAvailableSlot();
    }

    else if (oh > 8 && oh != 12 && timeCapture.groups.ampm == 'pm') {

        console.log(" Event should be set between 8am to 8pm only");
        nextAvailableSlot();

    }

    else if (oh > 8 && oh == 12 && timeCapture.groups.ampm == 'am') {
        console.log(" Event should be set between 8am to 8pm only");
        nextAvailableSlot();
    }

    else if (oh == 8 && om >> 0 && timeCapture.groups.ampm == 'pm') {

        console.log(" Event should be set between 8am to 8pm only");
        nextAvailableSlot();
    }

    else if (currentDay == edm) {

        console.log(" Below are the time slots available to add an event");
        nextAvailableSlot();
    }
    // feed the captured title, time and day details into one object.

    else {
        return eventObj = {
            title: et,
            name: etName,
            day: dayCapture.groups.day,
            eventTime: timeinMS,
            eventStartTime: startTimeInMS,
            eventEndTime: endTimeMS,
            time: {
                hours: timeCapture.groups.hours,
                minutes: timeCapture.groups.minutes,
                apm: timeCapture.groups.ampm,
            }
        }
    }
}

async function nextAvailableSlot() {
    var nextSlotDay = currentDay;
    var newDay;

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
        console.log(nextSlotDay, currentHour);
        let temp = 'cn' + daysOfWeek[(nextSlotDay % 6) + newDay];
        console.log(temp);
        let collName = db.collection(temp);

        // delete past events
        await collName.deleteMany({ eventTime: { $lt: CurrentTime } });

        //if no events on working day, display the whole day as available 
        // and increment to the next working day
        let docCount = await collName.countDocuments({});

        if (docCount === 0 && nextSlotDay !== currentDay) {
            console.log(`Time Slots available on ${daysOfWeek[(nextSlotDay % 6) + newDay]}`);
            console.log("8:00:00 am to 8:00:00 pm");
        }



        let result = await collName.find().sort({ eventTime: 1 }).toArray();
        try {
            // sort through collection and display available slots for the next 3 working days
            if (result !== null) {
                let len = result.length;
                console.log(`Time Slots available on ${result[0].day}`);

                if (CurrentTime < result[0].eventStartTime) {
                    console.log(`${new Date(result[0].eventStartTime).toLocaleTimeString()} to ${new Date(result[0].eventTime - 60000).toLocaleTimeString()}`)
                }

                else {
                    console.log(`${new Date().toLocaleTimeString()} to ${new Date(result[0].eventTime - 60000).toLocaleTimeString()}`);
                }
                for (let m = 0; m < result.length; m++) {

                    console.log(`${new Date(result[m].eventTime + 60000).toLocaleTimeString()} to ${new Date(result[m + 1].eventTime - 60000).toLocaleTimeString()}`);
                    if (m = result.length - 1) { break; }

                }

                console.log(`${new Date(result[len - 1].eventTime + 60000).toLocaleTimeString()} to ${new Date(result[0].eventEndTime).toLocaleTimeString()}`);
            }
        } catch (error) {
            console.error(error);
        }
        nextSlotDay++;
    }

    await client.close();
    console.log("disconnected from db");
}


//Find and post the list of events for the current week

async function getEventSchedule() {
    var newCurrentDay = currentDay;

    try {
        await client.connect();
        console.log("connected to database eventMaster");
        const db = client.db("eventMaster");

        // if friday night / sat / sun. set the next working day to monday
        if (currentDay === 6 || currentDay === 0) {
            newCurrentDay = 1;
        }
        else if (currentDay === 5 && currentHour >= 20) {
            newCurrentDay = 1;
        }

        for (let i = newCurrentDay; i <= 5; i++) {

            let temp = 'cn' + daysOfWeek[i];
            let collName = db.collection(temp);
            let docCount = await collName.countDocuments({});
            if (docCount === 0) {
                continue;
            }
            // delete past events
            await collName.deleteMany({ eventTime: { $lt: CurrentTime } });

            // console.log(`Obosolete event docs deleted ${outDatedEvent.deletedCount} from collection ${temp}`);

            let result = await collName.find().sort({ eventTime: 1 }).toArray();

            if (result !== null) {
                console.log(`${result[0].day}`);
                for (const event of result) {
                    const { title, time } = event;
                    const formattedTime = `${time.hours}.${time.minutes} ${time.apm}`
                    console.log(`${title} ${formattedTime}`);
                }
            }
        }

    } catch (error) {
        console.log
    }
    finally {
        await client.close();
        console.log("disconnected from db");
    }
}


//function to add events
async function addEvent(eventDetails) {

    if (!eventDetails.day) {
        return ("Value of event day is undefined");
    }
    const collectionName = "cn" + eventDetails.day;
    //console.log(collectionName);
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        //console.log("1. connected to database");
        const collection = client.db("eventMaster").collection(collectionName);

        const result1 = await collection.deleteMany({ eventTime: { $lt: CurrentTime } });
        //console.log(`deleted obosolete events ${result1.deletedCount} from collection ${collectionName}`)

        const query = {
            'time.hours': eventDetails.time.hours,
            'time.minutes': eventDetails.time.minutes,
            'time.apm': eventDetails.time.apm
        }
        //check for duplicate time event
        const result = await collection.findOne(query);
        if (result !== null) {
            //console.log("1. Event already exists");
            return ("an event already exists at that time");
        }

        await collection.insertOne(eventDetails);
        const eventAddSucess = `ok, added call with ${eventDetails.name} at ${eventDetails.day} /${eventDetails.time.hours}:${eventDetails.time.minutes}${eventDetails.time.apm}`;
        return (eventAddSucess);
    }

    catch (error) {
        console.error(error);
    }
    finally {
        await client.close();
        // console.log("1. connection closed");
    }
    // console.log(`ok, added call with <${eventDetails.name}> at <${eventDetails.day}/${eventDetails.time.hours}:${eventDetails.time.minutes}${eventDetails.time.apm}>`);
}

async function deleteEvent(eventDetails) {
    const collectionName = "cn" + eventDetails.day;
    // console.log(collectionName);
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

    try {
        await client.connect();
        // console.log("2. connected to database");
        const collection = client.db("eventMaster").collection(collectionName);

        const outDatedEvent = await collection.deleteMany({ eventTime: { $lt: CurrentTime } });
        // console.log(`deleted obosolete events ${outDatedEvent.deletedCount} from collection ${collection}`)

        const query = {
            'time.hours': eventDetails.time.hours,
            'time.minutes': eventDetails.time.minutes,
            'time.apm': eventDetails.time.apm
        }
        const result = await collection.findOneAndDelete(query);

        if (result.value !== null) {
            const eventDeleteSucess = `ok, deleted call with ${eventDetails.name} at ${eventDetails.day}/${eventDetails.time.hours}:${eventDetails.time.minutes}${eventDetails.time.apm}`;
            return (eventDeleteSucess);
        }
        return ("Entered event does not exist!");

    } catch (error) { console.error(error); }
    finally {
        client.close();
        // console.log("client is closed");
    }
}
module.exports = { eventOrg, addEvent, deleteEvent, calAppMain, getEventSchedule, nextAvailableSlot };
