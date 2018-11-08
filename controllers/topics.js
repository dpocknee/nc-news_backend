const mongoose = require('mongoose');
const config = require('../config');
const { Topic, Article, Comment, User } = require('../models/');

exports.getDefault = (req, res, next) => {
  res.render('index');
};

exports.getTopics = (req, res, next) => {
  // All topics
  mongoose
    .connect(config.DB_URL)
    .then(() => {
      return Topic.find();
    })
    .then(foundTopics => {
      res.send(foundTopics);
    })
    .then(() => {
      mongoose.disconnect();
    })
    .catch(next);
};

exports.getTopicsByArticle = (req, res, next) => {
  // topics/:topic_slug/articles
  mongoose
    .connect(config.DB_URL)
    .then(() => {
      return Topic.find();
    })
    .then(topics => {
      const possibleRoutes = topics.reduce((routesArray, topic) => {
        routesArray.push(topic.slug);
        return routesArray;
      }, []);
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
    .then(() => {
      mongoose.disconnect();
    })
    .catch(next);
};
