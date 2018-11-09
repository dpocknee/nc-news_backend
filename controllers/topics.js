const mongoose = require('mongoose');
const config = require('../config');
const {
  getArrayOfValidElements,
  errorCreator,
  commentCount
} = require('../utils');
const { Topic, Article, Comment, User } = require('../models/');

exports.getDefault = (req, res, next) => {
  return res.render('index');
};

exports.getTopics = (req, res, next) => {
  // All topics
  return mongoose
    .connect(config.DB_URL)
    .then(() => {
      return Topic.find();
    })
    .then(foundTopics => {
      return res.send(foundTopics);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(next);
};

exports.getTopicsByArticle = (req, res, next) => {
  // topics/:topic_slug/articles
  return mongoose
    .connect(config.DB_URL)
    .then(() => {
      return getArrayOfValidElements(Topic, 'slug');
    })
    .then(validTopics => {
      errorCreator(validTopics, req.params.topic_slug, 404, 'topic', next);
      return Promise.all([
        Article.find()
          .where('belongs_to')
          .equals(req.params.topic_slug)
          .lean(),
        commentCount(
          Comment,
          'belongs_to',
          Topic,
          'slug',
          req.params.topic_slug
        )
      ]);
    })
    .then(([foundArticles, countValue]) => {
      const outputArticles = [];
      const foundArticles2 = [...foundArticles];
      foundArticles2.forEach(article => {
        article['comment_count'] = countValue;
        outputArticles.push(article);
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

exports.addArticleByTopic = (req, res, next) => {
  return mongoose
    .connect(config.DB_URL)
    .then(() => {
      return Promise.all([
        getArrayOfValidElements(Topic, 'slug'),
        getArrayOfValidElements(User, '_id')
      ]);
    })
    .then(([validTopics, validUsers]) => {
      errorCreator(validTopics, req.params.topic_slug, 404, 'topic', next);
      errorCreator(validUsers, req.body.created_by, 404, 'user', next);
      const newArticle = new Article({
        title: req.body.title,
        body: req.body.body,
        belongs_to: req.params.topic_slug,
        created_by: req.body.created_by
      });
      return newArticle.save();
    })
    .then(postedArticle => {
      return postedArticle.populate('created_by');
    })
    .then(populatedArticle => {
      return res.status(201).send(populatedArticle);
    })
    .then(() => {
      return mongoose.disconnect();
    })
    .catch(next);
};
