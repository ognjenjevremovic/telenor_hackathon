
const request = require('request');

// All available Telenor API routes
const SEARCH_TERM = 'http://www.telenor.rs/hackathon/lng/{lang}/segment/{segment}/search/{term}/';

const TARIFF_PACKAGES = 'http://www.telenor.rs/webshop/hackathon/tariff-packages/';

const TARIFF_PACKAGE = 'http://www.telenor.rs/webshop/hackathon/tariff-package-id/{id}/';

const TARIFF_PACKAGE_SEGMENT = 'http://www.telenor.rs/webshop/hackathon/tariff-package-segment/{segment}/';

const ROAMING_COUNTRIES = 'http://www.telenor.rs/hackathon/roaming/countries/';

const ROAMING_COUNTRY = 'http://www.telenor.rs/hackathon/roaming/country/{id}/lng/{lang}/';

const ROAMING_PARTNER = 'http://www.telenor.rs/hackathon/roaming/partner/{id}/lng/{lang}/';

const ROAMING_PARTNER_COUNTRY = 'http://www.telenor.rs/hackathon/roaming/partners-by-country/{id}/lng/{lang}/';

const ROAMING_PACKAGE = 'http://www.telenor.rs/hackathon/roaming/package/{id}/lng/{lang}/';

const ROAMING_PACKAGE_COUNTRY = 'http://www.telenor.rs/hackathon/roaming/packages-by-country/{id}/lng/{lang}/';

const STORES_DETAILS = 'http://www.telenor.rs/tpanel/api/stores';

const STORE_DETAILS = 'http://www.telenor.rs/tpanel/api/stores/{id}';

const STORE_CITIES = 'http://www.telenor.rs/tpanel/api/cities';

const STORES_IN_CITY = 'http://www.telenor.rs/tpanel/api/cities/{id}/stores';

const ATM_LOCATIONS = 'http://www.telenor.rs/tpanel/api/atm';

let _fieldLanguage = Symbol('lang');

let _fieldSegment = Symbol('segment');

/**
 *
 * Validates and executes given callback
 *
 * @param {Function} callback
 * @param {Array} parameters
 */
const validateAndExecuteCallback = (callback, parameters) => {

    parameters = parameters instanceof Array ? parameters : [];

    if (typeof callback !== 'function') {

        return;

    }

    callback.apply(callback, parameters);

};

/**
 *
 * Performs call to telenor API and triggers callback when data from api are retrieved
 *
 * @param {String} url
 * @param {Function} onFound
 */
const performApiCall = (url, onFound) => {

    request(url, (error, response, body) => {

        if (error) {

            validateAndExecuteCallback(onFound, [ error, null ]);

            return;

        }

        try {

            validateAndExecuteCallback(onFound, [ null, JSON.parse(body) ]);

        } catch (exception) {

            validateAndExecuteCallback(onFound, [ exception, null ]);

        }

    });

};

class TelenorAPIClient
{

    /**
     * @param {String} language Desire language for API calls
     * @param {String} segment Desire client segment business/private
     */
    constructor(language, segment)
    {

        this[_fieldLanguage] = language || 'en';

        this[_fieldSegment] = segment || 'p';

    }

    /**
     *
     * Perform GET request to Telenor term search api
     *
     * @param {String} term
     * @param {Function} onFound
     */
    querySearchTerm(term, onFound)
    {

        if (typeof term !== 'string' || 0 === term.length) {

            validateAndExecuteCallback(onFound, [ 'Missing search term.' ]);

            return;

        }

        let url = this.getApiUrl(SEARCH_TERM, {

            term: term

        });

        performApiCall(url, onFound);

    }

    /**
     *
     * @param {Object|Function} [options]
     * @param {Boolean} [options.segment]
     * @param {Function} [onFound]
     */
    getTariffPackages(options, onFound)
    {

        if (typeof options === 'function') {

            onFound = options;

            options = {};

        } else if (typeof options !== 'object') {

            options = {};

        }

        performApiCall(this.getApiUrl(options.segment ? TARIFF_PACKAGE_SEGMENT : TARIFF_PACKAGES), onFound);

    }

