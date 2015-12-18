var detailView;

function initReact() {
  var MapDetail = React.createClass({
    getInitialState: function() {
      return { selectFeature: null };
    },

    render: function() {
      if (!this.state.selectFeature) {
        return (
          <p>
            Hello, <input type="text" placeholder="Your name here" />!
          </p>
        );
      } else {
        var properties = [];
        this.state.selectFeature.forEachProperty(function(value, key) {
          properties.push({ key: key, value: value });
        });
        return (
          <p>
            {properties.map(function(chr, i) {
              return <li className="property">
                <label>{chr.key}</label>:
                <span>{chr.value}</span>
              </li>;
            }, this)}
          </p>
        );
      }
    }
  });

  detailView = ReactDOM.render(
    <MapDetail/>,
    document.getElementById('sidebar')
  );
}
