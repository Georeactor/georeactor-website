var initMap;

(function() {
  var map;

  initMap = function() {
    map = new google.maps.Map(document.getElementById(georeactor.div), {
      zoom: 5,
      center: {lat: 0, lng: 0},
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });

    // XMLHttpRequest without jQuery
    var request = new XMLHttpRequest();
    request.open('GET', 'data/townships.topojson', true);

    request.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 400) {
          var tj = JSON.parse(this.responseText);
          var key = Object.keys(tj.objects)[0];
          var gj = topojson.feature(tj, tj.objects[key]);

          var bounds = null;
          for (var f = 0; f < gj.features.length; f++) {
            bounds = makeBounds(gj.features[f].geometry.coordinates, bounds);
          }
          map.fitBounds(new google.maps.LatLngBounds(
            new google.maps.LatLng(bounds[1], bounds[0]),
            new google.maps.LatLng(bounds[3], bounds[2])
          ));

          map.data.addGeoJson(gj);
          map.data.setStyle(function (feature) {
            return {
              fillColor: '#f00',
              strokeColor: '#444',
              strokeWeight: 1
            }
          });
        } else {
          console.log('failed to do XMLHttpRequest');
        }
      }
    };
    request.send();
  };

  function makeBounds(coordinates, existing) {
    if (!existing) {
      existing = [180, 90, -180, -90];
    }
    if (typeof coordinates[0] === 'number') {
      existing[0] = Math.min(existing[0], coordinates[0]);
      existing[1] = Math.min(existing[1], coordinates[1]);
      existing[2] = Math.max(existing[2], coordinates[0]);
      existing[3] = Math.max(existing[3], coordinates[1]);
    } else {
      for (var c = 0; c < coordinates.length; c++) {
        existing = makeBounds(coordinates[c], existing);
      }
    }
    return existing;
  }
})();

// forEach and map support for IE<=8 needed for TopoJSON library
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(fn,scope){
    var i, len;
    for (i = 0, len = this.length; i < len; ++i) {
      if(i in this){
        fn.call(scope, this[i], i, this);
      }
    }
  };
}
if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
}
