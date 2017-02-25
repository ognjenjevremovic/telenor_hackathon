const AnswerEntity = require(__dirname + '/../AnswerEntity');

class PhonesAnswer extends AnswerEntity
{

    constructor()
    {
        super('phones')
    }

    factory(entities)
    {
        console.log('asdasd');
    }
}

module.exports = PhonesAnswer;