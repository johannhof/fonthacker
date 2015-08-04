import React from 'react';
import Radium from 'radium';
import {Spring} from 'react-motion';

import {container, input, button} from "./styles/selector";

module.exports = Radium(React.createClass({
  displayName: "FontConfig",

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    selector: React.PropTypes.string
  },

  getInitialState: function () {
    return {};
  },

  render() {
    return (
      <div
        onMouseEnter={() => this.setState({showButton: true})}
        onMouseLeave={() => this.setState({showButton: false})}
        style={container} >
        <input onChange={this.props.onChange}
               placeholder="selector"
               style={input}
               value={this.props.selector} />
        <div style={button}>
          <i className="fa fa-crosshairs"></i>
        </div>
      </div>
    );
  }
}));

