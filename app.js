const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
  next({ status: 404, msg: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ message: err.msg || 'Bad Request' });
});

module.exports = app;
