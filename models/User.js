const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    lowercase: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('users', UserSchema);