    /**
     *
     * Retrieves data for given tariff package
     *
     * @param {Number} packageId
     * @param {Function} onFound
     */
    getTariffPackage(packageId, onFound)
    {

        let url = this.getApiUrl(TARIFF_PACKAGE, {
            id: packageId
        });

        performApiCall(url, onFound);

    }

    /**
     *
     * Retrieves all roaming available countries
     *
     * @param {Function} onFound
     */
    getRoamingCountries(onFound)
    {

        performApiCall(this.getApiUrl(ROAMING_COUNTRIES), onFound);

    }

    /**
     *
     * Retrieves roaming data in given country
     *
     * @param {Number} countryId
     * @param {Function} onFound
     */
    getRoamingCountryData(countryId, onFound)
    {

        let url = this.getApiUrl(ROAMING_COUNTRY, {

            id: countryId

        });

        performApiCall(url, onFound);

    }

    /**
     *
     * Retrieves data for given roaming partner
     *
     * @param partnerId
     * @param onFinish
     */
    getRoamingPartnerData(partnerId, onFinish)
    {

        let url = this.getApiUrl(ROAMING_PARTNER, {

            id: partnerId

        });

        performApiCall(url, onFinish);

    }

    /**
     *
     * Retrieves roaming partners in given country
     *
     * @param {Number} countryId
     * @param {Function} onFinish
     */
    getRoamingPartnersInCountry(countryId, onFinish)
    {

        let url = this.getApiUrl(ROAMING_PARTNER_COUNTRY, {

            id: countryId

        });

        performApiCall(url, onFinish);

    }

    /**
     *
     * Retrieves data for given roaming package id
     *
     * @param {Number} packageId
     * @param {Function} onFinish
     */
    getRoamingPackage(packageId, onFinish)
    {

        let url = this.getApiUrl(ROAMING_PACKAGE, {

            id: packageId

        });


        performApiCall(url, onFinish);

    }

    /**
     *
     * Retrieves data about roaming packages in given country
     *
     * @param {Number} countryId
     * @param {Function} onFinish
     */
    getRoamingCountryPackages(countryId, onFinish)
    {

        let url = this.getApiUrl(ROAMING_PACKAGE_COUNTRY, {

            id: countryId

        });

        performApiCall(url, onFinish);

    }

    /**
     *
     * Retrieves data about all stores
     *
     * @param {Function} onFinish
     */
    getStoresDetails(onFinish)
    {

        performApiCall(STORES_DETAILS, onFinish);

    }

    /**
     *
     * Retrieve data of given store
     *
     * @param {Number} storeId
     * @param {Function} onFinish
     */
    getStoreDetails(storeId, onFinish)
    {

        let url = this.getApiUrl(STORE_DETAILS, {

            id: storeId

        });

        performApiCall(url, onFinish);

    }

    /**
     *
     * Retrieves all available cities
     *
     * @param {Function} onFinish
     */
    getAllCities(onFinish)
    {

        performApiCall(STORE_CITIES, onFinish);

    }

    /**
     *
     * Retrieves all stores in given city
     *
     * @param {Number} cityId
     * @param {Function} onFinish
     */
    getStoresInCity(cityId, onFinish)
    {

        let url = this.getApiUrl(STORES_IN_CITY, {

            id: cityId

        });

        performApiCall(url, onFinish);

    }

    /**
     *
     * Retrieves all ATMS
     *
     * @param {Function} onFinish
     */
    getATMs(onFinish)
    {

        performApiCall(ATM_LOCATIONS, onFinish)

    }

    /**
     *
     * Replaces placeholders with actual values
     *
     * @param {String} placeholder
     * @param {Object} values
     * @return {string}
     */
    getApiUrl(placeholder, values)
    {

        values = values ? values : {};

        values['lang'] = this[_fieldLanguage];

        values['segment'] = this[_fieldSegment];

        return placeholder.replace(/\{([a-z]+)\}/gi, (placeholder, placeholderName) => {

            return typeof values[placeholderName] !== 'undefined' ? values[placeholderName] : '';

        });

    }

    dispose()
    {

        this[_fieldLanguage] = null;

        _fieldLanguage = null;

        this[_fieldSegment] = null;

        _fieldSegment = null;

    }

}

module.exports = TelenorAPIClient;