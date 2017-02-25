const Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
const path = require('path');

//  Watson convo config
const { USER_NAME, USER_PASS, WORKSPACE_ID } = process.env;

//  Send request to Watson service
function pingWatson(body) {
    //  Returns a promise
    return new Promise((resolve, reject) => {

        //  Make an instance of a conversation
        var conversation = new Conversation({
            username: USER_NAME,
            password: USER_PASS,
            url: 'https://gateway.watsonplatform.net/conversation/api',
            version_date: '2016-10-21',
            version: 'v1'
        });

        //  Make the payload
        const payload = {
            workspace_id: WORKSPACE_ID,
            context: body.context || {},
            input: body.input || {}
        };

        // Ping the conversation service and return the response
        conversation
            .message(payload, (err, data) => {
                console.log(data);
                if (err) return reject(err);
                return resolve(
                    updateMessage(data)
                );
            });
    });
}


//  Get the Watson response
function updateMessage(response) {

    //  return the output if it exist
    if (response.output) return response;
    //  else create an output
    else response.output = {};

    //  Check for the accuracy of the response
    if (response.intents && response.intents[0]) {
        let responseMessage;
        const intent = response.intents[0];
        //  Highly matching intent
        if (intent.confidence >= 0.5) responseMessage = 'I understood your intent was ' + intent.intent;
        //  No match ?
        else responseMessage = 'I did not understand your intent';
    }

    //  Populate the response
    response.output.text = responseMessage;

    //  del
    console.log(`
        I'm, returning:
        ${response}
    `);

    //  Return the response
    return response;
}



//  Module exports
module.exports = pingWatson;