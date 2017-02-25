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

        this.telenorApi = new TelenorAPIClient();

    }

    /**
     *
     * Decide which response should be send to user
     *
     * @param {Number} recipientId
     * @param {Object[]} entities
     * @param {Function} callback
     */
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

            callback(this.chooseStoreAnswer(recipientId));

        } else if (1 === cities.length) {

            this.getStoreInCity(recipientId, cities[0].value, callback);

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

        return FacebookMessageAPI.getButtonMessageData(
            recipientId,
            'Please press on city you want, if its not listed write as message.\ne.g Stores in Belgrade.',
            [
                new WebHookButton('Beograd', {type: 'store', entities: [{entity: 'cities', value: 'Beograd'}]}),
                new WebHookButton('Novi Sad', {type: 'store', entities: [{entity: 'cities', value: 'Novi Sad'}]}),
                new WebHookButton('Subotica', {type: 'store', entities: [{entity: 'cities', value: 'Subotica'}]}),
            ]
        )

    }

    /**
     *
     * Notify user with store addresses in certain city
     *
     * @param {Number} recipientId
     * @param {String} cityName
     * @param {Function} callback
     */
    getStoreInCity(recipientId, cityName, callback)
    {

        this.telenorApi.getAllCities((error, data) => {

            if (error) {

                callback(FacebookMessageAPI.getTextMessageData(recipientId, 'Our service is currently offline.'));

                return;

            }

            let cityId = null;

            let matchRegex = new RegExp(cityName, 'i');

            (data && data.data instanceof Array ? data.data : []).map((cityData) => {

                let name = cityData.attributes.name;

                if (null === name.match(matchRegex)) {

                    return;

                }

                cityId = cityData.id;

                this.telenorApi.getStoresInCity(cityId, (error, data) => {

                    if (error) {

                        callback(FacebookMessageAPI.getTextMessageData(recipientId, 'Our service is currently offline.'));

                        return;

                    }

                    let responseData = [];

                    (data && data.data instanceof Array ? data.data : []).map((store) => {

                        if (10 === responseData.length) {

                            return;

                        }

                        responseData.push((store.attributes.address + ', ' + store.attributes.postCode).replace('<br>', ''));

                    });

                    callback( FacebookMessageAPI.getTextMessageData(recipientId, responseData.join("\n")) );

                });

            });

        });

    }

}

module.exports = StoresAnswers;