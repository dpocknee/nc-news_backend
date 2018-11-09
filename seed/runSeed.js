// If seed:dev or seed:test is called from the terminal:
const seedType = process.env.npm_lifecycle_event.split(':')[1];
// If the ENV is set by some code:
const currentEnv = process.env.NODE_ENV ? process.env.NODE_ENV : seedType;

const createSeed = require('./createSeed');
const mongoose = require('mongoose');
const config = require('../config');

mongoose
  .connect(config.DB_URL)
  .then(() => {
    return createSeed();
  })
  .then(() => mongoose.disconnect());
