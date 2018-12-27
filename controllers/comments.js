const { getArrayOfValidElements, errorCreator } = require('../utils');
const { Comment } = require('../models');

exports.changeCommentVotes = (req, res, next) => {
  const id = {
    model: Comment,
    identifier: req.params.comment_id,
    parameter: '_id',
    name: 'comment',
  };
  return getArrayOfValidElements(id.model, id.parameter)
    .then(validThings => {
      const errorChecker = errorCreator(validThings, id.identifier, 404, id.name, next);
      if (errorChecker) return Promise.reject(errorChecker);
      const queryKeys = Object.keys(req.query);
      if (queryKeys.length > 0 && !queryKeys.includes('vote')) {
        return Promise.reject({ status: 400, msg: 'Not a valid query.' });
      }
      if (req.query.vote !== 'up' && req.query.vote !== 'down') {
        return Promise.reject({ status: 400, msg: 'Not a valid query key.' });
      }
      return Comment.findById(id.identifier, (err, comment) => comment);
    })
    .then(foundComment => {
      const newVotes = req.query.vote === 'up' ? foundComment.votes + 1 : foundComment.votes - 1;
      return Comment.findByIdAndUpdate(
        id.identifier,
        { votes: newVotes },
        { new: true },
        (err, func) => {
          if (err) next(err);
          return func;
        },
      );
    })
    .then(updatedArticles => res.status(201).send(updatedArticles))
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const id = {
    model: Comment,
    identifier: req.params.comment_id,
    parameter: '_id',
    name: 'comment',
  };
  return getArrayOfValidElements(id.model, id.parameter)
    .then(validThings => {
      const errorChecker = errorCreator(validThings, id.identifier, 404, id.name, next);
      if (errorChecker) return Promise.reject(errorChecker);
      return Comment.findByIdAndRemove(id.identifier);
    })
    .then(removedComment => res.status(202).send(removedComment))
    .catch(next);
};
