/* @flow */
/*global L, initReact, Array, detailView, topojson, georeactor, valuesForField */

(function() {
  var map;

  initMap = function() {
    map = L.map(georeactor.div)
      .setView([0, 0], 5);

    if (!georeactor.tiles || !georeactor.tiles.length) {
      osm = L.tileLayer('http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; OpenStreetMap contributors',
        maxZoom: 17
      });
      sat = L.tileLayer('http://{s}.tiles.mapbox.com/v3/mapmeld.map-a6ineq7y/{z}/{x}/{y}.png?updated=65f7243', {
        attribution: 'Map data &copy; OpenStreetMap contributors; satellite from MapBox',
        maxZoom: 17
      }).addTo(map);
      L.control.layers({
        "Satellite": sat,
        "OpenStreetMap": osm
      }, {}).addTo(map);
      map.on('baselayerchange', function() {
        /* update default lines */
      });
    } else {
      /* custom tiles */
    }

    fitBounds = function(bounds) {
      map.fitBounds(L.latLngBounds(
        L.latLng(bounds[1], bounds[0]),
        L.latLng(bounds[3], bounds[2])
      ));
    }

    for (var d = 0; d < georeactor.data.length; d++) {
      makeRequestFor(georeactor.data[d], function(gj) {
        dataLayer = L.geoJson(gj, {
          style: function (feature) {
            return {
              fillColor: '#f00',
              fillOpacity: 0,
              color: '#444',
              weight: 1
            }
          },
          onEachFeature: function (feature, layer) {
            layer.on('click', function() {
              fitBounds(feature.properties.bounds);
              detailView.setState({ selectFeature: feature });
              dataLayer.setStyle(function (styler) {
                var fillOpacity = 0;
                if (feature === styler) {
                  fillOpacity = 0.2;
                }
                return {
                  fillColor: '#f00',
                  fillOpacity: fillOpacity,
                  color: '#444',
                  weight: 1
                }
              });
            });
          }
        }).addTo(map);
      });
    }

    initReact();
  };
})();
