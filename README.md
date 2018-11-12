# Northcoders News

This is an API to serve Northcoders-related news from a Mongo database. A working version can be found at: [https://frozen-river-28585.herokuapp.com/api](https://frozen-river-28585.herokuapp.com/api).

## Getting Started

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

### Prerequisites

You will need node.js as well as a server to host all of the javascript files, as well as somewhere to host the Mongo database (I used heroku and mLab).

### Installing

A development environment can be set up by first seeding the dev database

```
npm run seed:dev
```

Seeding can be done using `npm run seed:dev` or `npm run seed:test`, depending upon whether you want to seed the test or dev database.

## Running the tests

All tests are run using `mocha, chai and supertest`.
Tests can be run using `npm test`.

### Break down into end to end tests

The tests check all api endpoints.

## Built With

- node.js

## Authors

- **David Pocknee** - [dpocknee](https://github.com/dpocknee)

## License

Anti-copyright

## Acknowledgments

- Northcoders
