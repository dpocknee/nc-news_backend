const mongoose = require('mongoose');
const createSeed = require('./createSeed');

// Is this a 'npm run seed:dev' or 'npm run seed:test' command?
// If so, set the DB_URL and NODE_ENV values to dev or test:

const [isSeed, seedType] = process.env.npm_lifecycle_event.split(':');
if (!process.env.NODE_ENV && isSeed === 'seed') {
  const config = require('../config');
  process.env.NODE_ENV = seedType;
  process.env.DB_URL = config[seedType].DB_URL;
}

console.log('seedType: ', seedType);

const { DB_URL } = process.env;
mongoose
  .connect(DB_URL)
  .then(() => createSeed(seedType))
  .then(() => mongoose.disconnect());
