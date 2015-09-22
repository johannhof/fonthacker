import React from 'react';
import Radium from 'radium';

import {EmitterMixin} from '../../emitter';

const MAX_ITEMS = 10;

import {
  input, inputSuggestion, suggestions, ul, selected
} from "./styles/suggestion_input";

module.exports = Radium(React.createClass({
  displayName: "SuggestionsInput",

  mixins: [EmitterMixin],

  getInitialState() {
    return {selected: -1, visible: false};
  },

  handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === 'ArrowRight') {
      var val = ~this.state.selected ? this.state.selected : 0;
      var font = this.props.suggestions[val];
      if(font){
        this.props.onChange({target: {value: font.family}});
      }
      e.stopPropagation();
      e.preventDefault();
      this.setState({visible: false});
    } else if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      this.setState({visible: false});
    } else if (e.key === 'ArrowUp') {
      if(this.state.selected > 0){
        this.setState({selected: this.state.selected - 1});
      }
      e.stopPropagation();
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if(this.state.selected < this.props.suggestions.length - 1){
        this.setState({selected: this.state.selected + 1});
      }
      e.stopPropagation();
    } else {
      this.setState({visible: true});
      this.emit('suggestions')(e.target.value);
    }
  },

  render: function() {
    let sug = this.props.suggestions;
    return (
      <div style={{height: this.props.height}}>
        <input readOnly value={this.state.visible && sug[0] ? sug[0].family : null} style={[inputSuggestion].concat(this.props.style)} />

        <input onChange={this.props.onChange}
               onBlur={() => this.setState({visible: false})}
               style={[input].concat(this.props.style)}
               onFocus={this.showSuggestions}
               onKeyUp={this.handleKeyDown}
               value={this.props.value} />
         {this.state.visible && sug.length > 1 &&
            <ul style={[suggestions, {top: this.props.height}]}>
              {sug.map((val, i) => {
                if(i === this.state.selected){
                  return <li style={selected}>{val.family}</li>;
                }else{
                  return <li>{val.family}</li>;
                }
              }).splice(0, MAX_ITEMS)}
            </ul>
         }

      </div>
    );
  }
}));
