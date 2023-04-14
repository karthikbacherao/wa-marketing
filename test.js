const assert = require('assert');
const calAppDev = require('./calendarApp');
const geteventschedule = require('./geteventschedule');
const geteventslots = require('./geteventslots')
const { describe } = require('mocha');
const natural = require('natural');
tokenizer = new natural.RegexpTokenizer({ pattern: /\s+/ });


//Test Case 1 Add an event if it does not exist
//Admin Input: add an event call with bsk at Mon/2.30pm
// App Response: ok, added event call with bsk at Monday/2:30pm
describe('Add an event Success/Fail, Deleting an event Success/Fail', function () {

    const addEventInput = "add an event call with bsk at Mon/2.30pm";
    const userInput = tokenizer.tokenize(addEventInput.toLocaleLowerCase());

    it('Should respond with confirmation of adding an event', async () => {
        const addAnEvent = await calAppDev.calAppMain(userInput);
        const result1 = "ok, added event call with bsk at Monday/2:30pm";
        assert.strictEqual(addAnEvent, result1);
    });

    // Test Case 2 Trying to add an event with the same time as another existing event
    // app should catch the error and respond accordingly.  
    //Admin Input: add an event call with bsk at Mon/2.30pm
    //App Response: an event already exists at that time  

    it('app response - an event already exists at that time', async () => {

        const tryToAddEvent = await calAppDev.calAppMain(userInput);
        const result2 = "an event already exists at that time";
        assert.strictEqual(tryToAddEvent, result2);
    });

    //TestCase 3: Successful Deletion of event
    // Admin Input: delete an event call with bsk at Monday/2:30pm
    //App Response: ok, deleted event call with bsk at Monday/2:30pm

    const deleteEventInput = "delete an event call with bsk at Monday/2:30pm";
    const userInput2 = tokenizer.tokenize(deleteEventInput.toLowerCase());

    it(`app response - ok, deleted event call with bsk at Monday/2:30pm `, async () => {

        const result3 = await calAppDev.calAppMain(userInput2);
        const adminDeleteEventInput = 'ok, deleted event call with bsk at Monday/2:30pm';
        assert.strictEqual(result3, adminDeleteEventInput);
    })


    //Test Case 4: Try to delete an event which does not exist
    //App response: Entered event does not exist!

    it('App - Entered event does not exist!', async () => {

        const result4 = await calAppDev.calAppMain(userInput2);
        output = 'Entered event does not exist!';
        assert.strictEqual(result4, output);
    })

    //Test Case 5: Event Schedule for the current Week. No events displayed on the weekends
    //Admin Input: Get schedule
    // App response: No events scheduled on the weekend

    const schedule = "Get schedule";
    const userInput3 = tokenizer.tokenize(schedule.toLowerCase());
    it('Gets event Schedule on weekdays on No events Scheduled for Weekends', async () => {

        const output = "No events scheduled on the weekend";
        const result5 = await geteventschedule(userInput3);
        assert.equal(result5, output);
    });

    //Test Case 6: Display Event Slots for the next three days
    //Admin Input: Get free slots
    //App response: 
    /* 
Time Slots available on Monday
 8:00:00 am to 8:59:00 am
 9:01:00 am to 11:44:00 am
 11:46:00 am to 11:59:00 am
 12:01:00 pm to 1:59:00 pm
 2:01:00 pm to 8:00:00 pm
 Time Slots available on Tuesday
 8:00:00 am to 8:00:00 pm
 Time Slots available on Wednesday
 8:00:00 am to 8:00:00 pm
 */
    const getSlots = "Get free slots";
    const adminInput4 = tokenizer.tokenize(getSlots.toLowerCase());
    it('Displays events slots of the next three workings days', async () => {

        const output2 =
            `Time Slots available on Monday
8:00:00 am to 8:59:00 am
9:01:00 am to 11:44:00 am
11:46:00 am to 11:59:00 am
12:01:00 pm to 1:59:00 pm
2:01:00 pm to 8:00:00 pm
Time Slots available on Tuesday
8:00:00 am to 8:00:00 pm
Time Slots available on Wednesday
8:00:00 am to 8:00:00 pm`

        const result6 = await geteventslots(adminInput4);
        assert.equal(result6, output2);
    });
});
