module.exports = (responseFromWatson) => {

    //  All the intents
    const { intents } = responseFromWatson;
    // //  All the entities
    const { entites } = responseFromWatson;

    //  Take the highest matching intent
    const intent = intents.sort((first, second) => {
        return -(first.confidence - second.confidence);
    })[0];

    //  Return the object of intent and entities
    return { intent, entites };

};
