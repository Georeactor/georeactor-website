/* @flow */
/*global ReactDOM, Array */

var detailView;
var valuesForProperty = {};

function initReact() {
  var MapProperty = React.createClass({
    render: function() {
      if (valuesForProperty[this.props.label].existCount) {
        if (valuesForProperty[this.props.label].min === valuesForProperty[this.props.label].max) {
          return (
            <li className="property">
              <label>{this.props.label}</label>:
              <span>{this.props.value}</span>
              <span>This value is always identical! <button>Hide</button></span>
            </li>
          );
        } else {
          return (
            <li className="property">
              <label>{this.props.label}</label>:
              <span>{this.props.value}</span>
            </li>
          );
        }
      } else {
        return (
          <li className="property">
            <label>{this.props.label}</label>:
            <span>{this.props.value}</span>
            <span>This value is always blank! <button>Hide</button></span>
          </li>
        );
      }
    }
  });

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
        if (this.state.selectFeature.forEachProperty) {
          this.state.selectFeature.forEachProperty(function(value, key) {
            properties.push({ label: key, value: value });
          });
        } else {
          properties.push({ label: 'status', value: 'offline' });
          valuesForProperty['status'] = {
            min: 'offline',
            max: 'online',
            existCount: 0
          };
        }
        return (
          <p>
            {properties.map(function(chr, i) {
              return <MapProperty label={chr.label} value={chr.value}/>;
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
