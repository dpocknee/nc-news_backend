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
  return Topic.find()
    .then(foundTopics => {
      return res.send(foundTopics);
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  // topics/:topic_slug/articles
  return getArrayOfValidElements(Topic, 'slug')
    .then(validTopics => {
      const isThereAnError = errorCreator(
        validTopics,
        req.params.topic_slug,
        404,
        'topic',
        next
      );
      return isThereAnError ? Promise.reject(isThereAnError) : 0;
    })
    .then(() => {
      return Promise.all([
        Article.find()
          .populate('created_by')
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
      const foundArticles2 = [...foundArticles].map(article => {
        article['comment_count'] = countValue;
        return article;
      });
      if (foundArticles2 !== undefined) {
        return res.status(200).send(foundArticles2);
      } else return foundArticles;
    })
    .catch(next);
};

exports.addArticleByTopic = (req, res, next) => {
  return Promise.all([
    getArrayOfValidElements(Topic, 'slug'),
    getArrayOfValidElements(User, '_id')
  ])
    .then(([validTopics, validUsers]) => {
      const error1 = errorCreator(
        validTopics,
        req.params.topic_slug,
        404,
        'topic',
        next
      );
      const error2 = errorCreator(
        validUsers,
        req.body.created_by,
        404,
        'user',
        next
      );
      if (error1) return Promise.reject(error1);
      if (error2) return Promise.reject(error2);
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
    .catch(next);
};
