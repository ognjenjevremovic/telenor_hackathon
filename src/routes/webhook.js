//  Dependancies
const express = require('express');
const request = require('request');
const path = require('path');
const Conversation = require('watson-developer-cloud/conversation/v1'); //  watson sdk

//  Router
const router = express.Router();


//  Send response back to facebook
const returnRespose = require(path.join(__dirname, '../', 'helpers', 'returnResponse'));
//  Send request to Watson
const pingWatson = require(path.join(__dirname, '../', 'helpers', 'pingWatson'));

//  Watson convo config
const { USER_NAME, USER_PASS, WORKSPACE_ID } = process.env;


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
    
    //  Get events
    let messaging_events = req.body.entry[0].messaging

    //  Itterate over events
    for (let i = 0; i < messaging_events.length; i++) {
        //  Get message and sender data
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id

        //  Message exists
        if (event.message && event.message.text) {
            let text = event.message.text
            pingWatson(req.body)
                .then((data) => {
                    // !!!
                    console.log(data);
                })
                .catch((err) => {
                    //  error from watson
                    console.log(err);
                });
        }

    }
})



//  Export the module
module.exports = router;