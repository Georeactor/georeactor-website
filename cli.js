#! /usr/bin/env node

var fs = require('fs');
var exec = require('child_process').exec;

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
      saveMapWithConfig(mapConfig);
    } else if (fnamer.indexOf('geojson') > -1 || fnamer.indexOf('geo.json') > -1) {
      console.log('georeactor believes this file is GeoJSON format');
      console.log('converting to smaller TopoJSON format...');
      exec('topojson ' + filename + ' -p -o ./mapdata.topojson', function () {
        console.log('the TopoJSON version of this file is now saved in this folder as mapdata.topojson');
        mapConfig.data.push('mapdata.topojson');
        saveMapWithConfig(mapConfig);
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

  } else {
    console.log('Must use Google Maps API - other map viewers not yet supported');
  }
}
