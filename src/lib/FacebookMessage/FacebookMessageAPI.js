
const request = require('request');

const FacebookButton = require('./FacebookButtons').FacebookButton;

// const SEND_API_URL = 'https://graph.facebook.com/v2.6/me/messages?access_token=';

const _fieldAccessToken = Symbol('accessToken');

const _fieldSendApiUrl = Symbol('sendApiUrl');

class FacebookMessageAPI
{

    constructor(accessToken)
    {

        if (typeof accessToken !== 'string' || 0 === accessToken.length) {

            throw new Error('Access Token is required.');

        }

        this[_fieldAccessToken] = accessToken;

    }

    /**
     *
     * @param {Object} messageData
     */
    sendMessage(messageData)
    {

        request({

            uri: 'https://graph.facebook.com/v2.6/me/messages',

            qs: { access_token: this[_fieldAccessToken] },

            method: 'POST',

            json: messageData

        },

        (error, response, body) => {

            if (error || 200 !== response.statusCode) {

                console.error('Unable to send message.', error, response);

            }

        });

    }
    
    /**
     *
     * Retrieves data for 'typing' message
     *
     * @param {String} recipientId
     * @param {String} notificationType typing_on, typing_off or mark_seen
     * @return {{recipient: String, sender_action: String}}
     */
    static getNotificationData(recipientId, notificationType)
    {

        return {

            recipient: { id: recipientId },

            sender_action: 'typing_on'

        }

    }

    /**
     *
     * Retrieves data for message type
     *
     * @param {String} recipientId
     * @param {String} message
     * @return {{recipient: {id: String}, message: {text: String}}}
     */
    static getTextMessageData(recipientId, message)
    {

        return {

            recipient: { id: recipientId },

            message: { text: message }

        };

    }

    /**
     *
     * Retrieves ready data for button type message
     *
     * @param {String|Number} recipientId
     * @param {String} text
     * @param {FacebookButton[]} buttons
     * @return {{recipient: {id: *}, message: {attachment: {type: string, payload: {template_type: string, text: *, buttons: Array}}}}}
     */
    static getButtonMessageData(recipientId, text, buttons)
    {

        return {

            recipient: { id: recipientId },

            message: {

                attachment: {

                    type: 'template',

                    payload: {

                        template_type: 'button',

                        text: text,

                        buttons: buttons instanceof Array ? FacebookButton.getButtonsData(buttons) : []

                    }

                }

            }

        };

    }

}

module.exports = FacebookMessageAPI;