const PhonesAnswers = require('./Answers/PhonesAnswer');

const StoresAnswers = require('./Answers/StoresAnswers');

const AnswerEntity = require('./AnswerEntity');

/**
 * Answer factory is used to easy scale answer providers.
 * Extend features of messages that can be sent to client
 */
class AnswerFactory
{

    constructor()
    {

        /** Registered answer factories */
        this.answerFactories = [

            new PhonesAnswers(), // Factory that provides answers regarding smart phones

            new StoresAnswers() // Factory that provides answers regarding stores

        ];

    }

    /**
     *
     * Matches answer factory by intent and executes it.
     * Returns object prepared and ready to be sent via FacebookMessageAPI.send
     *
     * @param {Number} recipientId
     * @param {String} intent
     * @param {Object[]} entities
     * @param {Function} callback
     * @return {Object}
     */
    factory(recipientId, intent, entities, callback)
    {

        // Clone data so we don't loose them as there is only one instance of answers factory  :)
        let answerFactories = this.answerFactories.map((answerFactory) => { return answerFactory });

        return (function executeAnswerFactory(answer) {

            if (false === answer instanceof AnswerEntity) {

                return null;

            }

            if (false === answer.isMatch(intent)) {

                return executeAnswerFactory( answerFactories.shift() );

            }

            return answer.factory(recipientId, entities, callback);

        })(answerFactories.shift());

    }

}

module.exports = AnswerFactory;