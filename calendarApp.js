const currentDate = new Date();
const newDate = new Date(currentDate);
const currentDay = new Date().getDay();
const CurrentTime = new Date().getTime();
const currentHour = new Date().getHours();
const natural = require('natural');
const getSlots = require('./geteventslots');

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://bskarthik:bskbhag123@cluster0.xkvbtje.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function calAppMain(tokenArray) {

    const inputText = tokenArray.join(' ');
    const eventDetails = eventOrg(inputText);

    if (typeof eventDetails === "string") {
        return (eventDetails);
    }

    else if (inputText.includes("add") && inputText.includes("event") && typeof eventDetails !== "string") {
        if (eventDetails !== null && typeof eventDetails === 'object') {
            const sendOutput = await addEvent(eventDetails);
            return sendOutput;
        }
    }

    else if (inputText.includes("cancel") || inputText.includes("delete") && inputText.includes("event")) {
        //let eventDetails = eventOrg(ut);
        return await deleteEvent(eventDetails);
    }

    else {
        console.log("Enter/Delete an event or View your schedule");
    }

}




function eventOrg(inputText) {

    if (inputText.includes("get") && inputText.includes("schedule")) {

        return null;
    }

    if (inputText.includes("get") && inputText.includes("free") && inputText.includes("slot")) {
        return null;
    }

    var eventObj = null; // event variable with formatted event details to be fed to database
    //const checkDayInput = ['mon', 'tue', 'wed', 'thu', 'fri'];

    // capture event title & name from user input

    const eventTitleStart = inputText.indexOf("event") + "event ".length;
    const eventTitleEnd = inputText.indexOf(" at ");
    const et = inputText.substring(eventTitleStart, eventTitleEnd);

    // capture name of the person to call
    const tokenizer = new natural.RegexpTokenizer({ pattern: /\s+/ });
    const tokenArray = tokenizer.tokenize(inputText);
    const etName = tokenArray[tokenArray.indexOf("at") - 1];



    // parse the user input to capture event day
    const dayRegex = /(?<day>monday|mon|tuesday|tue|wednesday|wed|thursday|thu|friday|fri|sat|saturday|sun|sunday)/i;
    const dayCapture = inputText.match(dayRegex);
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
    const timeCapture = inputText.match(timeRegex);
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
        return (`Type: <get free slots> to see next available event slots`);


    }

    if (dayCapture.groups.day == "Saturday" || dayCapture.groups.day == "Sunday") {
        return (`Type: <get free slots> to see next available event slots`);

    }

    else if (oh < 8 && timeCapture.groups.ampm == 'am') {

        return (" Event should be set between 8am to 8pm only");

    }

    else if (oh > 8 && oh != 12 && timeCapture.groups.ampm == 'pm') {

        return (" Event should be set between 8am to 8pm only");


    }

    else if (oh > 8 && oh == 12 && timeCapture.groups.ampm == 'am') {
        return (" Event should be set between 8am to 8pm only");

    }

    else if (oh == 8 && om >> 0 && timeCapture.groups.ampm == 'pm') {

        (" Event should be set between 8am to 8pm only");
        return;
    }

    else if (currentDay == edm) {

        return (`Type: <get free slots> to see next available event slots`);

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


//function to add events
async function addEvent(eventDetails) {

    if (!eventDetails.day) {
        return ("Value of event day is undefined");
    }
    const collectionName = "cn" + eventDetails.day;
    //console.log(collectionName);


    try {
        await client.connect();
        //console.log("1. connected to database");
        const collection = client.db("eventMaster").collection(collectionName);

        await collection.deleteMany({ eventTime: { $lt: CurrentTime } });
        //console.log(`deleted obosolete events ${result1.deletedCount} from collection ${collectionName}`)

        const query = {
            'time.hours': eventDetails.time.hours,
            'time.minutes': eventDetails.time.minutes,
            'time.apm': eventDetails.time.apm
        }
        //check for duplicate time event
        const result = await collection.findOne(query);
        if (result === null) {
            await collection.insertOne(eventDetails);
            const eventAddSucess = `ok, added event ${eventDetails.title} at ${eventDetails.day} /${eventDetails.time.hours}:${eventDetails.time.minutes}${eventDetails.time.apm}`;
            return (eventAddSucess);

        }
        else {
            //console.log("1. Event already exists");
            return ("an event already exists at that time");
        }
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


    try {
        await client.connect();
        // console.log("2. connected to database");
        const collection = client.db("eventMaster").collection(collectionName);

        await collection.deleteMany({ eventTime: { $lt: CurrentTime } });
        // console.log(`deleted obosolete events ${outDatedEvent.deletedCount} from collection ${collection}`)

        const query = {
            'time.hours': eventDetails.time.hours,
            'time.minutes': eventDetails.time.minutes,
            'time.apm': eventDetails.time.apm
        }
        const result = await collection.findOneAndDelete(query);

        if (result.value !== null) {
            const eventDeleteSucess = `ok, deleted event ${eventDetails.title} at ${eventDetails.day}/${eventDetails.time.hours}:${eventDetails.time.minutes}${eventDetails.time.apm}`;
            return (eventDeleteSucess);
        }
        return ("Entered event does not exist!");

    } catch (error) { console.error(error); }
    finally {
        client.close();
        // console.log("client is closed");
    }
}
module.exports = { eventOrg, addEvent, deleteEvent, calAppMain };
