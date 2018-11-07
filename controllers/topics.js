const mongoose = require('mongoose');
const { config } = require('../config');
const { Topic, Article, Comment, User } = require('../models/');

exports.getDefault = (req, res, next) => {
  res.render('index');
};

exports.getTopics = (req, res, next) => {
  mongoose
    .connect(
      config.DB_URL,
      { useNewUrlParser: true }
    )
    .then(() => {
      // All topics
      return Topic.find();
    })
    .then(foundTopics => {
      res.send(foundTopics);
    })
    .catch(next);
};

exports.getTopicsByArticle = (req, res, next) => {
  // topics/:topic_slug/articles
  mongoose
    .connect(
      config.DB_URL,
      { useNewUrlParser: true }
    )
    .then(() => {
      // All topics
      const possibleRoutes = ['coding', 'football', 'cooking'];
      if (!possibleRoutes.includes(req.params.topic_slug)) {
        return next({
          status: 404,
          msg: `${req.params.topic_slug} is not a valid topic!`
        });
      } else {
        return Article.find()
          .where('belongs_to')
          .equals(req.params.topic_slug);
      }
    })
    .then(foundArticles => {
      res.status(200).send(foundArticles);
    })
    .catch(next);
};
