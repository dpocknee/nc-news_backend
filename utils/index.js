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

const buildRefObject = (seededData, targetKey) => {
  return seededData.reduce((referenceObject, currentData) => {
    referenceObject[currentData[targetKey]] = currentData._id;
    return referenceObject;
  }, {});
};

module.exports = {
  buildRefObject,
  formatData
};
