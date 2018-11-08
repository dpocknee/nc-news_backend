process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const createSeed = require('../seed/createSeed');

describe('/api', () => {
  beforeEach(() => {
    return createSeed();
  });
  it('GET return status 200 a html page of imformation', () => {
    return request
      .get('/api')
      .expect(200)
      .then(res => {
        console.log(res.text.slice(0, 15));
        expect(res.text.slice(0, 15)).to.equal('<!DOCTYPE html>');
      });
  });
});
