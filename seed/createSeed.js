// SEEDING DIAGRAM
//		    comment
//		     |  |
//		     V  |
//	 article  |
//	|      |	|
//	V      V  V
//  topics user

const seedDB = require('./seed');
const mongoose = require('mongoose');
const { config, currentEnvironment } = require('../config');
const { User, Article, Comment, Topic } = require('../models');
const { buildRefObject, formatData } = require('../utils');

const articlesData = require(`./${currentEnvironment}Data/articles.json`);
const commentsData = require(`./${currentEnvironment}Data/comments.json`);
const topicsData = require(`./${currentEnvironment}Data/topics.json`);
const usersData = require(`./${currentEnvironment}Data/users.json`);

mongoose
  .connect(
    config.DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => {
    return mongoose.connection.dropDatabase();
  })
  .then(() => {
    return Promise.all([seedDB(Topic, topicsData), seedDB(User, usersData)]);
  })
  .then(([seededTopics, seededUsers]) => {
    const topicRefObj = buildRefObject(seededTopics, 'slug', 'slug');
    const userRefObj = buildRefObject(seededUsers, 'username', '_id');
    const formattedArticles = formatData(
      articlesData,
      topicRefObj,
      'topic',
      userRefObj,
      'created_by'
    );
    console.log(topicRefObj);
    return Promise.all([seedDB(Article, formattedArticles), userRefObj]);
  })
  .then(([seededArticle, userRefObj]) => {
    const articleRefObject = buildRefObject(seededArticle, 'title', '_id');
    const formattedComments = formatData(
      commentsData,
      articleRefObject,
      'belongs_to',
      userRefObj,
      'created_by'
    );
    return seedDB(Comment, formattedComments);
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch({ status: 500, msg: 'Database not seeded.' });
