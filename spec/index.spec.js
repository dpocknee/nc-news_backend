/* eslint no-undef: 0, import/order: 0 */
const { expect } = require('chai');
const mongoose = require('mongoose');
const app = require('../app');
const request = require('supertest')(app);
const createSeed = require('../seed/createSeed');
const config = require('../config');

let allInfo;
process.env.NODE_ENV = 'test';
process.env.DB_URL = config.test.DB_URL;

describe('/api', () => {
  beforeEach(() => createSeed('test')
    .then(seedInfo => {
      allInfo = seedInfo;
      return seedInfo;
    })
    .catch(err => console.log('Main beforeEach error: ', err)));

  after(() => mongoose.disconnect());

  describe('/api', () => {
    it('GET return status 200 a html page of imformation', () => request
      .get('/api')
      .expect(200)
      .then(res => {
        expect(res.text.slice(0, 15)).to.equal('<!DOCTYPE html>');
      }));
    it('GET return status 404 error page not found', () => request.get('/wrong').expect(404));
    // -----------------TOPICS ----------------------------
    describe('/topics', () => {
      it('GET status 200 returns an array of all topics - checks number', () => request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.equal(2);
        }));
      it('GET status 200 returns an array of all topics - checks content', () => request
        .get('/api/topics')
        .expect(200)
        .then(res => {
          expect(res.body[0].title).to.equal('Mitch');
          expect(res.body[0].slug).to.equal('mitch');
        }));
      describe('/api/topics/:topic_slug/articles', () => {
        it('GET status 200 returns an array of articles related to a particular topic slug (checks number and content)', () => request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(res => {
            expect(res.body.length).to.equal(2);
          }));
        it('GET status 200 returns an array of articles related to a particular topic slug (checks content)', () => request
          .get('/api/topics/cats/articles')
          .expect(200)
          .then(res => {
            expect(res.body[0].title).to.equal("They're not exactly dogs, are they?");
            expect(res.body[0].body).to.equal('Well? Think about it.');
          }));
        it('GET status 404 returns message "x is not a valid topic"', () => request
          .get('/api/topics/jam/articles')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('jam is not a valid topic!');
          }));
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
              expect(res.body.title).to.equal(testArticle.title);
              expect(res.body.body).to.equal(testArticle.body);
              expect(res.body.created_by._id).to.equal(testArticle.created_by);
            })
            .catch(err => console.log('ERROR from test: ', err));
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
              expect(res.body.message).to.equal('fearOfDeath is not a valid topic!');
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
              expect(res.body.message).to.equal('5be429573f197771ab42196b is not a valid user!');
            });
        });
      });
    });
    describe('/articles', () => {
      it('GET status 200 returns an array of all articles - checks number', () => request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.equal(4);
        }));
      it('GET status 200 returns an array of all articles - checks content', () => request
        .get('/api/articles')
        .expect(200)
        .then(res => {
          expect(res.body[0].title).to.equal('Living in the shadow of a great man');
          expect(res.body[0].body).to.equal('I find this existence challenging');
        }));

      describe('/:article_id', () => {
        it('GET status 200 returns an article by ID - checks content', () => {
          const articleId = allInfo.seededArticles[0]._id;
          return request
            .get(`/api/articles/${articleId}`)
            .expect(200)
            .then(res => {
              expect(res.body[0].title).to.equal('Living in the shadow of a great man');
              expect(res.body[0].body).to.equal('I find this existence challenging');
              expect(res.body.length).to.equal(1);
            });
        });
        it('GET status 404 returns "article id x does not exist"', () => request
          .get('/api/articles/5be429573f197771ab42196b')
          .expect(404)
          .then(res => {
            expect(res.body.message).to.equal('5be429573f197771ab42196b is not a valid article!');
          }));
        describe('/comments', () => {
          it('GET status 200 returns array of comments for article', () => {
            const articleId = allInfo.seededArticles[0]._id;
            return request
              .get(`/api/articles/${articleId}/comments`)
              .expect(200)
              .then(res => {
                expect(res.body[0].body).to.equal(
                  'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — on you it works.'
                );
                expect(res.body.length).to.equal(2);
              });
          });
          it('GET status 404 returns "article id x does not exist"', () => request
            .get('/api/articles/5be429573f197771ab42196b/comments')
            .expect(404)
            .then(res => {
              expect(res.body.message).to.equal(
                '5be429573f197771ab42196b is not a valid article!'
              );
            }));
          it('POST return 201 adds a new comment to an article', () => {
            const articleId = allInfo.seededArticles[0]._id;
            const userId = allInfo.seededUsers[0]._id;
            const testComment = {
              body: 'This is my new comment',
              created_by: userId
            };
            return request
              .post(`/api/articles/${articleId}/comments`)
              .send(testComment)
              .expect(201)
              .then(res => {
                expect(res.body.body).to.equal(testComment.body);
                expect(res.body.created_by._id).to.equal(String(testComment.created_by));
              });
          });
          it('POST status 404 returns "article id x does not exist"', () => request
            .get('/api/articles/5be429573f197771ab42196b/comments')
            .expect(404)
            .then(res => {
              expect(res.body.message).to.equal(
                '5be429573f197771ab42196b is not a valid article!'
              );
            }));

          it('POST status 400 return error about missing body ', () => {
            const articleId = allInfo.seededArticles[0]._id;
            const userId = allInfo.seededUsers[0]._id;
            const testComment = {
              created_by: userId
            };
            return request
              .post(`/api/articles/${articleId}/comments`)
              .send(testComment)
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('Request did not include a "body" value.');
              });
          });
          it('POST status 400 return error about missing created_by ', () => {
            const articleId = allInfo.seededArticles[0]._id;
            const testComment = {
              body: 'This is my new comment'
            };
            return request
              .post(`/api/articles/${articleId}/comments`)
              .send(testComment)
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('undefined is not a valid user!');
              });
          });
          it('POST status 400 return error about invalid User ID ', () => {
            const articleId = allInfo.seededArticles[0]._id;
            const testComment = {
              body: 'This is my new comment',
              created_by: '5be429573f197771ab42196b'
            };
            return request
              .post(`/api/articles/${articleId}/comments`)
              .send(testComment)
              .expect(400)
              .then(res => {
                expect(res.body.message).to.equal('5be429573f197771ab42196b is not a valid user!');
              });
          });
        });
      });
    });
    describe('more articles/:article_id', () => {
      it('PATCH status 201 returns updated votes (increase)', () => {
        const articleId = allInfo.seededArticles[0]._id;
        return request
          .patch(`/api/articles/${articleId}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body).to.include({ votes: 1 });
          });
      });
      it('PATCH status 201 returns updated votes (decrease)', () => {
        const articleId = allInfo.seededArticles[0]._id;
        return request
          .patch(`/api/articles/${articleId}?vote=down`)
          .expect(201)
          .then(res => {
            expect(res.body).to.include({ votes: -1 });
          });
      });
      it('PATCH status 404 returns "article id x does not exist"', () => request
        .patch('/api/articles/5be429573f197771ab42196b?vote=up')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('5be429573f197771ab42196b is not a valid article!');
        }));
      it('PATCH status 400 return "errors for invalid queries"', () => {
        const articleId = allInfo.seededArticles[0]._id;
        return request
          .patch(`/api/articles/${articleId}?baloon=down`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('Not a valid query.');
          });
      });
      it('PATCH status 400 return "errors for invalid queries"', () => {
        const articleId = allInfo.seededArticles[0]._id;
        return request
          .patch(`/api/articles/${articleId}?vote=balloon`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('Not a valid query key.');
          });
      });
    });
    describe('/comments', () => {
      it('PATCH status 201 return updated comment votes (increase).', () => {
        const commentId = allInfo.seededComments[0]._id;
        return request
          .patch(`/api/comments/${commentId}?vote=up`)
          .expect(201)
          .then(res => {
            expect(res.body).to.include({ votes: 8 });
          });
      });
      it('PATCH status 201 return updated comment votes (decrease).', () => {
        const commentId = allInfo.seededComments[0]._id;
        return request
          .patch(`/api/comments/${commentId}?vote=down`)
          .expect(201)
          .then(res => {
            expect(res.body).to.include({ votes: 6 });
          });
      });
      it('PATCH status 404 returns "comment id x does not exist"', () => request
        .patch('/api/comments/5be429573f197771ab42196b?vote=up')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('5be429573f197771ab42196b is not a valid comment!');
        }));
      it('PATCH status 400 return "errors for invalid queries"', () => {
        const commentId = allInfo.seededComments[0]._id;
        return request
          .patch(`/api/comments/${commentId}?baloon=down`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('Not a valid query.');
          });
      });
      it('PATCH status 400 return "errors for invalid queries"', () => {
        const commentId = allInfo.seededComments[0]._id;
        return request
          .patch(`/api/comments/${commentId}?vote=balloon`)
          .expect(400)
          .then(res => {
            expect(res.body.message).to.equal('Not a valid query key.');
          });
      });
      it('DELETE status 202 returns deleted comment', () => {
        const commentId = allInfo.seededComments[0]._id;
        return request
          .delete(`/api/comments/${commentId}`)
          .expect(202)
          .then(res => {
            expect(res.body).to.include({
              _id: String(commentId)
            });
          });
      });
      it('DELETE status 404 returns "comment id x does not exist"', () => request
        .delete('/api/comments/5be429573f197771ab42196b')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('5be429573f197771ab42196b is not a valid comment!');
        }));
    });
    describe('/users/username', () => {
      it('GET status 200 return user by username', () => {
        const userId = allInfo.seededUsers[0].username;
        return request
          .get(`/api/users/${userId}`)
          .expect(200)
          .then(res => {
            expect(res.body).to.include({
              username: userId,
              name: 'jonny'
            });
          });
      });
      it('GET status 404 return user x does not exist ', () => request
        .get('/api/users/5be429573f197771ab42196b')
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('5be429573f197771ab42196b is not a valid user!');
        }));
    });
    describe('/api/users/:username/articles', () => {
      it('GET status 200 returns an array of articles by a user', () => request
        .get('/api/users/dedekind561/articles')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.equal(2);
        }));
    });
    describe('/api/users/:username/comments', () => {
      it('GET status 200 returns an array of comments by a user', () => request
        .get('/api/users/dedekind561/comments')
        .expect(200)
        .then(res => {
          expect(res.body.length).to.equal(4);
        }));
    });
  });
});
