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
  getCommentsByArticle
} = require('../controllers/articles');

apiRouter.route('/').get(getDefault);
apiRouter.route('/topics').get(getTopics);
apiRouter
  .route('/topics/:topic_slug/articles')
  .get(getArticlesByTopic)
  .post(addArticleByTopic);

apiRouter.route('/articles/:article_id/comments').get(getCommentsByArticle);
apiRouter.route('/articles/:article_id').get(getArticlesById);
apiRouter.route('/articles').get(getArticles);
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
