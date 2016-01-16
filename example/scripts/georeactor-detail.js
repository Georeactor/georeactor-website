/* @flow */
/*global ReactDOM, Array */

var detailView;
var valuesForField = {};
var calledBefore = false;

function initReact() {
  // only run init once
  if (calledBefore) {
    return;
  }
  calledBefore = true;

  var banProperties = ['bounds'];

  var MapLabel = React.createClass({
    render: function() {
      var adjustedLabel = this.props.label;
      var adjustedValue;
      if (typeof detailView.state.selectFeature.getProperty === 'function') {
        adjustedValue = detailView.state.selectFeature.getProperty(this.props.label);
      } else {
        adjustedValue = detailView.state.selectFeature.properties[this.props.label];
      }
      if (typeof adjustedValue === 'object') {
        adjustedValue = JSON.stringify(adjustedValue);
      }
      return (
        <p>
          <label>{adjustedLabel}</label>
          <span>{adjustedValue}</span>
        </p>
      )
    }
  });

  var MapCode = React.createClass({
    getInitialState: function() {
      var added = detailView.state.codeForField;
      added[this.props.label] = this;
      detailView.setState({ codeForField: added });
      return { label: this.props.label, metalabel: '{' + this.props.label + '}' };
    },

    handleLabelChange: function(e) {
      this.setState({ label: e.target.value });
      setTimeout(function() {
        detailView.setState({ x: null });
      }, 200);
    },

    handleValueChange: function(e) {
      this.setState({ metalabel: e.target.value });
      setTimeout(function() {
        detailView.setState({ x: null });
      }, 200);
    },

    render: function() {
      return (<p>
        <input type="text" value={this.state.label} onChange={this.handleLabelChange}/>
        <input type="text" value={this.state.metalabel} onChange={this.handleValueChange}/>
      </p>);
    }
  });

  var MapField = React.createClass({
    getInitialState: function() {
      return { keep: true };
    },

    save: function() {
      this.state.keep = true;
      detailView.setState({ keptProperties: detailView.state.keptProperties.concat([this.props.label]) });
      detailView.render();
      this.next();
    },

    hide: function() {
      this.state.keep = false;
      this.next();
    },

    next: function() {
      detailView.setState({ viewFieldIndex: detailView.state.viewFieldIndex + 1 });
    },

    render: function() {
      var mapWarnings = (<span></span>);
      if (valuesForField[this.props.label].min === valuesForField[this.props.label].max) {
        if (valuesForField[this.props.label].existCount) {
          mapWarnings = (<span>This field is always blank!</span>);
        } else {
          mapWarnings = (<span>This field is always identical!</span>);
        }
      }

      return (
        <li className={this.props.visible ? "field" : "hide"}>
          <MapLabel label={this.props.label}/>
          {mapWarnings}
          <br/>
          <button className="btn btn-success" onClick={this.save}>Include Field</button>
          <button className="btn btn-danger" onClick={this.hide}>Hide Field</button>
        </li>
      );
    }
  });

  var MapDetail = React.createClass({
    getInitialState: function() {
      return { selectFeature: null, viewFieldIndex: 0, keptProperties: [], codeForField: {} };
    },

    render: function() {
      if (!this.state.selectFeature) {
        return (<p>Select an item on the map to start the editor.</p>);
      } else {
        var properties = [];
        if (this.state.selectFeature.forEachProperty) {
          this.state.selectFeature.forEachProperty(function(value, key) {
            if (banProperties.indexOf(key) === -1) {
              properties.push({ label: key, value: value });
            }
          });
        } else {
          for (var key in this.state.selectFeature.properties) {
            if (banProperties.indexOf(key) === -1) {
              var value = this.state.selectFeature.properties[key];
              properties.push({ label: key, value: value });
            }
          }
        }
        return (
          <div className="container">
            <div className="col-sm-4">
              <h4>Review Fields</h4>
              {properties.map(function(chr, i) {
                return <MapField label={chr.label} value={chr.value} visible={this.state.viewFieldIndex === i}/>;
              }, this)}
            </div>
            <div className="col-sm-4">
              <h4>Labels</h4>
              <ul>
                {this.state.keptProperties.map(function(label) {
                  return <MapCode label={label}/>;
                })}
              </ul>
            </div>
            <div className="col-sm-4">
              <h4>Sample Output</h4>
              {Object.keys(this.state.codeForField).map(function(label) {
                var fieldGuide = this.state.codeForField[label];
                var adjustLabel = fieldGuide.state.label;
                var regularValue;
                if (typeof this.state.selectFeature.getProperty === 'function') {
                  regularValue = this.state.selectFeature.getProperty(label);
                } else {
                  regularValue = this.state.selectFeature.properties[label];
                }
                if (typeof regularValue === 'object') {
                  regularValue = JSON.stringify(regularValue);
                }
                var adjustValue = fieldGuide.state.metalabel.replace('{' + label + '}', regularValue);
                return (<p>
                  <label>{adjustLabel}</label>
                  <span>{adjustValue}</span>
                </p>);
              }, this)}
            </div>
          </div>
        );
      }
    }
  });

  detailView = ReactDOM.render(
    <MapDetail/>,
    document.getElementById('sidebar')
  );
}

if (georeactor && georeactor.map === 'leaflet') {
  initMap();
}
