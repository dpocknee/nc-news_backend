/*  eslint max-len: 0, no-param-reassign: 0 */
const buildRefObject = (seededData, targetKey, sourceKey) => seededData.reduce((referenceObject, currentData) => {
  referenceObject[currentData[targetKey]] = currentData[sourceKey];
  return referenceObject;
}, {});

const formatData = (
  inputData,
  firstReferenceObject,
  firstReferenceKey,
  secondReferenceObject,
  secondReferenceKey
) => inputData.map(datum => ({
  ...datum,
  belongs_to: firstReferenceObject[datum[firstReferenceKey]],
  created_by: secondReferenceObject[datum[secondReferenceKey]]
}));

const getArrayOfValidElements = (model, typeOfInfo) => model.find().then(topics => {
  const topicArray = topics.reduce((routesArray, topic) => {
    routesArray.push(String(topic[typeOfInfo]));
    return routesArray;
  }, []);
  return topicArray;
});

const errorCreator = (validArray, toCompare, status, model) => (!validArray.includes(toCompare)
  ? {
    status,
    msg: `${toCompare} is not a valid ${model}!`
  }
  : null);

const commentCount = (comments, commentType, topic, slug, cats) => topic
  .find()
  .where(slug)
  .equals(cats)
  .then(() => comments.find().populate(commentType))
  .then(commentsArray => commentsArray.reduce(
    (accum, comment) => (comment.belongs_to.belongs_to === cats ? accum + 1 : accum),
    0
  ))
  .catch();

module.exports = {
  buildRefObject,
  formatData,
  getArrayOfValidElements,
  errorCreator,
  commentCount
};
