// SEEDING DIAGRAM
//		    comment
//		     |  |
//		     V  |
//	 article  |
//	|      |	|
//	V      V  V
//  topics user

//TO DO: Rewrite this to account for if this is not called from the terminal
// If seed:dev or seed:test is called from the terminal:
const seedType = process.env.npm_lifecycle_event.split(':')[1];
// If the ENV is set by some code:
const currentEnv = process.env.NODE_ENV ? process.env.NODE_ENV : seedType;

const seedDB = require('./seed');
const mongoose = require('mongoose');
const config = require('../config');
const { User, Article, Comment, Topic } = require('../models');
const { buildRefObject, formatData } = require('../utils');

const articlesData = require(`./${currentEnv}Data/articles.json`);
const commentsData = require(`./${currentEnv}Data/comments.json`);
const topicsData = require(`./${currentEnv}Data/topics.json`);
const usersData = require(`./${currentEnv}Data/users.json`);

const createSeed = () => {
  return mongoose
    .connect(config.DB_URL)
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
      console.log('Databases seeded');
      mongoose.disconnect();
    })
    .catch({ status: 500, msg: 'Databases not seeded.' });
};

module.exports = createSeed;
