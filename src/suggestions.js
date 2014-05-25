/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
  getInitialState : function () {
    return {suggestions : []};
  },
  update : function (family) {
    var filtered = this.props.fonts.reduce(function (arr, val) {
        if(val.family.indexOf(family) === 0){
          arr.names.push(val.family);
          arr.load.push(
            val.family + ":" + (val.variants ? val.variants.join(',') : ''));
        }
        return arr;
    }, {
      names : [],
      load : []
    });
    if(filtered.names.length > 0 && filtered.names.length < 10){
      window.WebFont.load({
        google: {
          families: filtered.load
        }
      });
    }
    this.setState({suggestions : filtered.names});
    this.props.setInputSuggestion(filtered.names[0]);
  },
  render: function() {
    return (
      <div className="fm-suggestions">
        {this.state.suggestions.length > 1 ?
        <ul>
        {this.state.suggestions.map(function (val) {
          return <li>{val}</li>
        })}
        </ul>
        : ''}
      </div>
    );
  }
});
