## Northcoders News API

### Background

We will be building the API which to use in the Northcoders News Sprint during the Front End block of the course.

Our database will be MongoDB. Your Mongoose models have been created for you so that you can see what the data should look like.

### Mongoose Documentation

The below are some of the model methods that you can call on your models.

* [find](http://mongoosejs.com/docs/api.html#model_Model.find)
* [findOne](http://mongoosejs.com/docs/api.html#model_Model.findOne)
* [findOneAndUpdate](http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate)
* [findOneAndRemove](http://mongoosejs.com/docs/api.html#model_Model.findOneAndRemove)
* [findById](http://mongoosejs.com/docs/api.html#model_Model.findById)
* [findByIdAndUpdate](http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate)
* [findByIdAndRemove](http://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove)
* [update](http://mongoosejs.com/docs/api.html#model_Model.update)
* [create](https://mongoosejs.com/docs/api.html#model_Model.create)
* [remove](http://mongoosejs.com/docs/api.html#model_Model-remove)
* [save](http://mongoosejs.com/docs/api.html#model_Model-save)
* [count](http://mongoosejs.com/docs/api.html#model_Model.count)
* [populate](https://mongoosejs.com/docs/api.html#model_Model.populate)

### Step 1 - Seeding

Data has been provided for both testing and development environments so you will need to write a seed function to seed your database. You should think about how you will write your seed file to use either test data or dev data depending on the environment that you're running in.

1.  You will need to seed the topics and users, followed by the articles and comments. 

* Each article should have:
  * a `belongs_to` property, that references a topic's `slug`, and 
  * a `created_by` property that references a user's mongo `_id`. 
* Each comment should have:
  * a `created_by` property that references a user's mongo `_id` and 
  * a `belongs_to` property that references the specific article's mongo `_id`.

### Step 2 - Building and Testing

1.  Build your Express App
2.  Mount an API Router onto your app
3.  Define the routes described below
4.  Define controller functions for each of your routes (remember to use `.populate` for `created_by` and `belongs_to` fields that are mongo ids! This will be extremely useful when you are working on the front-end!)
5.  You will also need to return a `comment_count` property on all your endpoints that return articles. Attempt it on a single article first, then apply it to your all articles endpoint and finally your post new article. This is a great challenge to help consolidate your understanding of promises. (Note: do __not__ change the models to have a `comment_count` value in the database!)
6.  Use proper project configuration from the offset, being sure to treat development and test differently.
7.  Test each route as you go. Remember to test the happy and the unhappy paths! Make sure your error messages are helpful and your error status codes are chosen correctly. Remember to seed the test database using the seeding function and make the saved data available to use within your test suite.


**HINT** Make sure to drop and reseed your test database with every test. This will make it much easier to keep track of your data throughout. In order for this to work, you are going to need to keep track of the MongoIDs your seeded docs have been given. In order to do this, you might want to consider what your seed file returns, and how you can use this in your tests.

### Routes

Your server should have the following end-points:

```http
GET /api 
# Serves an HTML page with documentation for all the available endpoints
```

```http
GET /api/topics
# Get all the topics
```

```http
GET /api/topics/:topic_slug/articles
# Return all the articles for a certain topic
# e.g: `/api/topics/football/articles`
```

```http
POST /api/topics/:topic_slug/articles
# Add a new article to a topic. This route requires a JSON body with title and body key value pairs
# e.g: `{ "title": "new article", "body": "This is my new article content", "created_by": "user_id goes here"}`
```

```http
GET /api/articles
# Returns all the articles
```

```http
GET /api/articles/:article_id
# Get an individual article
```

```http
GET /api/articles/:article_id/comments
# Get all the comments for a individual article
```

```http
POST /api/articles/:article_id/comments
# Add a new comment to an article. This route requires a JSON body with body and created_by key value pairs
# e.g: `{"body": "This is my new comment", "created_by": "user_id goes here"}`
```

```http
PATCH /api/articles/:article_id
# Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
# e.g: `/api/articles/:article_id?vote=up`
```

```http
PATCH /api/comments/:comment_id
# Increment or Decrement the votes of a comment by one. This route requires a vote query of 'up' or 'down'
# e.g: `/api/comments/:comment_id?vote=down`
```

```http
DELETE /api/comments/:comment_id
# Deletes a comment
```

```http
GET /api/users/:username
# e.g: `/api/users/mitch123`
# Returns a JSON object with the profile data for the specified user.
```

NOTE: When it comes to building your front end you'll find it extremely useful if your POST comment endpoint returns the new comment with the created_by property populated with the corresponding user object.

### Step 3 - Hosting

Once you are happy with your seed/dev file, prepare your project for production. You will need to seed the development data to mLab, and host the API on Heroku. If you've forgotten how to do this, you may want to look at this tutorial! https://www.sitepoint.com/deploy-rest-api-in-30-mins-mlab-heroku/

### Step 4 - Preparing for your review and portfolio

Finally, you should write a README for this project (and remove this one). The README should be broken down like this: https://gist.github.com/PurpleBooth/109311bb0361f32d87a2

It should also include the link where your herokuapp is hosted.
