const seedDB = (model, data) => model
  .insertMany(data)
  .then(dataUsed => dataUsed)
  .catch(err => console.log('ERROR from SeedDB: ', err));

module.exports = seedDB;
