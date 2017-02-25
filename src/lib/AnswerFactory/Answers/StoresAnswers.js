const path = require('path');

const AnswerEntity = require(__dirname + '/../AnswerEntity');

const TelenorAPIClient = require(__dirname + '/../../TelenorAPIClient');

const FacebookButtons = require(path.join(__dirname, '..', '..', 'FacebookMessage', 'FacebookButtons'));

const FacebookMessageAPI = require(path.join(__dirname, '..', '..', 'FacebookMessage', 'FacebookMessageAPI'));

const UrlButton = FacebookButtons.FacebookUrlButton;

const WebHookButton = FacebookButtons.FacebookWebHookButton;

class StoresAnswers extends AnswerEntity
{

    constructor()
    {

        super('store');

    }

    factory(recipientId, entities, callback)
    {

        if (typeof callback !== 'function') {

            return null;

        }

        entities = entities instanceof Array ? entities : [];

        if (0 === entities.length) {

            callback(this.chooseStoreAnswer(recipientId));

        }

    }


    /**
     *
     * Generates message that will explain to user how to search.
     *
     * @param {Number} recipientId
     * @return {{recipient: {id: String}, message: {text: String}}}
     */
    chooseStoreAnswer(recipientId)
    {

        return FacebookMessageAPI.getTextMessageData(
            recipientId,
            'You are looking for stores. In what city? e.g. Stores in Belgrade'
        );

    }

}

module.exports = StoresAnswers;