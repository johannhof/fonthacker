/** @jsx React.DOM */
var React = require('react');
var loader = require('../loader');

var MAX_ITEMS = 17;

module.exports = React.createClass({

  getInitialState : function () {
    return {suggestions : [], selected: -1};
  },

  update : function (family) {
    var filtered = this.props.fonts.filter(function (val) {
        return val.family.indexOf(family) === 0;
    });

    if(filtered.length > 0 && filtered.length < 10){
      // preload fonts
      loader.load(filtered);
    }

    this.setState({suggestions : filtered, selected: -1});
    this.props.setInputSuggestion(filtered[0]);
  },

  handleKeyDown: function(e) {
    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      var val = ~this.state.selected ? this.state.selected : 0;
      var font = this.state.suggestions[val];
      if(font){
        this.props.setInput(font)
      }
      e.stopPropagation();
      e.preventDefault();
      this.props.hideSuggestions();
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      this.props.hideSuggestions();
    } else if (e.key === 'ArrowUp') {
      if(this.state.selected > 0){
        this.setState({selected : this.state.selected - 1});
        this.props.setInputSuggestion(this.state.suggestions[this.state.selected - 1]);
      }
      e.stopPropagation();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if(this.state.selected < this.state.suggestions.length - 1){
        this.setState({selected : this.state.selected + 1});
        this.props.setInputSuggestion(this.state.suggestions[this.state.selected + 1]);
      }
      e.stopPropagation();
    }
  },

  render: function() {
    return (
      <div className="fm-suggestions">
        {this.state.suggestions.length > 1 ?
        <ul>
        {this.state.suggestions.map(function (val, i) {
          if(i === this.state.selected){
            return <li className="fm-suggestion-selected">{val.family}</li>
          }else{
            return <li>{val.family}</li>
          }
        }.bind(this)).splice(0,MAX_ITEMS)}
        </ul>
        : ''}
      </div>
    );
  }
});
