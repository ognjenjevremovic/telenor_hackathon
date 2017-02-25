
const _fieldTitle = Symbol('title');

const _fieldType = Symbol('type');

const _fieldValue = Symbol('value');

class FacebookButton
{

    /**
     *
     * @param {String} title Text that will be shown
     * @param {String} type Type of button - web_url or postback
     * @param value
     */
    constructor(title, type, value)
    {

        this[_fieldTitle] = title;

        this[_fieldType] = type;

        this[_fieldValue] = value;

    }

    /**
     *
     * Retrieves data required by facebook
     *
     * @return {{title: String, type: String, [url: String], [payload: String]}}
     */
    getObject()
    {

        let object = {

            title: this[_fieldTitle],

            type: this[_fieldType]

        };

        object['web_url' === this[_fieldType] ? 'url' : 'payload'] = this[_fieldValue];

        return object;
    }

    /**
     *
     * Retrieves data ready for facebook
     *
     * @param {FacebookButton[]} buttons
     * @return {Array}
     */
    static getButtonsData(buttons)
    {

        buttons = buttons instanceof Array ? buttons : [];

        return buttons.map((button) => {

            if (false === button instanceof FacebookButton) {

                return null;

            }

            return button.getObject();

        });

    }

}

/**
 * Facebook messenger button that leads to external URL
 */
class FacebookUrlButton extends FacebookButton
{
    constructor(title, url)
    {

        super(title, 'web_url', url)

    }
}

/**
 * Facebook messenger button that triggers certain action on webhook
 */
class FacebookWebHookButton extends FacebookButton
{

    constructor(title, hookUrl)
    {

        super(title, 'postback', hookUrl);

    }

}

module.exports.FacebookButton = FacebookButton;

module.exports.FacebookUrlButton = FacebookUrlButton;

module.exports.FacebookWebHookButton = FacebookWebHookButton;