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
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
};