const cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const config = require('./config');

const app = express();

const { NODE_ENV } = process.env;

if (!NODE_ENV) {
  process.env.NODE_ENV = 'production';
  if (NODE_ENV === 'test') {
    process.env.DB_URL = config.test.DB_URL;
  } else {
    process.env.NODE_ENV = 'dev';
    process.env.DB_URL = config.dev.DB_URL;
  }
}

const { DB_URL } = process.env;

mongoose.connect(DB_URL);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use('/*', (req, res, next) => {
  next({ status: 404, msg: 'Page Not Found' });
});

/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.msg || 'Bad Request' });
});

module.exports = app;
