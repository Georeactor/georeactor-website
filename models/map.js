/* @flow */

const mongoose = require('mongoose');

const mapSchema = mongoose.Schema({
  name: String,
  userid: String,
  layers: [String],
  env: String
});

module.exports = mongoose.model('Map', mapSchema);
