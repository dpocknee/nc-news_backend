const { getArrayOfValidElements, errorCreator } = require('../utils');
const { Topic, Article, Comment, User } = require('../models/');

exports.getUserByUsername = (req, res, next) => {
  // GET /api/users/:username
  //# e.g: `/api/users/mitch123`
  // Returns a JSON object with the profile data for the specified user.
  const id = {
    model: User,
    identifier: req.params.username,
    parameter: 'username',
    name: 'user'
  };
  return getArrayOfValidElements(id.model, id.parameter)
    .then(validThings => {
      const errorChecker = errorCreator(
        validThings,
        id.identifier,
        404,
        id.name,
        next
      );
      if (errorChecker) return Promise.reject(errorChecker);
      else
        return User.findOne()
          .where(id.parameter)
          .equals(id.identifier)
          .lean();
    })
    .then(foundUser => {
      return res.status(200).send(foundUser);
    })
    .catch(next);
};