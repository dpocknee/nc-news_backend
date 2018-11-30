const apiRouter = require('express').Router();

const {
  getDefault,
  getTopics,
  getArticlesByTopic,
  addArticleByTopic
} = require('../controllers/topics');
const {
  getArticles,
  getArticlesById,
  getCommentsByArticle,
  addCommentsByArticle,
  changeVotes
} = require('../controllers/articles');

const {
  changeCommentVotes,
  deleteComment
} = require('../controllers/comments');

const {
  getUserByUsername,
  getArticlesByUsername,
  getCommentsByUsername
} = require('../controllers/users');

// ---Routers---

apiRouter.route('/').get(getDefault);
apiRouter.route('/topics').get(getTopics);
apiRouter
  .route('/topics/:topic_slug/articles')
  .get(getArticlesByTopic)
  .post(addArticleByTopic);

apiRouter
  .route('/articles/:article_id/comments')
  .get(getCommentsByArticle)
  .post(addCommentsByArticle);
apiRouter
  .route('/articles/:article_id')
  .get(getArticlesById)
  .patch(changeVotes);
apiRouter.route('/articles').get(getArticles);

apiRouter
  .route('/comments/:comment_id')
  .patch(changeCommentVotes)
  .delete(deleteComment);

apiRouter.route('/users/:username/articles').get(getArticlesByUsername);
apiRouter.route('/users/:username/comments').get(getCommentsByUsername);
apiRouter.route('/users/:username').get(getUserByUsername);

module.exports = apiRouter;
