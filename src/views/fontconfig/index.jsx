import React from 'react';
import Radium from 'radium';
import Suggestions from './suggestions';
import {Spring} from 'react-motion';

import Selector from './selector';
import ConfigButtons from './buttons';

import {EmitterMixin} from '../../emitter';

import {
  fontConfig, body,
  disabled,
  familyInputContainer, familyInput,
  familyInputSuggestion, weightInput
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
        action: 'update',
        id: this.props.config._id,
        obj: Object.assign({}, this.props.config, {
          [prop]: e.target.value
        })
      });
    };
  },

  render() {
    const config = this.props.config;
    return (
      <div style={fontConfig} onMouseEnter={() => this.setState({hover: true})} onMouseLeave={() => this.setState({hover: false})}>
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
        <Selector selector={config.selector} onChange={this.update('selector')} />

        <div style={body}>
          <div style={familyInputContainer}>
            <div style={[familyInputSuggestion, {
                   fontFamily: config.family + ", sans-serif",
                   fontWeight: config.weight
                 }]} >
                {this.state.suggestion}
            </div>

            <input onChange={this.update('family')}
                   onFocus={this.showSuggestions}
                   onKeyDown={this.handleKeyDown}
                   style={[familyInput, {
                     fontFamily: config.family + ", sans-serif",
                     fontWeight: config.weight
                   }]}
                   value={config.family} />
             {this.state.showSuggestions &&
                <Suggestions
                 fonts={this.props.fonts}
                 family={config.family} />
             }

          </div>

          <input onChange={this.update('weight')}
                 placeholder="weight"
                 style={weightInput}
                 value={config.weight} />

        </div>
      </div>
    );
  }
}));

