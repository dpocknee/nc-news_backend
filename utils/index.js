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

const getArrayOfValidElements = (model, typeOfInfo) => {
  return model
    .find()
    .then(topics => {
      const topicArray = topics.reduce((routesArray, topic) => {
        routesArray.push(String(topic[typeOfInfo]));
        return routesArray;
      }, []);
      return topicArray;
    })
    .catch(console.log);
};

const errorCreator = (validArray, toCompare, status, model, next) => {
  if (!validArray.includes(toCompare)) {
    return next({
      status: status,
      msg: `${toCompare} is not a valid ${model}!`
    });
  }
};

module.exports = {
  buildRefObject,
  formatData,
  getArrayOfValidElements,
  errorCreator
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
