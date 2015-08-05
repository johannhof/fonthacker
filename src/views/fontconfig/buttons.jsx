import React from 'react';
import Radium from 'radium';

import {
  options, button, removeButton
} from "./styles/buttons";

import {EmitterMixin} from '../../emitter';

module.exports = Radium(React.createClass({
  displayName: "ConfigButtons",
  mixins: [EmitterMixin],

  render() {
    return (
      <div style={[options, {right: this.props.right, opacity: this.props.opacity}]}>
        <div style={[button, removeButton]}
          onClick={this.emit('fontconfig', {action: 'remove', id: this.props._id})}>
          <span><i className="fa fa-times"></i></span>
        </div>
        {!this.props.disabled &&
          <div
            style={button}
            onClick={this.emit('fontconfig', {action: 'disable', id: this.props._id})}>
            <span><i className="fa fa-ban"></i></span>
          </div>
        }
      </div>
    );
  }
}));
