const { getArrayOfValidElements, errorCreator, commentCount } = require('../utils');
const { Article, Comment, User } = require('../models/');

// All topics
exports.getArticles = (req, res, next) => Article.find()
  .populate('created_by')
  .then(foundArticles => res.send(foundArticles))
  .catch(next);

// articles/:article_id
/* eslint no-param-reassign: 0 */
exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  return getArrayOfValidElements(Article, '_id')
    .then(validThings => {
      const error1 = errorCreator(validThings, article_id, 404, 'article');
      if (error1) return Promise.reject(error1);

      return Promise.all([
        Article.find()
          .populate('created_by')
          .where('_id')
          .equals(article_id)
          .lean(),
        commentCount(Comment, 'belongs_to', Article, '_id', article_id)
      ]);
    })
    .then(([foundArticles, countValue]) => {
      const outputArticles = foundArticles.map(article => {
        article.comment_count = countValue;
        return article;
      });
      if (foundArticles !== undefined) {
        return res.status(200).send(outputArticles);
      }
      return foundArticles;
    })
    .catch(next);
};

// GET /api/articles/:article_id/comments
exports.getCommentsByArticle = (req, res, next) => getArrayOfValidElements(Article, '_id')
  .then(validThings => {
    const { article_id } = req.params;
    const errorChecker1 = errorCreator(validThings, article_id, 404, 'article');
    if (errorChecker1) return Promise.reject(errorChecker1);

    return Comment.find()
      .where('belongs_to')
      .equals(article_id)
      .lean()
      .populate('created_by');
  })
  .then(foundComments => res.status(200).send(foundComments))
  .catch(next);

exports.addCommentsByArticle = (req, res, next) => Promise.all([getArrayOfValidElements(Article, '_id'), getArrayOfValidElements(User, '_id')])
  .then(([validArticles, validUsers]) => {
    const { article_id } = req.params;
    const { created_by, body } = req.body;

    const errorChecker1 = errorCreator(validArticles, article_id, 400, 'article');
    const errorChecker2 = errorCreator(validUsers, created_by, 400, 'user');
    if (errorChecker1) return Promise.reject(errorChecker1);
    if (errorChecker2) return Promise.reject(errorChecker2);
    if (body === undefined) {
      return Promise.reject({
        status: 400,
        msg: 'Request did not include a "body" value.'
      });
    }
    if (created_by === undefined) {
      return Promise.reject({
        status: 400,
        msg: 'Request did not include a "created_by" value.'
      });
    }
    const newComment = new Comment({
      body,
      belongs_to: article_id,
      created_by
    });
    return newComment.save();
  })
  .then(returnedComment => {
    if (!returnedComment) return Promise.reject({ msg: 'invalid request' });
    return Comment.findById(returnedComment._id).populate('created_by');
  })
  .then(postedArticle => res.status(201).send(postedArticle))
  .catch(next);

exports.changeVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { vote } = req.query;
  return getArrayOfValidElements(Article, '_id')
    .then(validThings => {
      const errorChecker = errorCreator(validThings, article_id, 404, 'article');
      if (errorChecker) return Promise.reject(errorChecker);
      const queryKeys = Object.keys(req.query);
      if (queryKeys.length > 0 && !queryKeys.includes('vote')) {
        return Promise.reject({ status: 400, msg: 'Not a valid query.' });
      }
      if (vote !== 'up' && vote !== 'down') return Promise.reject({ status: 400, msg: 'Not a valid query key.' });
      return Promise.all([
        Article.find()
          .where('_id')
          .equals(article_id)
          .populate('created_by'),
        commentCount(Comment, 'belongs_to', Article, '_id', article_id)
      ]);
    })
    .then(([foundArticle, countValue]) => {
      const newVotes = vote === 'up' ? foundArticle[0].votes + 1 : foundArticle[0].votes - 1;
      return Article.findByIdAndUpdate(
        article_id,
        { votes: newVotes },
        { new: true },
        (err, func) => {
          if (err) next(err);
          return { ...func, comment_count: countValue };
        }
      );
    })
    .then(updatedArticles => res.status(201).send(updatedArticles))
    .catch(next);
};
