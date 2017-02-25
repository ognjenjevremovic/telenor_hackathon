const Conversation = require('watson-developer-cloud/conversation/v1'); // watson sdk
const path = require('path');

//  Filter the answer before making a request to Telenor api
const filterResponse = require(path.join(__dirname, 'filter'));

//  Watson convo config
const { USER_NAME, USER_PASS, WORKSPACE_ID } = process.env;

//  Send request to Watson service
function pingWatson(textMessage) {
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
            input: {
                text: textMessage
            }
        };
        console.log(payload);

        // Ping the conversation service and return the response
        conversation
            .message(payload, (err, data) => {
                if (err) return reject(err);
                return resolve(
                    filterResponse(data)
                );
            });
    });
}



//  Module exports
module.exports = pingWatson;