const express = require('express');
const router = express.Router();
const Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
const request = require('request');

//  Watson convo config
const { USER_NAME, USER_PASS, WORKSPACE_ID } = process.env;

//  Service wrapper
var conversation = new Conversation({
    username: USER_NAME,
    password: USER_PASS,
    url: 'https://gateway.watsonplatform.net/conversation/api',
    version_date: '2016-10-21',
    version: 'v1'
});


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

//  Messanger POST requests
router.post('/', (req, res) => {
    //  Extract the request body
    const data = req.body;

    //  Make the payload
    const payload = {
        workspace_id: WORKSPACE_ID,
        context: data.context || {},
        input: data.input || {}
    }

    // Ping the conversation service and return the response
    conversation
        .message(payload, (err, data) => {
            if (err) return res
                .status(err.code || 500)
                .json(err);
            return res.json(
                updateMessage(payload, data)
            );
        });

});

//  Update the response text
function updateMessage(input, response) {
    //  define the response text
    var responseMessage;
    //  return the output if it exist
    if (response.output) return response;
    //  Set deff output
    response.output = {};

    //  Check for the accuracy of the response
    if (response.intents && response.intents[0]) {
        const intent = response.intents[0];
        if (intent.confidence >= 0.75) responseMessage = 'I understood your intent was ' + intent.intent;
        else if (intent.confidence >= 0.5) responseMessage = 'I think your intent was ' + intent.intent;
        else responseMessage = 'I did not understand your intent';
    }
    //  Populate the response
    response.output.text = responseMessage;

    //  Return the response
    return response;
}


//  Export the module
module.exports = router;