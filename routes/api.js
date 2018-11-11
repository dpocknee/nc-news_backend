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

const { getUserByUsername } = require('../controllers/users');

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

apiRouter.route('/users/:username').get(getUserByUsername);

module.exports = apiRouter;

// GET
// topics
// articles
// comments

// topics/topic_slug/articles
// articles/article_id
// articles/article_id/comments
// comments/comment_id
// users/username
