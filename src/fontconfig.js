/** @jsx React.DOM */
var React = require('react');
var util = require('./util');
var Suggestions = require('./suggestions');

module.exports = React.createClass({

  getInitialState : function () {
    return {};
  },

  applyFont : function () {
    util.changeFont(this.state.selectorNode || this.props.selector,
               this.props.family,
               this.props.weight);
  },

  reset : function () {
    util.changeFont(this.state.selectorNode || this.props.selector, "", "");
  },

  remove : function () {
    this.reset();
    this.props.remove();
  },

  disable : function () {
    this.reset();
    this.props.disable();
  },

  enable : function () {
    this.applyFont();
    this.props.enable();
  },

  onChange : function () {
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

  setInputSuggestion : function (val) {
    this.setState({suggestion : val});
  },

  showSuggestions : function () {
    this.setState({suggest: true});
  },

  hideSuggestions : function () {
    this.setState({suggest: false});
  },

  updateSuggest : function () {
    var val = util.capitalise(this.refs.family.getDOMNode().value);
    this.refs.suggest.update(val);
    this.refs.family.getDOMNode().value = val;
  },

  selectElement : function () {
    var elements = document.querySelectorAll("body *:not(#fontmarklet)");
    elements = Array.prototype.slice.call(elements);

    var over = function (e) {
      e.target.style.backgroundColor = "lightblue";
    };
    var out = function (e) {
      e.target.style.backgroundColor = "";
    };
    var click = function (e) {
      e.preventDefault();
      out(e);
      var target = e.target;
      var name = target.nodeName;
      if(target.id){
        name += "#" + target.id;
      }else if(target.className){
        name += "." + target.className;
      }
      this.reset();
      this.props.update({
        family : this.props.family,
        selector : name,
        weight : this.props.weight
      });
      this.setState({ selectorNode: target }, this.applyFont);
      elements.forEach(function (el) {
        el.removeEventListener('mouseover', over);
        el.removeEventListener('mouseout', out);
        el.removeEventListener('click', click);
      });

      return false;
    }.bind(this);

    elements.forEach(function (el) {
      el.addEventListener('mouseover', over);
      el.addEventListener('mouseout', out);
      el.addEventListener('click', click);
    });
  },

  render: function() {
    return (
      <div className="fm-font-config">
        {this.props.disabled ?
          <div className="fm-disabled">
            Disabled
            <br/>
            <button onClick={this.enable}>Enable</button>
          </div>
        : ''}
        <div className="fm-font-config-options">
        <button className="fm-remove-button" onClick={this.remove}>
          <span className="left">
            <i className="fa fa-times"></i>
          </span>
          <span className="right">
            Remove
          </span>
        </button>
        {!this.props.disabled ?
          <button onClick={this.disable}>
            <span className="left">
              <i className="fa fa-ban"></i>
            </span>
            <span className="right">
              Disable
            </span>
          </button>
        : ''}
        {!this.props.disabled ?
          <button onClick={this.applyFont}>
            <span className="left">
              <i className="fa fa-refresh"></i>
            </span>
            <span className="right">
              Reapply
            </span>
          </button>
        : ''}
        </div>
        <div className="fm-font-config-header">
          <input onChange={this.onChange}
                 ref="selector"
                 placeholder="selector"
                 className="fm-selector-input"
                 value={this.props.selector} />
          <button onClick={this.selectElement}
                  className={"fm-selector-button" + (this.state.selectorNode ? " node" : "")}>
          <span className="left">
            Select
          </span>
          <span className="right">
            <i className="fa fa-crosshairs"></i>
          </span>
          </button>
        </div>
        <div className="fm-font-config-body">
          <div className="fm-family-input-container">
            <div className="fm-family-input-suggestion"
                 style={{
                   fontFamily : this.props.family + ", sans-serif",
                   fontWeight : this.props.weight
                 }} >
                {this.state.suggestion}
            </div>
            <input onChange={this.onChange}
                   onFocus={this.showSuggestions}
                   onBlur={this.hideSuggestions}
                   style={{
                     fontFamily : this.props.family + ", sans-serif",
                     fontWeight : this.props.weight
                   }}
                   ref="family"
                   className="fm-family-input"
                   value={this.props.family} />
             {this.state.suggest ?
              <Suggestions
               setInputSuggestion = {this.setInputSuggestion}
               fonts={this.props.fonts}
               ref="suggest"
               family={this.props.family} />
            :''}
          </div>
          <input onChange={this.onChange}
                 ref="weight"
                 placeholder="font-weight"
                 className="fm-weight-input"
                 value={this.props.weight} />
        </div>
      </div>
    );
  }
});

