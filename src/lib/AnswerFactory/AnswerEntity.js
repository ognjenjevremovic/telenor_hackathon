
const _fieldIntent = Symbol('intent');

class AnswerEntity
{
    constructor(intent)
    {

        if (this.constructor === AnswerEntity) {

            throw new Error('Abstract classes cannot be instantiated.');

        }

        this[_fieldIntent] = intent;

    }

    /**
     *
     * Abstract methods (MUST BE OVERRIDEN IN CHILD CLASS)
     *
     * @param {Object[]} entities
     */
    factory(entities) {}

    /**
     *
     * Checks whether or not is current factory match for data retrieved from Watson
     *
     * @param {String} intent Intent returned from Watson API
     * @return {boolean}
     */
    isMatch(intent)
    {

        return intent === this[_fieldIntent];

    }

}

module.exports = AnswerEntity;