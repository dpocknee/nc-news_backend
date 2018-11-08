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
      if (foundArticles !== undefined) {
        return res.status(200).send(foundArticles);
      } else return foundArticles;
    })
    .then(() => {
      mongoose.disconnect();
    })
    .catch(next);
};

exports.addArticleByTopic = (req, res, next) => {
  mongoose
    .connect(config.DB_URL)
    .then(() => {
      const newArticle = new Article({
        title: req.body.title,
        body: req.body.body,
        belongs_to: req.params.topic_slug,
        created_by: req.body.created_by
      });
      return newArticle.save();
    })
    .then(postedArticle => {
      console.log(postedArticle);
      return Article.find(postedArticle).populate('created_by');
    })
    .then(populatedArticle => {
      console.log(populatedArticle);
      res.status(201).send(populatedArticle);
    })
    .then(() => {
      mongoose.disconnect();
    })
    .catch(next);
};
