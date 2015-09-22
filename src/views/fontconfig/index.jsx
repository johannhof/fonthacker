import React from 'react';
import Radium from 'radium';
import {Spring} from 'react-motion';

import Selector from './selector';
import ConfigButtons from './buttons';

import SuggestionInput from './suggestion_input';

import {EmitterMixin} from '../../emitter';

import {
  fontConfig, body,
  disabled, familyInput, weightInput
} from "./styles/fontconfig";

module.exports = Radium(React.createClass({
  displayName: "FontConfig",

  propTypes: {
    config: React.PropTypes.shape({
      _id: React.PropTypes.number,
      disabled: React.PropTypes.bool
    }).isRequired
  },

  mixins: [EmitterMixin],

  getInitialState() {
    return {};
  },

  update(prop) {
    const emitter = this.emit('fontconfig');
    return e => {
      emitter({
        action: 'update:' + prop,
        id: this.props.config._id,
        obj: e.target.value
      });
    };
  },

  render() {
    const config = this.props.config;
    return (
      <div style={[fontConfig, {zIndex: this.props.index}]} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
        {config.disabled &&
          <div style={disabled}>
            Disabled
            <br/>
            <button onClick={this.emit('fontconfig', {action: 'enable', id: config._id})}>
              Enable
            </button>
          </div>
        }

        <Spring defaultValue={{right: {val: 10}, opacity: {val: 0}}} endValue={{right: {val: this.state.hover ? -30 : 10}, opacity: {val: this.state.hover ? 1 : 0}}}>
          {interpolated =>
            <ConfigButtons right={interpolated.right.val} opacity={interpolated.opacity.val} _id={config._id} disabled={config.disabled}/>
          }
        </Spring>

        <Selector config={config} onChange={this.update('cssSelector')} />

        <div style={body}>
          <SuggestionInput
            onChange={this.update('family')}
            height={familyInput.height + familyInput.padding * 2}
            style={[familyInput, {
               fontFamily: config.font.family + ", sans-serif",
               fontWeight: config.weight
             }]}
            suggestions={this.props.suggestions}
            value={config.font.family} />

          <input onChange={this.update('weight')}
                 placeholder="weight"
                 style={weightInput}
                 value={config.weight} />
        </div>
      </div>
    );
  }
}));

