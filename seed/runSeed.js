const mongoose = require('mongoose');
const createSeed = require('./createSeed');

const { DB_URL } = process.env;

mongoose
  .connect(DB_URL)
  .then(() => createSeed())
  .then(() => mongoose.disconnect());
