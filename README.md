## Northcoders News API

### Background

We will be building the API which to use in the Northcoders News Sprint during the Front End block of the course.

Our database will be MongoDB. Your Mongoose models have been created for you so that you can see what the data should look like.

We have also built a functioning API at http://northcoders-news-api.herokuapp.com/.

Look closely at the response you get for each route on http://northcoders-news-api.herokuapp.com/ You will notice that we also send data such as the comment count for each article. You will need to think carefully about how to do this in your API.

### Mongoose Documentation

The below are all model methods that you call on your models.

* [find](http://mongoosejs.com/docs/api.html#model_Model.find)
* [findOne](http://mongoosejs.com/docs/api.html#model_Model.findOne)
* [findOneAndUpdate](http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate)
* [findOneAndRemove](http://mongoosejs.com/docs/api.html#model_Model.findOneAndRemove)
* [findById](http://mongoosejs.com/docs/api.html#model_Model.findById)
* [findByIdAndUpdate](http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate)
* [findByIdAndRemove](http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove)
* [update](http://mongoosejs.com/docs/api.html#model_Model.update)

There are also some methods that can be called on the documents that get returned. These are:

* [remove](http://mongoosejs.com/docs/api.html#model_Model-remove)
* [save](http://mongoosejs.com/docs/api.html#model_Model-save)
* [count](http://mongoosejs.com/docs/api.html#model_Model.count)

### Step 1 - Seeding

Data has been provided for both testing and development environments so you will need to write a seed function to seed your database. You should think about how you will write your seed file to use either test data or dev data depending on the environment that you're running in.

1.  You will need to seed the topics, followed by the articles and the users. Each article should belong to a topic, referenced by a topic's slug property. Each article should also have comments associated with it. Each comment should have been created by a user (referenced by their \_id property) and should also belong to a specific article (referenced by its \_id property too).

### Step 2 - Building and Testing

1.  Build your Express App
2.  Mount an API Router onto your app
3.  Define the routes described below
4.  Define controller functions for each of your routes
5.  Use proper project configuration from the offset, being sure to treat development and test differently.
6.  Test each route as you go. Remember to test the happy and the unhappy paths! Make sure your error messages are helpful and your error status codes are chosen correctly. Remember to seed the test database using the seeding function and make the saved data available to use within your test suite.
7.  Once you have all your routes start to tackle responding with the vote and comment counts on article requests like this http://northcoders-news-api.herokuapp.com/api/articles

**HINT** Make sure to drop and reseed your test database with every test. This will make it much easier to keep track of your data throughout. In order for this to work, you are going to need to keep track of the MongoIDs your seeded docs have been given. In order to do this, you might want to consider what your seed file returns, and how you can use this in your tests.

### Routes


Your server should have the following end-points:
```http
GET /api
```
Serves an HTML page with documentation for all the available endpoints


```http
GET /api/topics
```

Get all the topics

```http
GET /api/topics/:topic_slug/articles
```

Return all the articles for a certain topic

```http
POST /api/topics/:topic_slug/articles
```

Add a new article to a topic. This route requires a JSON body with title and body key value pairs
e.g: `{ "title": "new article", "body": "This is my new article content"}`

```http
GET /api/articles
```

Returns all the articles

```http
GET /api/articles/:article_id
```

Get an individual article

```http
GET /api/articles/:article_id/comments
```

Get all the comments for a individual article

```http
POST /api/articles/:article_id/comments
```

Add a new comment to an article. This route requires a JSON body with a comment key and value pair
e.g: `{"comment": "This is my new comment"}`

```http
PUT /api/articles/:article_id
```

Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/articles/:article_id?vote=up`

```http
PUT /api/comments/:comment_id
```

Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
e.g: `/api/comments/:comment_id?vote=down`

```http
DELETE /api/comments/:comment_id
```

Deletes a comment

```http
GET /api/users/:username
```

Returns a JSON object with the profile data for the specified user.

### Step 3 - Hosting

Once you are happy with your seed/dev file, prepare your project for production. You will need to seed the development data to mLab, and host the API on Heroku. If you've forgotten how to do this, you may want to look at this tutorial! https://www.sitepoint.com/deploy-rest-api-in-30-mins-mlab-heroku/

### Step 4 - Preparing for your review and portfolio

Finally, you should write a README for this project (and remove this one). The README should be broken down like this: https://gist.github.com/PurpleBooth/109311bb0361f32d87a2

It should also include the link where your herokuapp is hosted.
