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

const commentCount = (comments, commentType, topic, slug, cats) => {
  // countAmount(modelToSearch, parameterToSearch, Topic, 'slug')
  return topic
    .find()
    .where(slug)
    .equals(cats)
    .then(() => {
      return comments.find().populate(commentType);
    })
    .then(commentsArray => {
      return commentsArray.reduce((accum, comment) => {
        return comment.belongs_to.belongs_to === cats ? accum + 1 : accum;
      }, 0);
    })
    .catch(console.log);
};

module.exports = {
  buildRefObject,
  formatData,
  getArrayOfValidElements,
  errorCreator,
  commentCount
};
