// If seed:dev or seed:test is called from the terminal:
// If the ENV is set by some code:
const currentEnv = process.env.NODE_ENV
  ? process.env.NODE_ENV
  : process.env.npm_lifecycle_event.split(':')[1];

const createSeed = require('./createSeed');
const mongoose = require('mongoose');
const config = require('../config');

mongoose
  .connect(config.DB_URL)
  .then(() => {
    return createSeed();
  })
  .then(() => mongoose.disconnect());
