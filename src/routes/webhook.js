const express = require('express');
const router = express.Router();

router.post('/message', (request, response) => {

    let body = request.body;


});

router.get('/', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === 'alexander') {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    }
    else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

module.exports = router;