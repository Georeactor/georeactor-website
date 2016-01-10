#! /usr/bin/env node

/* @flow */

var fs = require('fs');
var exec = require('child_process').exec;
var topojson = require('topojson');

if (process.argv.length > 2) {
  var mapConfig = {
    map: "google",
    div: "map",
    data: []
  };

  var filename = process.argv[2];
  if (fs.existsSync(filename)) {
    var fnamer = filename.toLowerCase();
    if (fnamer.indexOf('topojson') > -1 || fnamer.indexOf('topo.json') > -1) {
      console.log('georeactor believes this file is TopoJSON format');
      mapConfig.data.push(filename);
      console.log('making a GeoJSON copy for public API...');
      fs.readFile(filename, { encoding: 'utf-8' }, function (err, tj_source) {
        if (err) {
          throw err;
        }
        var tj = JSON.parse(tj_source);
        var key = Object.keys(tj.objects)[0];
        var gj = topojson.feature(tj, tj.objects[key]);
        fs.writeFile('./mapdata.geojson', JSON.stringify(gj), function (err) {
          if (err) {
            throw err;
          }
          console.log('the GeoJSON version of this file is now saved in this folder as mapdata.geojson');
          saveMapWithConfig(mapConfig);
        });
      });
    } else if (fnamer.indexOf('geojson') > -1 || fnamer.indexOf('geo.json') > -1) {
      console.log('georeactor believes this file is GeoJSON format');
      console.log('converting to smaller TopoJSON format...');
      fs.readFile(filename, { encoding: 'utf-8' }, function (err, gj_source) {
        var gj = JSON.parse(gj_source);
        var tj = topojson.topology({ geo: gj }, {
          'verbose': true,
          'pre-quantization': 1000000,
          'post-quantization': 10000,
          'coordinate-system': 'auto',
          'stitch-poles': true,
          'minimum-area': 0,
          'preserve-attached': true,
          'retain-proportion': 0,
          'force-clockwise': false
        });
        fs.writeFile('./mapdata.topojson', JSON.stringify(tj), function (err) {
          console.log('the TopoJSON version of this file is now saved in this folder as mapdata.topojson');
          mapConfig.data.push('mapdata.topojson');
          saveMapWithConfig(mapConfig);
        });
      });
    } else if (fnamer.indexOf('.shp') > -1) {
      console.log('georeactor believes this file is shapefile format');
      console.log('converting to GeoJSON format...');
      exec('ogr2ogr -f GeoJSON -t_srs crs:84 ./mapdata.geojson ' + filename, function(err) {
        if (err) {
          return console.log('ogr2ogr command failed... you should install gdal');
        }
        console.log('converting to smaller TopoJSON format...');
        exec('topojson ./mapdata.geojson -p -o ./mapdata.topojson', function () {
          console.log('the TopoJSON version of this file is now saved in this folder as mapdata.topojson');
          mapConfig.data.push('mapdata.topojson');
          saveMapWithConfig(mapConfig);
        });
      });
    }
  } else {
    console.log('Filename ' + filename + ' does not exist');
  }
} else {
  console.log('Usage: georeactor FILENAME');
}

function saveMapWithConfig(mapConfig) {
  if (mapConfig.map === 'google') {
    console.log('saving Google Maps API version');
  } else {
    console.log('Must use Google Maps API - other map viewers not yet supported');
  }
}
