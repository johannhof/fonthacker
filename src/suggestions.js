/** @jsx React.DOM */
var React = require('react');

module.exports = React.createClass({
  getInitialState : function () {
    return {suggestions : []};
  },
  update : function (family) {
    var filtered = this.props.fonts.reduce(function (arr, val) {
        if(val.family.indexOf(family) === 0){
          arr.push(val.family);
        }
        return arr;
    },[]);
    if(filtered.length > 0 && filtered.length < 10){
      window.WebFont.load({
        google: {
          families: filtered
        }
      });
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
          return <li>{val}</li>
        })}
        </ul>
        : ''}
      </div>
    );
  }
});
