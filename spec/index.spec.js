process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const createSeed = require('../seed/createSeed');
const mongoose = require('mongoose');
const config = require('../config');
const { Topic, Article, Comment, User } = require('../models/');

describe('/api', () => {
  before(() => {});
  beforeEach(() => {
    return createSeed();
  });
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
          created_by: '5be429573f197521ab42196b'
        };
        return request
          .post('/api/topics/cats/articles')
          .send(testArticle)
          .expect(201)
          .then(res => {
            expect(res.body).to.include(testArticle);
          });
      });
      // it('POST status 404 adds a', () => {

      // });
      // xit('POST status 201 adds a new article to a topic (checks number)', () => {
      //   return mongoose
      //     .connect(config.DB_URL)
      //     .then(() => {
      //       return Article.find();
      //     })
      //     .then(originalDocs => {
      //       return Promise.all([originalDocs, mongoose.disconnect()]);
      //     })
      //     .then(([originalDocs, placeholder]) => {
      //       return Promise.all([
      //         request.post('/api/topics/cats/articles').send({
      //           title: 'new article',
      //           body: 'This is my new article content',
      //           created_by: '5be429573f197521ab42196b'
      //         }),
      //         originalDocs
      //       ]);
      //     })
      //     .then(([res, originalDocs]) => {
      //       return Promise.all([
      //         res,
      //         originalDocs,
      //         mongoose.connect(config.DB_URL)
      //       ]);
      //     })
      //     .then(([res, originalDocs, placeholder]) => {
      //       return Promise.all([res, originalDocs, Article.find()]);
      //     })
      //     .then(([res, oldCount, newCount]) => {
      //       return Promise.all([
      //         res,
      //         oldCount,
      //         newCount,
      //         mongoose.disconnect()
      //       ]);
      //     })
      //     .then(([res, oldCount, newCount, placeholder]) => {
      //       expect(newCount.length).to.equal(oldCount.length + 2);
      //     })
      //     .catch(console.log);
      // });
    });
  });
});
