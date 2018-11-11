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

const { changeCommentVotes } = require('../controllers/comments');

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

apiRouter.route('/comments/:comment_id').patch(changeCommentVotes);

// PATCH /api/comments/:comment_id
// # Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
// # e.g: `/api/comments/:comment_id?vote=down`
// apiRouter.route()

// apiRouter.route('/:top_art_com_us/:type_id/:material_type').get(getGeneral);

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
