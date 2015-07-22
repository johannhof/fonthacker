import React from 'react';
import Suggestions from './suggestions';

import {EmitterMixin} from '../emitter';

import style from "./styles/fontconfig";

module.exports = React.createClass({
  displayName: "FontConfig",
  mixins: [EmitterMixin],

  getInitialState() {
    return {};
  },

  onChange() {
    this.reset();
    if(this.state.suggest){
      this.updateSuggest();
    }
    var selector = this.refs.selector.getDOMNode().value;
    if(selector !== this.state.selector){
      this.setState({
        selectorNode : undefined
      });
    }
    this.props.update({
      family : this.refs.family.getDOMNode().value,
      selector : selector,
      weight : this.refs.weight.getDOMNode().value
    }, this.applyFont);
  },

  setInput(font) {
    this.refs.family.getDOMNode().value = font.family;
    this.onChange();
  },

  setInputSuggestion(font) {
    this.setState({suggestion : font ? font.family : "" });
  },

  showSuggestions() {
    this.setState({suggest: true});
  },

  hideSuggestions() {
    this.setState({suggest: false});
  },

  updateSuggest() {
    var val = util.capitalise(this.refs.family.getDOMNode().value);
    this.refs.suggest.update(val);
    this.refs.family.getDOMNode().value = val;
  },

  selectElement() {
    dom.select(function (target, name) {
      this.reset();
      this.props.update({
        family : this.props.family,
        selector : name,
        weight : this.props.weight
      });
      this.setState({ selectorNode: target }, this.applyFont);
    }.bind(this));
  },

  handleKeyDown(e) {
    this.showSuggestions();
    if(this.refs.suggest){
      var stop = this.refs.suggest.handleKeyDown(e);
    }
  },

  render() {
    const config = this.props.config;
    return (
      <div style={style}>
        {config.disabled &&
          <div className="fm-disabled">
            Disabled
            <br/>
            <button onClick={this.enable}>Enable</button>
          </div>
        }

        <div className="fm-font-config-options">
          <div className="fm-font-config-button fm-remove-button" onClick={this.remove}>
            <span className="left">
              <i className="fa fa-times"></i>
            </span>
            <span className="right">
              Remove
            </span>
          </div>
          {!this.props.disabled &&
            <div className="fm-font-config-button" onClick={this.disable}>
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
});

