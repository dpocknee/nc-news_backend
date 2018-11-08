const seedDB = (model, data) => {
  return model
    .insertMany(data)
    .then(dataUsed => {
      return dataUsed;
    })
    .catch(console.log);
};

module.exports = seedDB;
