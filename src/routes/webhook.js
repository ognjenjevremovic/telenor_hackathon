//  Dependancies
const express = require('express');
const request = require('request');
const path = require('path');
const Conversation = require('watson-developer-cloud/conversation/v1'); //  watson sdk

//  Router
const router = express.Router();

//  Send request to Watson
const pingWatson = require(path.join(__dirname, '../', 'helpers', 'pingWatson'));

//  Watson convo config
const { USER_NAME, USER_PASS, WORKSPACE_ID, ACCESS_TOKEN } = process.env;


//  Facebook AUTH
router.get('/', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'alexander') {
        console.log("Validating webhook");
        return res
            .status(200)
            .send(req.query['hub.challenge']);
    }
    else {
        console.error("Failed validation. Make sure the validation tokens match.");
        return res
            .sendStatus(403);
    }
});


//  Webhook
router.post('/', function (req, res) {

    //  Extract the request body
    var data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function (entry) {
            var pageID = entry.id;
            var timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function (event) {
                if (event.message) {
                    contactWatson(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        //  Return the status code of 200
        res.sendStatus(200);
    }
});


function contactWatson(event) {
    var senderID = event.sender.id;
    var message = event.message;

    console.log(`
        Recieved message from the page!
    `);
    console.log(JSON.stringify(message.text));

    var messageText = message.text;
    var messageAttachments = message.attachments;

    pingWatson(messageText)
        .then((data) => {
            console.log(data);
        });
}

const fbButtons = require(__dirname + '/../lib/FacebookMessage/FacebookButtons');

const FacebookMessageAPI = require(__dirname + '/../lib/FacebookMessage/FacebookMessageAPI');

function sendTextMessage(recipientId, messageText) {

    let buttons = [
        new fbButtons.FacebookWebHookButton('Web Hook Test', {data: 'to be', sent: true}),
        new fbButtons.FacebookUrlButton('Url Test', 'www.google.com')
    ];

    let api = new FacebookMessageAPI(ACCESS_TOKEN);

    api.sendMessage(
        // FacebookMessageAPI.getButtonMessageData(recipientId, messageText, buttons)
        FacebookMessageAPI.getTextMessageData(recipientId, messageText)
    );
}



//  Export the module
module.exports = router;