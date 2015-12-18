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
        return (
          <p>
            Got it: {this.state.selectFeature.getProperty('Myanmar3')}
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
