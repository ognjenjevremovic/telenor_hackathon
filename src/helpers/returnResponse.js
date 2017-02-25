//  Dependancies
const request = require('request');

//  Page access token
const { ACCESS_TOKEN } = process.env;


//  Make a POST request to FB to send a message back to client
module.exports = (sender, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: sender
            },
            message: {
                text: text
            },
        }
    }, function (error, response, body) {
        //  Successfuly returned the message
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        //  Error responding to user
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
};