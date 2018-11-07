const seedDB = (model, data) => {
  console.log('Seeding the database...');
  return model
    .insertMany(data)
    .then(dataUsed => {
      console.log('... database seeded: ');
      return dataUsed;
    })
    .catch(console.log);
};

module.exports = seedDB;
