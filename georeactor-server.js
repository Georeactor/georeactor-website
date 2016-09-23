/* @flow */

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
const mongoose = require('mongoose');
const csrf = require('csurf');

const AWS = require('aws-sdk');
AWS.config.secretAccessKey = process.env.AWS_SECRET_KEY;
AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY;
const S3_BUCKET = 'georeactor';
const s3 = new AWS.S3();

const User = require('./models/user.js');
const Layer = require('./models/layer.js');
const Map = require('./models/map.js');

mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express['static'](__dirname + '/example'));
app.use(express['static'](__dirname + '/static'));
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  secret: process.env.SESSION || 'fj23f90jfoijfl2mfp293i019eoijdoiqwj129',
  resave: false,
  saveUninitialized: false
}));

var csrfProtection = csrf({ cookie: true });

app.get('/', csrfProtection, function (req, res) {
  res.render('home');
});

app.get('/talks', csrfProtection, function (req, res) {
  res.render('talk');
});

app.get('/upload', csrfProtection, function (req, res) {
  res.render('upload');
});

app.post('/upload', csrfProtection, function (req, res) {
  var tstamp = '' + Date.now();
  var params = { Bucket: process.env.S3_BUCKET, Key: tstamp, Body: req.body.geojson };
  s3.putObject(params, function(err, data) {
    if (err) {
      res.json(err);
    } else {
      var m = new Map();
      m.name = req.body.name || 'Unnamed Map';
      m.userid = (req.user || {id: 0}).id;
      m.datafiles = [
        'https://s3-ap-southeast-1.amazonaws.com/' + process.env.S3 + '/' + tstamp
      ];
      m.save(function (err) {
        if (err) {
          throw err;
        }
        res.redirect('/view/' + m._id);
      });
    }
  });
});

app.get('/g', csrfProtection, function (req, res) {
  res.render('map', {
    georeactor: {
      map: 'google',
      div: 'map',
      data: [ 'data/townships.topojson' ]
    }
  });
});

app.get('/m', csrfProtection, function (req, res) {
  res.render('leaf', {
    georeactor: {
      map: 'leaflet',
      div: 'map',
      data: [ 'data/townships.topojson' ]
    }
  });
});

app.listen(process.env.PORT || 8080, function() {
});

module.exports = app;
