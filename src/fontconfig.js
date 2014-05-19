/** @jsx React.DOM */
var React = require('react');
var util = require('./util');
var Suggestions = require('./suggestions');

function changeFont(selector, family, weight) {
  try {
    var nodes;
    if(selector.nodeName){
      nodes = [selector];
    }else{
      nodes = document.querySelectorAll(selector);
      nodes = Array.prototype.slice.call(nodes);
    }
    nodes.forEach(function (node) {
      node.style.fontFamily = family;
      node.style.fontWeight = weight;
    });
  } catch (ignore) { }
}

module.exports = React.createClass({

  getInitialState : function () {
    return {};
  },

  applyFont : function () {
    changeFont(this.state.selectorNode || this.props.selector,
               this.props.family,
               this.props.weight);
  },

  reset : function () {
    changeFont(this.state.selectorNode || this.props.selector, "");
  },

  onChange : function () {
    this.reset();
    if(this.state.suggest){
      this.updateSuggest();
    }
    this.props.update({
      family : this.refs.family.getDOMNode().value,
      selector : this.refs.selector.getDOMNode().value,
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
    var val = this.refs.family.getDOMNode().value;
    this.refs.suggest.update(val);
    this.refs.family.getDOMNode().value = util.capitalise(val);
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
      <div  className="fm-font-config">
        <div className="fm-font-config-options">
        <button onClick={this.props.remove}>Remove</button>
        <button></button>
        </div>
        <div className="fm-font-config-header">
          <input onChange={this.onChange}
                 ref="selector"
                 placeholder="selector"
                 className="fm-selector-input"
                 value={this.props.selector} />
          <button onClick={this.selectElement}
                  className={"fm-selector-button" + (this.state.selectorNode ? " node" : "")}>
          </button>
        </div>
        <div className="fm-font-config-body">
          <div className="fm-family-input-container">
            <div className="fm-family-input-suggestion"
                 style={{
                   fontFamily : this.props.family,
                   fontWeight : this.props.weight
                 }} >
                {this.state.suggestion}
            </div>
            <input onChange={this.onChange}
                   onFocus={this.showSuggestions}
                   onBlur={this.hideSuggestions}
                   style={{
                     fontFamily : this.props.family,
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

