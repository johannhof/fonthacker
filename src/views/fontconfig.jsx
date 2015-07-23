import React from 'react';
import Radium from 'radium';
import Suggestions from './suggestions';

import {EmitterMixin} from '../emitter';

import {fontConfig, disabled, options} from "./styles/fontconfig";

module.exports = Radium(React.createClass({
  displayName: "FontConfig",

  propTypes: {
    config: React.PropTypes.shape({
      disabled: React.PropTypes.bool
    }).isRequired
  },

  mixins: [EmitterMixin],

  getInitialState() {
    return {};
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
          <div className="fm-font-config-button fm-remove-button" onClick={this.remove}>
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

        <div className="fm-font-config-header">
          <input onChange={this.onChange}
                 ref="selector"
                 placeholder="selector"
                 className="fm-selector-input"
                 value={this.props.selector} />
          <button onClick={this.selectElement}
                  className={"fm-selector-button" + (this.state.selectorNode ? " node" : "")}>
            <i className="fa fa-crosshairs"></i>
          </button>
        </div>

        <div className="fm-font-config-body">
          <div className="fm-family-input-container">
            <div className="fm-family-input-suggestion"
                 style={{
                   fontFamily: this.props.family + ", sans-serif",
                   fontWeight: this.props.weight
                 }} >
                {this.state.suggestion}
            </div>

            <input onChange={this.onChange}
                   onFocus={this.showSuggestions}
                   onKeyDown={this.handleKeyDown}
                   style={{
                     fontFamily: this.props.family + ", sans-serif",
                     fontWeight: this.props.weight
                   }}
                   ref="family"
                   className="fm-family-input"
                   value={this.props.family} />
             {this.state.suggest &&
              <Suggestions
               setInputSuggestion = {this.setInputSuggestion}
               setInput = {this.setInput}
               hideSuggestions={this.hideSuggestions}
               fonts={this.props.fonts}
               ref="suggest"
               family={this.props.family} />
             }

          </div>

          <input onChange={this.onChange}
                 ref="weight"
                 placeholder="weight"
                 className="fm-weight-input"
                 value={this.props.weight} />

        </div>
      </div>
    );
  }
}));

