const mongoose = require('mongoose');
const createSeed = require('./createSeed');

// Is this a 'npm run seed:dev', 'npm run seed:test'
// or 'npm run seed:production' command?
// If so, set the DB_URL and NODE_ENV values to dev or test:

const { DB_URL } = process.env;

if (!DB_URL) {
  const config = require('../config');
  const [isSeed, seedType] = process.env.npm_lifecycle_event.split(':');
  if (isSeed === 'seed') {
    process.env.NODE_ENV = seedType;
    process.env.DB_URL = config[seedType].DB_URL;
  }
}

mongoose
  .connect(process.env.DB_URL)
  .then(() => createSeed(process.env.NODE_ENV))
  .then(() => mongoose.disconnect());
