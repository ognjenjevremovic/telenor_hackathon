const express = require('express');
const morgan = require('morgan');
const env = require('dotenv');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const path = require('path');

const app = express();

//  Register the env vars
env.config();

//  Register the routes
app.use('/webhook', require(path.join(__dirname, 'routes', 'webook')));

const { PORT } = process.env;

app.listen(process.env.PORT, () => {
    console.log(`
        Server runnin and listening on port : ${PORT}

        Go to : http://localhost:${PORT}
    `);
});
