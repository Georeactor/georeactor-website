$(function() {
  initReact = function() {};
  initMap();

  $("form.box input.file").change(function(e) {
    if (this.files && this.files.length) {
      $("form.box input.btn").attr("disabled", true).val("Converting file...");
      var file = this.files[0];
      var reader = new FileReader();
      var oneCatch = true;
      reader.onload = function(e) {
        var ext;
        if (reader.readyState !== 2 || reader.error) {
          console.log('reader error - not shapefile');
        }
        else {
          var buffer = e.target.result;
          shp(buffer).then(function(geojson){
            console.log('converted shapefile to GeoJSON');
            // might be an array of GeoJSONs
            try {
              if (geojson.length) {
                for (var i = 0; i < geojson.length; i++) {
                  mapJSONfile(geojson[i]);
                  confirmReady(geojson);
                }
              } else {
                mapJSONfile(geojson);
                confirmReady([geojson]);
              }
            } catch(e) {
              console.log(e);
            }
          }).catch(function() {
            if (oneCatch) {
              oneCatch = false;
              reader.onload = function(e) {
                var text = e.target.result;
                try {
                  var jtext = JSON.parse(text);
                  console.log('GeoJSON or TopoJSON');
                  mapJSONfile(jtext);
                  confirmReady([jtext]);
                } catch (e) {
                  try {
                    var fromkml = toGeoJSON.kml($.parseXML(text));
                    mapJSONfile(fromkml);
                    confirmReady([fromkml]);
                  } catch (e) {
                    console.log('dunno format');
                  }
                }
              };
              reader.readAsText(file);
            }
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  });

  function confirmReady(gjarray) {
    if (dataLayer && dataLayer.getBounds) {
      // Leaflet version
      var b = dataLayer.getBounds();
      var xmin = b.getSouthWest().lng;
      var ymin = b.getSouthWest().lat;
      var xmax = b.getNorthEast().lng;
      var ymax = b.getNorthEast().lat;
      fitBounds([xmin, ymin, xmax, ymax]);
    }
    $("form.box input.file").remove();
    $("form.box").append(
      $("<textarea name='geojson'></textarea>")
        .val(JSON.stringify(gjarray))
        .hide()
    ); //.attr("action", "/uploadgeo");
    $("form.box input.btn").attr("disabled", false).val("Upload this map");
  }
});
