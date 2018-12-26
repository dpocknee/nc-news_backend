const { getArrayOfValidElements, errorCreator } = require('../utils');
const { Article, Comment, User } = require('../models/');

// GET /api/users/:username
// e.g: `/api/users/mitch123`
// Returns a JSON object with the profile data for the specified user.
exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  return getArrayOfValidElements(User, 'username')
    .then(validThings => {
      const errorChecker = errorCreator(validThings, username, 404, 'user', next);
      if (errorChecker) return Promise.reject(errorChecker);
      return User.findOne()
        .where('username')
        .equals(username)
        .lean();
    })
    .then(foundUser => res.status(200).send(foundUser))
    .catch(next);
};

// users/:username/articles
exports.getArticlesByUsername = (req, res, next) => getArrayOfValidElements(User, 'username')
  .then(validUsers => {
    const isThereAnError = errorCreator(validUsers, req.params.username, 404, 'user', next);
    return isThereAnError ? Promise.reject(isThereAnError) : 0;
  })
  .then(() => User.findOne().where({ username: req.params.username }))
  .then(user => Article.find({ created_by: user._id }).populate('created_by'))
  .then(foundArticles => res.status(200).send(foundArticles))
  .catch(next);

// users/:username/comments
exports.getCommentsByUsername = (req, res, next) => getArrayOfValidElements(User, 'username')
  .then(validUsers => {
    const isThereAnError = errorCreator(validUsers, req.params.username, 404, 'user', next);
    return isThereAnError ? Promise.reject(isThereAnError) : 0;
  })
  .then(() => User.findOne().where({ username: req.params.username }))
  .then(user => Comment.find({ created_by: user._id })
    .populate('created_by')
    .populate('belongs_to'))
  .then(foundComments => res.status(200).send(foundComments))
  .catch(next);
