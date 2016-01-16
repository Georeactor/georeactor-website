/* @flow */

var express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compression = require('compression');
var mongoose = require('mongoose');
var csrf = require('csurf');

var User = require('./models/user.js');
var Layer = require('./models/layer.js');
var Map = require('./models/map.js');

mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'localhost');

var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express['static'](__dirname + '/example'));
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

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/m', function (req, res) {
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
