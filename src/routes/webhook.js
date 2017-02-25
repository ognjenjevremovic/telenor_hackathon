//  Dependancies
const express = require('express');
const request = require('request');
const path = require('path');
const Conversation = require('watson-developer-cloud/conversation/v1'); //  watson sdk
const FacebookMessageAPI = require(path.join(__dirname, '..', 'lib', 'FacebookMessage', 'FacebookMessageAPI'));


const AnswerFactory = require('../lib/AnswerFactory/AnswerFactory');
const factory = new AnswerFactory();

//  Router
const router = express.Router();

//  Send request to Watson
const pingWatson = require(path.join(__dirname, '../', 'watson', 'request'));

//  Watson convo config
const { USER_NAME, USER_PASS, WORKSPACE_ID, ACCESS_TOKEN } = process.env;

let facebookApi = new FacebookMessageAPI(ACCESS_TOKEN);

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

                let senderId = event.sender.id;
                
                if (event.message) {
                    //  If without postback (not buttons clicked) - contact watson
                    if(!event.postback) return contactWatson(event);

                    //  postback present - contact Telenor api
                    let payload;
                    try {
                        console.log(`
                            Here:
                            ${event.postback}
                        `);
                        payload = JSON.parse(event.postback.payload);
                    }
                    catch (err) {
                        console.log(`
                            Error:
                            ${err}
                        `);
                        return;
                    }

                    //  Send the response back to facebook
                    if(payload) {
                        factory.factory(senderId, payload.type, payload.entities, (messageData) => {
                            facebookApi.send(messageData);
                        });
                    }

                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        //  Return the status code of 200
        return res.sendStatus(200);
    }
});


function contactWatson(event) {
    var senderId = event.sender.id;
    var message = event.message;

    console.log(`
        Recieved message from the page!
    `);

    var messageText = message.text;
    var messageAttachments = message.attachments;

    pingWatson(messageText)
        .then(({intent, entities}) => {

            factory.factory(senderId, intent, entities, (messageData) => {

                facebookApi.send(messageData);

            });

        })
        .catch((err) => {

        });
}


//  Export the module
module.exports = router;