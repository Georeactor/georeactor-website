var detailView;
var valuesForField = {};
var calledBefore = false;

function initReact() {
  // only run init once
  if (calledBefore) {
    return;
  }
  calledBefore = true;

  // don't display internal attributes
  var banProperties = ['bounds'];

  // simple Label: Value display
  var MapLabel = React.createClass({
    render: function() {
      var adjustedLabel = this.props.label;
      var adjustedValue;
      if (this.props.value) {
        adjustedValue = this.props.value;
      }
      else if (typeof detailView.state.selectFeature.getProperty === 'function') {
        adjustedValue = detailView.state.selectFeature.getProperty(this.props.label);
      } else {
        adjustedValue = detailView.state.selectFeature.properties[this.props.label];
      }
      if (typeof adjustedValue === 'object') {
        adjustedValue = JSON.stringify(adjustedValue);
      }
      return (
        <p className="field">
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
      return { label: this.props.label, metalabel: '{' + this.props.label + '}', title: null };
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

    handleIDChange: function(e) {

    },

    handleTitleChange: function(e) {
      detailView.setState({ title: this.props.label });
    },

    render: function() {
      var isTitle = (detailView.state.title === this.props.label);
      return (<div>
        <p>
          <input type="text" className={isTitle ? 'unused' : ''} value={this.state.label} onChange={this.handleLabelChange} disabled={isTitle}/>
          <input type="text" value={this.state.metalabel} onChange={this.handleValueChange}/>
        </p>
        <p>
          <input type="radio" name="unique" value={this.props.label} onChange={this.handleIDChange}/> Unique ID?
          <input type="radio" name="title" value={this.props.label} onChange={this.handleTitleChange}/> Title Field?
        </p>
      </div>);
    }
  });

  var MapField = React.createClass({
    getInitialState: function() {
      return { keep: true };
    },

    save: function() {
      this.setState({ keep: true });
      detailView.setState({ keptProperties: detailView.state.keptProperties.concat([this.props.label]) });
    },

    hide: function() {
      this.setState({ keep: false });
      var modKeptProperties = detailView.state.keptProperties;
      var modCodeForField = detailView.state.codeForField;
      if (modKeptProperties.indexOf(this.props.label) > -1) {
        modKeptProperties.splice(modKeptProperties.indexOf(this.props.label), 1);
      }
      if (modCodeForField[this.props.label]) {
        modCodeForField[this.props.label] = null;
      }
      detailView.setState({  keptProperties: modKeptProperties, codeForField: modCodeForField });
    },

    next: function() {
      detailView.setState({ viewFieldIndex: detailView.state.viewFieldIndex + 1 });
    },

    render: function() {
      var mapWarnings = <span></span>;
      var minMax = <span></span>;
      if (valuesForField[this.props.label].min === valuesForField[this.props.label].max) {
        if (valuesForField[this.props.label].existCount) {
          mapWarnings = (<span>This field is always blank!</span>);
        } else {
          mapWarnings = (<span>This field is always identical!</span>);
        }
      } else {
        minMax = (<p>
          <label>Min</label>
          <span>{valuesForField[this.props.label].min}</span>
          <label>Max</label>
          <span>{valuesForField[this.props.label].max}</span>
        </p>);
      }

      return (
        <li className={this.props.visible ? "field" : "hide"}>
          <div className="pull-left">
            <MapLabel label={this.props.label}/>
            {mapWarnings}
            {minMax}
          </div>
          <div className="pull-right">
            <button className="btn btn-success" onClick={this.save}>Include</button>
            <button className="btn btn-danger" onClick={this.hide}>Hide</button>
          </div>
          <div className="clearfix"></div>
          <button className="btn btn-info" onClick={this.next}>Next Field</button>
        </li>
      );
    }
  });

  var MapDetail = React.createClass({
    getInitialState: function() {
      return { selectFeature: null, viewFieldIndex: 0, keptProperties: [], codeForField: {} };
    },

    viewField: function(e) {
      this.setState({ viewFieldIndex: e.target.value * 1 });
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
        var titleLabel = <h1></h1>;
        if (this.state.title) {
          var fieldGuide = this.state.codeForField[this.state.title];
          var regularValue;
          if (typeof this.state.selectFeature.getProperty === 'function') {
            regularValue = this.state.selectFeature.getProperty(this.state.title);
          } else {
            regularValue = this.state.selectFeature.properties[this.state.title];
          }
          titleLabel = <h1>{fieldGuide.state.metalabel.replace('{' + this.state.title + '}', regularValue)}</h1>;
        }
        return (
          <div className="container">
            <div className="col-sm-4">
              <h4>Include Data</h4>
              <select value={this.state.viewFieldIndex} onChange={this.viewField}>
                {properties.map(function(chr, i) {
                  return <option value={i}>{chr.label}</option>
                }, this)}
              </select>
              <br/>
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
              {titleLabel}
              {Object.keys(this.state.codeForField).map(function(label) {
                var fieldGuide = this.state.codeForField[label];
                if (fieldGuide === null) {
                  return;
                }
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
                if (this.state.title !== label) {
                  return <MapLabel label={adjustLabel} value={adjustValue}/>;
                }
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
