const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  belongs_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'articles',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  }
});

module.exports = mongoose.model('comments', CommentSchema);
