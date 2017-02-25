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
            'Test',
            [
                new WebHookButton('Test', {name: 'Coa'})
            ]
        );

        // return FacebookMessageAPI.getTextMessageData(
        //     recipientId,
        //     "You are looking for stores. In what city?\ne.g. Stores in Belgrade"
        // );

    }

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

                    let responseData = (data && data.data instanceof Array ? data.data : []).map((store) => {

                        return store.attributes.address + ', ' + store.attributes.postCode + ' ' + store.attributes.city;

                    });

                    callback( FacebookMessageAPI.getTextMessageData(recipientId, responseData.join('<br />')) );

                });

            });

        });

    }

}

module.exports = StoresAnswers;