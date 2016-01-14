/* @flow */
/*global ReactDOM, Array */

var detailView;
var valuesForField = {};

function initReact() {
  var banProperties = ['bounds'];

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
          <label>{this.props.label}</label>:
          <span>{this.props.value}</span>
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
      return { selectFeature: null, viewFieldIndex: 0, keptProperties: [] };
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
          console.log('forEachProperty unavailable');
        }
        return (
          <div className="container">
            <div className="col-sm-4">
              {properties.map(function(chr, i) {
                return <MapField label={chr.label} value={chr.value} visible={this.state.viewFieldIndex === i}/>;
              }, this)}
            </div>
            <div className="col-sm-4">
              <h4>Included Fields</h4>
              <ul>
                {this.state.keptProperties.map(function(label) {
                  return <li>{label}</li>;
                })}
              </ul>
            </div>
            <div className="col-sm-4">
              <h4>React Output</h4>
              <textarea></textarea>
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
