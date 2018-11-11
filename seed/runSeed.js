const createSeed = require('./createSeed');
const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || require('../config');

mongoose
  .connect(DB_URL)
  .then(() => {
    return createSeed();
  })
  .then(() => mongoose.disconnect());
