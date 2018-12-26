const seedDB = (model, data) => model
  .insertMany(data)
  .then(dataUsed => dataUsed)
  .catch(console.log);

module.exports = seedDB;
