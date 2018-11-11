const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL;
const {
  getArrayOfValidElements,
  errorCreator,
  commentCount
} = require('../utils');
const { Topic, Article, Comment, User } = require('../models/');

exports.getArticles = (req, res, next) => {
  // All topics
  return mongoose
    .connect(DB_URL)
    .then(() => {
      return Article.find();
    })
    .then(foundArticles => {
      return res.send(foundArticles);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(next);
};

exports.getArticlesById = (req, res, next) => {
  // articles/:article_id
  const id = {
    model: Article,
    identifier: req.params.article_id,
    parameter: '_id',
    name: 'article'
  };
  return mongoose
    .connect(DB_URL)
    .then(() => {
      return getArrayOfValidElements(id.model, id.parameter);
    })
    .then(validThings => {
      errorCreator(validThings, id.identifier, 404, id.name, next);
      return Promise.all([
        Article.find()
          .where(id.parameter)
          .equals(id.identifier)
          .lean(),
        commentCount(
          Comment,
          'belongs_to',
          id.model,
          id.parameter,
          id.identifier
        )
      ]);
    })
    .then(([foundArticles, countValue]) => {
      const outputArticles = foundArticles.map(article => {
        article['comment_count'] = countValue;
        return article;
      });
      if (foundArticles !== undefined) {
        return res.status(200).send(outputArticles);
      } else return foundArticles;
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(next);
};

exports.getCommentsByArticle = (req, res, next) => {
  //GET /api/articles/:article_id/comments
  return mongoose
    .connect(DB_URL)
    .then(() => {
      return getArrayOfValidElements(Article, '_id');
    })
    .then(validThings => {
      errorCreator(validThings, req.params.article_id, 404, 'article', next);
      return Comment.find()
        .where('belongs_to')
        .equals(req.params.article_id)
        .lean();
    })
    .then(foundComments => {
      return res.status(200).send(foundComments);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(next);
};

exports.addCommentsByArticle = (req, res, next) => {
  return mongoose
    .connect(DB_URL)
    .then(() => {
      return Promise.all([
        getArrayOfValidElements(Article, '_id'),
        getArrayOfValidElements(User, '_id')
      ]);
    })
    .then(([validArticles, validUsers]) => {
      errorCreator(validArticles, req.params.article_id, 400, 'article', next);
      errorCreator(validUsers, req.body.created_by, 400, 'user', next);
      if (req.body.body === undefined)
        return next({
          status: 400,
          msg: 'Request did not include a "body" value.'
        });
      if (req.body.created_by === undefined)
        return next({
          status: 400,
          msg: 'Request did not include a "created_by" value.'
        });
      const newComment = new Comment({
        body: req.body.body,
        belongs_to: req.params.article_id,
        created_by: req.body.created_by
      });
      return newComment.save();
    })
    .then(postedArticle => {
      return res.status(201).send(postedArticle);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(next);
};

exports.changeVotes = (req, res, next) => {
  const id = {
    model: Article,
    identifier: req.params.article_id,
    parameter: '_id',
    name: 'article'
  };
  return mongoose
    .connect(DB_URL)
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
      return Promise.all([
        Article.find()
          .where('_id')
          .equals(req.params.article_id),
        commentCount(
          Comment,
          'belongs_to',
          id.model,
          id.parameter,
          id.identifier
        )
      ]);
    })
    .then(([foundArticle, countValue]) => {
      const newVotes =
        req.query.vote === 'up'
          ? foundArticle[0].votes + 1
          : foundArticle[0].votes - 1;
      return Article.findByIdAndUpdate(
        req.params.article_id,
        { votes: newVotes },
        { new: true },
        (err, func) => {
          if (err) next(err);
          return { ...func, comment_count: countValue };
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
