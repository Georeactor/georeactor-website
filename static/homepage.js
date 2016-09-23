var txt = document.getElementById('code');
txt.value = "<html>\n\
  <body>\n\
    <div id='map'></div>\n\
    ...\n\
    <script src='react.js'></script>\n\
    <script src='georeactor-google.js'></script>\n\
    <script src='georeactor-client.js'></script>\n\
    <script>\n\
      georeactor({\n\
        div: 'map',\n\
        data: ['data/link.geojson']\n\
      })\n\
    </script>\n\
  </body>\n\
</html>\n";

var mixedMode = {
  name: "htmlmixed"
};

var editor = CodeMirror.fromTextArea(txt, {
  lineNumbers: true,
  mode: mixedMode
});
