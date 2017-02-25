const AnswerEntity = require(__dirname + '/../AnswerEntity');

const TelenorAPIClient = require(__dirname + '/../../TelenorAPIClient');

class StoresAnswers extends AnswerEntity
{

    constructor()
    {

        super('store');

    }

    factory(entities)
    {

        console.log('COA CAR');

        // Dugmice

        // Poruku

        // return generisni podaci

    }

}

module.exports = StoresAnswers;