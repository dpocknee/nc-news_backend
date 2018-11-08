const buildRefObject = (seededData, targetKey, sourceKey) => {
  return seededData.reduce((referenceObject, currentData) => {
    referenceObject[currentData[targetKey]] = currentData[sourceKey];
    return referenceObject;
  }, {});
};

const formatData = (
  inputData,
  firstReferenceObject,
  firstReferenceKey,
  secondReferenceObject,
  secondReferenceKey
) => {
  return inputData.map(datum => {
    return {
      ...datum,
      belongs_to: firstReferenceObject[datum[firstReferenceKey]],
      created_by: secondReferenceObject[datum[secondReferenceKey]]
    };
  });
};

module.exports = {
  buildRefObject,
  formatData
};

const countAmount = model => {
  return mongoose
    .connect(config.DB_URL)
    .then(() => {
      return Article.find();
    })
    .then(originalDocs => {
      return Promise.all([originalDocs, mongoose.disconnect()]);
    });
};
