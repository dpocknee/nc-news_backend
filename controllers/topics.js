const { getArrayOfValidElements, errorCreator, commentCount } = require('../utils');
const {
  Topic, Article, Comment, User
} = require('../models/');

exports.getDefault = (req, res) => res.render('index');

// All topics
exports.getTopics = (req, res, next) => Topic.find()
  .then(foundTopics => res.send(foundTopics))
  .catch(next);

// topics/:topic_slug/articles
/* eslint no-param-reassign: 0 */
exports.getArticlesByTopic = (req, res, next) => getArrayOfValidElements(Topic, 'slug')
  .then(validTopics => {
    const { topic_slug } = req.params;
    const isThereAnError = errorCreator(validTopics, topic_slug, 404, 'topic');
    return isThereAnError ? Promise.reject(isThereAnError) : 0;
  })
  .then(() => Promise.all([
    Article.find()
      .populate('created_by')
      .where('belongs_to')
      .equals(req.params.topic_slug)
      .lean(),
    commentCount(Comment, 'belongs_to', Topic, 'slug', req.params.topic_slug)
  ]))
  .then(([foundArticles, countValue]) => {
    const foundArticles2 = [...foundArticles].map(article => {
      article.comment_count = countValue;
      return article;
    });
    if (foundArticles2 !== undefined) {
      return res.status(200).send(foundArticles2);
    }
    return foundArticles;
  })
  .catch(next);

exports.addArticleByTopic = (req, res, next) => {
  const { topic_slug } = req.params;
  const { created_by, body, title } = req.body;
  return Promise.all([getArrayOfValidElements(Topic, 'slug'), getArrayOfValidElements(User, '_id')])
    .then(([validTopics, validUsers]) => {
      const error1 = errorCreator(validTopics, topic_slug, 404, 'topic');
      const error2 = errorCreator(validUsers, created_by, 404, 'user');
      if (error1) return Promise.reject(error1);
      if (error2) return Promise.reject(error2);
      const newArticle = new Article({
        title,
        body,
        created_by,
        belongs_to: topic_slug
      });
      return newArticle.save();
    })
    .then(postedArticle => Article.findById(postedArticle._id).populate('created_by'))
    .then(populatedArticle => res.status(201).send(populatedArticle))
    .catch(next);
};
