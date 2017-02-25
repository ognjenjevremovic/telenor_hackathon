//  Dependancies
const express = require('express');
const request = require('request');
const path = require('path');
const Conversation = require('watson-developer-cloud/conversation/v1'); //  watson sdk

const AnswerFactory = require('../lib/AnswerFactory/AnswerFactory');

const factory = new AnswerFactory();

//  Router
const router = express.Router();


//  Send response back to facebook
const returnRespose = require(path.join(__dirname, '../', 'helpers', 'returnResponse'));
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
                    receivedMessage(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        //  Return the status code of 200
        res.sendStatus(200);
    }


    /*
    //  Get events
    let messaging_events = req.body.entry[0].messaging;

    //  Itterate over events
    for (let i = 0; i < messaging_events.length; i++) {
        //  Get message and sender data
        let event = req.body.entry[0].messaging[i];
        let sender = event.sender.id;

        //  Message exists
        if (event.message && event.message.text) {
            let text = event.message.text;
            console.log(`
                The text is ${text}
            `);

            pingWatson(req.body)
                .then((data) => {
                    returnRespose();
                    return res.status(200);
                })
                .catch((err) => {
                    //  error from watson
                    console.log(err);
                    return res.status(500);
                });
        }

    }
    */
});


function receivedMessage(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;

    var messageText = message.text;
    var messageAttachments = message.attachments;

    if (messageText) {

        sendTextMessage(senderID, messageText);
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}



function sendTextMessage(recipientId, messageText) {

    // var messageData = {
    // recipient: {
    //   id: recipientId
    // },
    // message: {
    //   text: messageText
    // }
  // };

  // callSendAPI(messageData);
}

function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}


//  Export the module
module.exports = router;