const path = require('path');

const AnswerEntity = require(__dirname + '/../AnswerEntity');

const TelenorAPIClient = require(__dirname + '/../../TelenorAPIClient');

const FacebookButtons = require(path.join(__dirname, '..', '..', 'FacebookMessage', 'FacebookButtons'));

const FacebookMessageAPI = require(path.join(__dirname, '..', '..', 'FacebookMessage', 'FacebookMessageAPI'));

const UrlButton = FacebookButtons.FacebookUrlButton;

const WebHookButton = FacebookButtons.FacebookWebHookButton;



class AtmsAnswers extends AnswerEntity
{

    constructor()
    {

        super('atm');

        this.telenorApi = new TelenorAPIClient();

    }

    factory(recipientId, entities, callback)
    {

        if (typeof callback !== 'function') {

            return null;

        }

        let cities = (entities instanceof Array ? entities : []).filter((entity) => {

            return 'cities' === entity.entity;

        });

        // Tell client to choose city
        if (0 === cities.length) {

            callback(this.chooseAtmAnswer(recipientId));

        } else if (1 === cities.length) {

            this.getAtmInCity(recipientId, cities[0].value, callback);

        }

    }


    /**
     *
     * Generates message that will explain to user how to search.
     *
     * @param {Number} recipientId
     * @return {{recipient: {id: String}, message: {text: String}}}
     */
    chooseAtmAnswer(recipientId)
    {

        return FacebookMessageAPI.getButtonMessageData(
            recipientId,
            'Please press on city you want, if its not listed write as message.\ne.g ATMs in Novi Sad.',
            [
                new WebHookButton('Beograd', {type: 'atm', entities: [{entity: 'cities', value: 'Beograd'}]}),
                new WebHookButton('Novi Sad', {type: 'atm', entities: [{entity: 'cities', value: 'Novi Sad'}]}),
                new WebHookButton('Subotica', {type: 'atm', entities: [{entity: 'cities', value: 'Subotica'}]}),
            ]
        )

    }

    getAtmInCity(recipientId, cityName, callback)
    {

        this.telenorApi.getATMs((error, data) => {

            if (error) {
                console.log(error);

                callback(FacebookMessageAPI.getTextMessageData(recipientId, 'Our service is currently offline.'));

                return;

            }

            let matchRegex = new RegExp(cityName, 'i');
            let atms = [];

            (data && data.data instanceof Array ? data.data : []).map((atm) => {

                let name = atm.atributes.city;

                if (name.match(matchRegex) && atms.length <= 10) {
                    atms.push((atm.atributes.address + ', ' + atm.atributes.postCode).replace('<br>', ''));
                }

            });

            callback( FacebookMessageAPI.getTextMessageData(recipientId, atms.join("\n")) );

        });

    }

}

module.exports = AtmsAnswers;