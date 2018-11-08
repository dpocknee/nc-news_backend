process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const createSeed = require('../seed/createSeed');

describe('/api', () => {
  // beforeEach(() => {
  //   return createSeed();
  // });
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
      it('GET status 404 returns message "jam is not a valid topic"', () => {
        return request
          .get('/api/topics/jam/articles')
          .expect(404)
          .then(res => {
            expect(res.message).to.equal('jam is not a valid topic');
          });
      });
    });
  });
});
