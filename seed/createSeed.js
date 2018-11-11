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
const { User, Article, Comment, Topic } = require('../models');
const { buildRefObject, formatData } = require('../utils');
const currentEnv = process.env.NODE_ENV;

const articlesData = require(`./${currentEnv}Data/articles.json`);
const commentsData = require(`./${currentEnv}Data/comments.json`);
const topicsData = require(`./${currentEnv}Data/topics.json`);
const usersData = require(`./${currentEnv}Data/users.json`);

const createSeed = () => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([seedDB(Topic, topicsData), seedDB(User, usersData)]);
    })
    .then(([seededTopics, seededUsers]) => {
      const userRefObject = buildRefObject(seededUsers, 'username', '_id');
      const formattedArticles = formatData(
        articlesData,
        buildRefObject(seededTopics, 'slug', 'slug'),
        'topic',
        userRefObject,
        'created_by'
      );
      return Promise.all([
        seedDB(Article, formattedArticles),
        userRefObject,
        seededTopics,
        seededUsers
      ]);
    })
    .then(([seededArticles, userRefObj, seededTopics, seededUsers]) => {
      const articleRefObject = buildRefObject(seededArticles, 'title', '_id');
      const formattedComments = formatData(
        commentsData,
        articleRefObject,
        'belongs_to',
        userRefObj,
        'created_by'
      );
      return Promise.all([
        seededArticles,
        seededTopics,
        seededUsers,
        seedDB(Comment, formattedComments)
      ]);
    })
    .then(([seededArticles, seededTopics, seededUsers, seededComments]) => {
      console.log('Databases seeded');
      return { seededArticles, seededTopics, seededUsers, seededComments };
    })
    .catch({ status: 500, msg: 'Databases not seeded.' });
};

module.exports = createSeed;
