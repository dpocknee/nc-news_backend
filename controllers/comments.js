const mongoose = require('mongoose');
const config = require('../config');
const {
  getArrayOfValidElements,
  errorCreator,
  commentCount
} = require('../utils');
const { Topic, Article, Comment, User } = require('../models/');

exports.changeCommentVotes = (req, res, next) => {
  const id = {
    model: Comment,
    identifier: req.params.comment_id,
    parameter: '_id',
    name: 'comment'
  };
  return mongoose
    .connect(config.DB_URL)
    .then(() => {
      return getArrayOfValidElements(id.model, id.parameter);
    })
    .then(validThings => {
      errorCreator(validThings, id.identifier, 404, id.name, next);
      const queryKeys = Object.keys(req.query);
      if (queryKeys.length > 0 && !queryKeys.includes('vote')) {
        return next({ status: 400, msg: 'Not a valid query.' });
      }
      if (req.query.vote !== 'up' && req.query.vote !== 'down')
        return next({ status: 400, msg: 'Not a valid query key.' });
      return Comment.findById(id.identifier, (err, comment) => {
        if (err) console.log(err);
        return comment;
      });
    })
    .then(foundComment => {
      const newVotes =
        req.query.vote === 'up'
          ? foundComment.votes + 1
          : foundComment.votes - 1;
      return Comment.findByIdAndUpdate(
        id.identifier,
        { votes: newVotes },
        { new: true },
        (err, func) => {
          if (err) next(err);
          return func;
        }
      );
    })
    .then(updatedArticles => {
      return res.status(201).send(updatedArticles);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const id = {
    model: Comment,
    identifier: req.params.comment_id,
    parameter: '_id',
    name: 'comment'
  };
  return mongoose
    .connect(config.DB_URL)
    .then(() => {
      return getArrayOfValidElements(id.model, id.parameter);
    })
    .then(validThings => {
      errorCreator(validThings, id.identifier, 404, id.name, next);
      return Comment.findByIdAndRemove(id.identifier);
    })
    .then(removedComment => {
      return res.status(202).send(removedComment);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(next);
};
