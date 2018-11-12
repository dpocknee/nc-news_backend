const mongoose = require('mongoose');
const createSeed = require('./createSeed');

const DB_URL = process.env.DB_URL;
mongoose
  .connect(DB_URL)
  .then(() => {
    return createSeed();
  })
  .then(() => mongoose.disconnect());
