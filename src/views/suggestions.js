/** @jsx React.DOM */
var React = require('react');
var loader = require('../loader');

module.exports = React.createClass({

  getInitialState : function () {
    return {suggestions : []};
  },

  update : function (family) {
    var filtered = this.props.fonts.filter(function (val) {
        return val.family.indexOf(family) === 0;
    });

    if(filtered.length > 0 && filtered.length < 10){
      // preload fonts
      loader.load(filtered);
    }

    this.setState({suggestions : filtered});
    this.props.setInputSuggestion(filtered[0]);
  },

  render: function() {
    return (
      <div className="fm-suggestions">
        {this.state.suggestions.length > 1 ?
        <ul>
        {this.state.suggestions.map(function (val) {
          return <li>{val.family}</li>
        })}
        </ul>
        : ''}
      </div>
    );
  }
});
