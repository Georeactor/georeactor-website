/* @flow */

var mongoose = require('mongoose');

var mapSchema = mongoose.Schema({
  name: String,
  userid: String,
  layers: [String]
});

module.exports = mongoose.model('Map', mapSchema);
