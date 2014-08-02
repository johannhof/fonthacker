/** @jsx React.DOM */

var React = require('react'),
    loader = require('../loader'),
    dom = require('../dom'),
    Header = require('./header'),
    FontConfig = require('./fontconfig');

module.exports = React.createClass({
  getInitialState : function () {
    return localStorage["fm_config"] ?
      JSON.parse(localStorage["fm_config"]) :
      {fontConfigs : []};
  },

  componentDidMount : function () {
    var names = this.state.fontConfigs.map(function(font){
      return font.family;
    })

    // TODO reduce asympt complexity of this?
    var filtered = this.props.fonts.filter(function (val) {
        return ~names.indexOf(val.family);
    });

    loader.load(filtered);
    dom.applyFont(this.state.fontConfigs);
  },

  save : function (obj, cb) {
    this.setState(obj, cb);
    localStorage["fm_config"] = JSON.stringify(this.state);
  },

  addFont : function () {
    var randomFont = this.props.fonts[Math.floor(Math.random() * this.props.fonts.length)];
    loader.load(randomFont);
    this.state.fontConfigs.push({
      selector : "#selector",
      family : randomFont.family
    });
    this.save();
  },

  startDrag : function (x, y) {
    var node = this.getDOMNode();
    this.dragOffsetX = x - node.offsetLeft;
    this.dragOffsetY = y - node.offsetTop;
  },

  drag : function (x, y) {
    this.save({
      left: x - this.dragOffsetX,
      top: y - this.dragOffsetY
    });
  },

  removeFont : function (index) {
    this.state.fontConfigs.splice(index, 1);
    this.save();
  },

  updateFont : function (i, conf, cb) {
    this.state.fontConfigs[i] = conf;
    this.save({
      fontConfigs : this.state.fontConfigs
    }, cb);
  },

  disableFont : function (i, conf, cb) {
    this.state.fontConfigs[i].disabled = true;
    this.save({
      fontConfigs : this.state.fontConfigs
    }, cb);
  },

  enableFont : function (i, conf, cb) {
    this.state.fontConfigs[i].disabled = false;
    this.save({
      fontConfigs : this.state.fontConfigs
    }, cb);
  },

  render: function() {
    return (
      <div id="fontmarklet" style={{left: + this.state.left, top: this.state.top}}>
        <Header dragParent={this.drag} parentStartDrag={this.startDrag}/>
        {this.state.fontConfigs.map(function (conf, i) {
          return <FontConfig update={this.updateFont.bind(this, i)}
                             remove={this.removeFont.bind(this, i)}
                             fonts={this.props.fonts}
                             disable={this.disableFont.bind(this, i)}
                             enable={this.enableFont.bind(this, i)}
                             disabled={conf.disabled}
                             family={conf.family}
                             weight={conf.weight}
                             selector={conf.selector}
                             />;
        }.bind(this))}
        <button onClick={this.addFont} className="fm-add-button">
          Add Font
        </button>
      </div>
    );
  }
});
