import React from 'react';
import Radium from 'radium';
import {Spring} from 'react-motion';
import colors from "../styles/colors";

import {EmitterMixin} from '../../emitter';

import {container, input, button} from "./styles/selector";

module.exports = Radium(React.createClass({
  displayName: "FontConfig",

  propTypes: {
    onChange: React.PropTypes.func.isRequired,
    config: React.PropTypes.shape({
      _id: React.PropTypes.string,
      activeSelector: React.PropTypes.string,
      selector: React.PropTypes.string
    }).isRequired
  },

  mixins: [EmitterMixin],

  getInitialState: function () {
    return {};
  },

  render() {
    return (
      <div
        onMouseEnter={() => this.setState({showButton: true})}
        onMouseLeave={() => this.setState({showButton: false})}
        style={[container, {backgroundColor: this.props.config.activeSelector === 'xpath' ? colors.dark : colors.blue}]} >
        <input onChange={this.props.onChange}
               placeholder="selector"
               style={input}
               value={this.props.config.selector} />
        <div style={button} onClick={this.emit('selectFont', this.props.config)}>
          <i className="fa fa-crosshairs"></i>
        </div>
      </div>
    );
  }
}));

