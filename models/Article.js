const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    required: true,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  belongs_to: {
    type: String,
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});

module.exports = mongoose.model('articles', ArticleSchema);
