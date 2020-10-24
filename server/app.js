const chalk = require('chalk');
const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed')

const app = express();

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST, PUT,PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use(bodyParser.json()); //Used to parse incoming Json Data
app.use(feedRoutes)

const port = 8080;

app.listen(port, () => {
    console.log(chalk.green.bold(`On Port:${port}`))
    console.log(chalk.green.bold.underline(`Running on http://localhost:${port}`))
}); 