/* @flow */

var express = require('express');
var bodyParser = require('body-parser');
var compression = require('compression');

var User = require('./models/user.js');
var Layer = require('./models/layer.js');
var Map = require('./models/map.js');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express['static'](__dirname + '/static'));
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

app.get('/', function (req, res) {
  res.render('map', {
    georeactor: {
      map: 'google',
      div: 'map',
      data: [ 'data/townships.topojson' ]
    }
  });
});

app.listen(process.env.PORT || 8080, function() {
});

module.exports = app;
