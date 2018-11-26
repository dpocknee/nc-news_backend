const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');
const app = express();
const config = !process.env.NODE_ENV ? require('./config') : '';
process.env.NODE_ENV = 'test' ? 'test' : 'dev';
const ENV = process.env.NODE_ENV === 'test' ? 'test' : 'dev';
process.env.DB_URL = process.env.DB_URL || config[ENV].DB_URL;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/api', apiRouter);
app.use('/*', (req, res, next) => {
  next({ status: 404, msg: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  // console.log(err);
  res.status(err.status || 500).send({ message: err.msg || 'Bad Request' });
});

module.exports = app;
