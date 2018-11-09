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
    name: 'article',
    comment_id: ''
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

// exports.addArticleByTopic = (req, res, next) => {
//   return mongoose
//     .connect(config.DB_URL)
//     .then(() => {
//       return Promise.all([
//         getArrayOfValidElements(Topic, 'slug'),
//         getArrayOfValidElements(User, '_id')
//       ]);
//     })
//     .then(([validTopics, validUsers]) => {
//       errorCreator(validTopics, req.params.topic_slug, 404, 'topic', next);
//       errorCreator(validUsers, req.body.created_by, 404, 'user', next);
//       const newArticle = new Article({
//         title: req.body.title,
//         body: req.body.body,
//         belongs_to: req.params.topic_slug,
//         created_by: req.body.created_by
//       });
//       return newArticle.save();
//     })
//     .then(postedArticle => {
//       return postedArticle.populate('created_by');
//     })
//     .then(populatedArticle => {
//       return res.status(201).send(populatedArticle);
//     })
//     .then(() => {
//       return mongoose.disconnect();
//     })
//     .catch(next);
// };
