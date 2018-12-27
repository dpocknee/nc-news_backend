# Northcoders News

This is the backend of a full stack reddit-style message board written in React, completed as part of the intensive full time Developer Pathway software development course at [Northcoders](http://www.northcoders.com) in Manchester between October and December 2018.

- The deployed version of the site can be found here: [http://confident-gates-cb16d1.netlify.com](http://confident-gates-cb16d1.netlify.com).
- The deployed API for the backend can be found here: [https://frozen-river-28585.herokuapp.com/api](https://frozen-river-28585.herokuapp.com/api)
- The github repo for the frontend API can be found here: [https://github.com/dpocknee/nc-news_frontend](https://github.com/dpocknee/nc-news_frontend)

The backend consists of a RESTful API which allows access to a Mongo database hosted on mLab.

The frontend serves this data in a dynamic React application.

Users can vote on articles and comments, and logged-in users can add or delete comments or articles.

## Installing

1. Fork and clone down this .git repository.
2. For testing and development you will need to add a config.js file into the root folder. This file should look like this:

```
const config = {
  dev: {
    DB_URL: 'mongodb://localhost:27017/dev_nc_news'
  },
  test: {
    DB_URL: 'mongodb://localhost:27017/test_nc_news'
  }
};

module.exports = config;
```

3. Run `npm install` to install any dependencies.

## Prerequisites

- node
- mongoDB

## Getting Started: Using the API locally

1. First, make sure that you have mongoDB installed and that `mongod` is running.

2. Seed the database with data. If you are wanting to run the API in `dev` mode, use the command `npm run seed:dev`.

3. Navigate to the folder and run `npm start`, this will start up a local server on port 9090.

4. Open a browser of your choice and navigate to `localhost:9090/api`. This will give you a list of possible API endpoints, all of which you can navigate to.

## Running the tests

All tests are run using `mocha`, `chai` and `supertest`.
The tests check all API endpoints and automatically reseed the test database before each test is run.
All tests can be run using `npm test`.
If you want to reseed the test database manually, you can use the command `npm run seed:test`

## Built With

- node.js

## Authors

- **David Pocknee** - [dpocknee](https://github.com/dpocknee)

## Acknowledgments

- Northcoders
