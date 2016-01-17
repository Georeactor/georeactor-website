/* @flow */

const mongoose = require('mongoose');

const layerSchema = mongoose.Schema({
  datafiles: [String],
  name: String,
  userid: String,
  tileurls: [String]
});

module.exports = mongoose.model('Layer', layerSchema);
