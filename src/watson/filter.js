module.exports = (responseFromWatson) => {
    //  All the response body fields
    const { entities, intents, output } = responseFromWatson;

    //  Take the highest matching intent
    const intent = intents.sort((first, second) => {
        if(first && second) return -(first.confidence - second.confidence);
        return 0;
    })[0];

    //  Return the object of intent and entities
    return {
        intent: intent.intent,
        entities: entities || [],
        watsonMsg: output.text[0]
    }; 
};
