/* @flow */

var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  name: String,
  id: String,
  language: String,
  maps: [String],
  notes: Object
});

module.exports = mongoose.model('User', userSchema);
