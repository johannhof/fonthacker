import React from 'react';
import Radium from 'radium';
import Suggestions from './suggestions';

import Selector from './selector';

import {EmitterMixin} from '../../emitter';

import {
  fontConfig, body,
  disabled, options,
  fontConfigButton as button, removeButton,
  familyInputContainer, familyInput,
  familyInputSuggestion
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
      <div style={fontConfig}>
        {config.disabled &&
          <div style={disabled}>
            Disabled
            <br/>
            <button onClick={this.emit('fontconfig', {action: 'enable', id: config._id})}>
              Enable
            </button>
          </div>
        }

        <div style={options}>
          <div styles={[button, removeButton]} className="fm-font-config-button fm-remove-button" onClick={this.remove}>
            <span className="left">
              <i className="fa fa-times"></i>
            </span>
            <span className="right">
              Remove
            </span>
          </div>
          {!config.disabled &&
            <div
              className="fm-font-config-button"
              onClick={this.emit('fontconfig', {action: 'disable', id: config._id})}>
              <span className="left">
                <i className="fa fa-ban"></i>
              </span>
              <span className="right">
                Disable
              </span>
            </div>
          }
        </div>

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
                   ref="family"
                   value={config.family} />
             {this.state.showSuggestions &&
                <Suggestions
                 fonts={this.props.fonts}
                 family={config.family} />
             }

          </div>

          <input onChange={this.update('weight')}
                 ref="weight"
                 placeholder="weight"
                 className="fm-weight-input"
                 value={config.weight} />

        </div>
      </div>
    );
  }
}));

