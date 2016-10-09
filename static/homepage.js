var txt = document.getElementById('code');
txt.value = "<html>\n\
  <body>\n\
    <div id='map'></div>\n\
    ...\n\
    <script src='react.min.js'></script>\n\
    <script src='georeactor-client-gmaps.js'></script>\n\
    <script>\n\
      georeactor({\n\
        div: 'map',\n\
        data: ['data/link.geojson']\n\
        attributes: {\n\
          Zone_No: {\n\
            label: 'Zone Number',\n\
            value: function(key, val, feature) {\n\
              ...\n\
            }\n\
          }\n\
        }\n\
      })\n\
    </script>\n\
  </body>\n\
</html>";

var mixedMode = {
  name: "htmlmixed"
};

var editor = CodeMirror.fromTextArea(txt, {
  lineNumbers: true,
  mode: mixedMode,
  lineWrapping: true,
  firstLineNumber: 0,
  viewportMargin: Infinity
});
