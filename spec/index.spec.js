process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const createSeed = require('../seed/createSeed');
const mongoose = require('mongoose');
const config = require('../config');
const { Topic, Article, Comment, User } = require('../models/');
const { getArrayOfValidElements } = require('../utils');
let allInfo;

describe('/api', () => {
  beforeEach(() => {
    return mongoose
      .connect(config.DB_URL)
      .then(() => {
        return createSeed();
      })
      .then(seedInfo => {
        allInfo = seedInfo;
      })
      .then(() => mongoose.disconnect());
  });
  after(() => {
    // return mongoose.disconnect();
  });
  // -----------------TOPICS ----------------------------
  it('GET return status 200 a html page of imformation', () => {
    return request
      .get('/api')
      .expect(200)
      .then(res => {
        expect(res.text.slice(0, 15)).to.equal('<!DOCTYPE html>');
      });
  });
  it('GET return status 404 error page not found', () => {
    return request.get('/wrong').expect(404);
  });
  describe('/topics', () => {
    it('GET status 200 returns an array of all topics - checks number', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.equal(2);
        });
    });
    it('GET status 200 returns an array of all topics - checks content', () => {
      return request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body[0].title).to.equal('Mitch');
          expect(res.body[0].slug).to.equal('mitch');
        });
    });
    describe('/api/topics/:topic_slug/articles', () => {
      it('GET status 200 returns an array of articles related to a particular topic slug (checks number and content)', () => {
        return request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(res => {
            expect(res.body.length).to.equal(2);
          });
      });
      it('GET status 200 returns an array of articles related to a particular topic slug (checks content)', () => {
        return request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(res => {
            expect(res.body[0].title).to.equal(
              "They're not exactly dogs, are they?"
            );
            expect(res.body[0].body).to.equal('Well? Think about it.');
          });
      });
      it('GET status 404 returns message "x is not a valid topic"', () => {
        return request
          .get('/api/topics/jam/articles')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('jam is not a valid topic!');
          });
      });
      it('POST status 201 adds a new article to a topic (checks content)', () => {
        const testArticle = {
          title: 'new article',
          body: 'This is my new article content',
          created_by: String(allInfo.seededUsers[0]._id)
        };
        return request
          .post('/api/topics/cats/articles')
          .send(testArticle)
          .expect(201)
          .then(res => {
            expect(res.body).to.include(testArticle);
          })
          .catch(console.log);
      });
      it('POST status 404 returns message "x is not a valid topic"', () => {
        const testArticle = {
          title: 'new article',
          body: 'This is my new article content',
          created_by: mongoose.Types.ObjectId('5be429573f197521ab42196b')
        };
        return request
          .post('/api/topics/fearOfDeath/articles')
          .send(testArticle)
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal(
              'fearOfDeath is not a valid topic!'
            );
          });
      });
      it('POST status 404 returns message x is not a valid user', () => {
        const testArticle = {
          title: 'new article',
          body: 'This is my new article content',
          created_by: '5be429573f197771ab42196b'
        };
        return request
          .post('/api/topics/cats/articles')
          .send(testArticle)
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal(
              '5be429573f197771ab42196b is not a valid user!'
            );
          });
      });
    });
  });
  describe('/articles', () => {
    it('GET status 200 returns an array of all articles - checks number', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.equal(4);
        });
    });
    it('GET status 200 returns an array of all articles - checks content', () => {
      return request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body[0].title).to.equal(
            'Living in the shadow of a great man'
          );
          expect(res.body[0].body).to.equal(
            'I find this existence challenging'
          );
        });
    });
    //--------------
    it('GET status 200 returns an an article by ID - checks content', () => {
      const articleId = allInfo.seededArticles[0]._id;
      return request
        .get(`/api/articles/${articleId}`)
        .expect(200)
        .then(res => {
          expect(res.body[0].title).to.equal(
            'Living in the shadow of a great man'
          );
          expect(res.body[0].body).to.equal(
            'I find this existence challenging'
          );
          expect(res.body.length).to.equal(1);
        });
    });
  });
});
