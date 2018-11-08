const apiRouter = require('express').Router();
const {
  getDefault,
  getTopics,
  getTopicsByArticle,
  addArticleByTopic
} = require('../controllers/topics');

apiRouter.route('/').get(getDefault);
apiRouter.route('/topics').get(getTopics);
apiRouter
  .route('/topics/:topic_slug/articles')
  .get(getTopicsByArticle)
  .post(addArticleByTopic);

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
