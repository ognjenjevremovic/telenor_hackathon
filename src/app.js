const express = require('express');
const morgan = require('morgan');
const env = require('dotenv');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');

const app = express();

const TelenorAPIClient = require(__dirname + '/lib/TelenorAPIClient');

new TelenorAPIClient();

//  Register the env vars
env.config();

const { PORT } = process.env;

//  Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));


//  Register the routesc
app.use('/webhook', require(path.join(__dirname, 'routes', 'webhook')));


//  Open the socket
app.listen(process.env.PORT, () => {
    console.log(`
        Server runnin and listening on port : ${PORT}

        Go to : http://localhost:${PORT}
    `);
});
