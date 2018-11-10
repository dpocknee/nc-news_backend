const mongoose = require('mongoose');
const config = require('../config');
const {
  getArrayOfValidElements,
  errorCreator,
  commentCount
} = require('../utils');
const { Topic, Article, Comment, User } = require('../models/');

exports.getArticles = (req, res, next) => {
  // All topics
  return mongoose
    .connect(config.DB_URL)
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
    .connect(config.DB_URL)
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
    .connect(config.DB_URL)
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
    .connect(config.DB_URL)
    .then(() => {
      return Promise.all([
        getArrayOfValidElements(Article, '_id'),
        getArrayOfValidElements(User, '_id')
      ]);
    })
    .then(([validArticles, validUsers]) => {
      // if (req.body === undefined)
      //   return next({
      //     status: 400,
      //     msg: 'Request did not include a JSON body.'
      //   });
      errorCreator(validArticles, req.params.article_id, 400, 'article', next);
      errorCreator(validUsers, req.body.created_by, 400, 'user', next);
      if (req.body.body === undefined)
        return next({
          status: 400,
          msg: 'Request did not include a "body" value.'
        });
      else if (req.body.created_by === undefined)
        return next({
          status: 400,
          msg: 'Request did not include a "created_by" value.'
        });
      else return 'OK';
    })
    .then(chosenArticle => {
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
