
const SEARCH_ROUTE = 'http://www.telenor.rs/hackathon/lng/{lang}/segment/{segment}/search/{term}/';

const TARIFF_PACKAGES = 'http://www.telenor.rs/webshop/hackathon/tariff-packages/';

const TARIFF_PACKAGE = 'http://www.telenor.rs/webshop/hackathon/tariff-package-id/{id}/';

const TARIFF_PACKAGE_SEGMENT = 'http://www.telenor.rs/webshop/hackathon/tariff-package-segment/{segment}/';

const ROAMING_COUNTRIES = 'http://www.telenor.rs/hackathon/roaming/countries/';

const ROAMING_COUNTRY = 'http://www.telenor.rs/hackathon/roaming/country/{id}/lng/{lang}/';

const ROAMING_PARTNER = 'http://www.telenor.rs/hackathon/roaming/partner/{id}/lng/{lang}/';

const ROAMING_PARTNER_COUNTRY = 'http://www.telenor.rs/hackathon/roaming/partners-by-country/{id}/lng/{lang}/';

const ROAMING_PACKAGE = 'http://www.telenor.rs/hackathon/roaming/package/{id}/lng/{lang}/';

const ROAMING_PACKAGE_COUNTRY = 'http://www.telenor.rs/hackathon/roaming/packages-by-country/{id}/lng/{lang}/';

const _fieldLanguage = Symbol('lang');

const _methodValidateAndExecuteCallback = Symbol('validateCallback');

class TelenorAPIClient
{

    constructor(language)
    {

        this[_fieldLanguage] = language || 'en';

        this[_methodValidateAndExecuteCallback] = (callback, parameters) => {

            parameters = parameters instanceof Array ? parameters : [];

            if (typeof callback !== 'function') {

                return;

            }

            callback.apply(callback, parameters);

        };

    }

    searchTerm(term, onFound)
    {

        if (typeof term !== 'string' || 0 === term.length) {

            return this[_methodValidateAndExecuteCallback](onFound, [ 'Missing search term.' ]);

        }



    }

    dispose()
    {

        this[_fieldLanguage] = null;

    }

}

module.exports = TelenorAPIClient;