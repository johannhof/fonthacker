/** @jsx React.DOM */
var React = require('react');
var loader = require('./loader');
var util = require('./util');
var FontConfig = require('./fontconfig');

// just for loading into the window object
var _WebFont = require('../vendor/webfont');

var fonts = [];

var Header = React.createClass({

   listener :  function (event) {
      event.preventDefault();
      this.props.dragParent(event.clientX, event.clientY);
   },

  startDrag : function (event) {
    this.props.parentStartDrag(event.clientX, event.clientY);
    document.body.addEventListener('mousemove', this.listener);
    document.body.addEventListener('mouseup', function () {
      document.body.removeEventListener('mousemove', this.listener);
    }.bind(this));
  },

  render: function() {
    return (
      <div onMouseDown={this.startDrag} className="fm-header">
        Fontmarklet
      </div>
    );
  }
});

var AddButton = React.createClass({
  render: function() {
    return (
      <button onClick={this.props.onclick} className="fm-add-button">
        Add Font
      </button>
    );
  }
});

var Fontmarklet = React.createClass({
  getInitialState : function () {
    return localStorage["fm_config"] ?
      JSON.parse(localStorage["fm_config"]) :
      {fontConfigs : []};
  },

init: function() {
  if(this.state.fontConfigs.length < 1) return;
  window.WebFont.load({
    google: {
      families: this.state.fontConfigs.map(function (config) {
        return config.family + ":" + config.weight;
      })
    }
  });
  this.state.fontConfigs.forEach(function(config) {
    if(!config.disabled){
      util.changeFont(
        config.selector,
        config.family,
        config.weight);
    }
  });
},
  save : function (obj, cb) {
    this.setState(obj, cb);
    localStorage["fm_config"] = JSON.stringify(this.state);
  },

  addFont : function () {
    this.state.fontConfigs.push({
      selector : "#abc",
      family : "Lato"
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
        <AddButton onclick={this.addFont}/>
      </div>
    );
  }
});

window.loadFontmarklet = function () {

  // create css file
  var style = document.createElement("link");
  style.href = "./style.css";
  style.setAttribute("rel", "stylesheet");
  style.setAttribute("type", "text/css");
  document.getElementsByTagName("head")[0].appendChild(style);

  // create css file
  var fontawesome = document.createElement("link");
  fontawesome.href = "//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css";
  fontawesome.setAttribute("rel", "stylesheet");
  fontawesome.setAttribute("type", "text/css");
  document.getElementsByTagName("head")[0].appendChild(fontawesome);

  // load font list
  loader.loadAll(function (fonts) {
    var container = document.createElement('div');

    var fm = <Fontmarklet fonts={fonts} />;
    React.renderComponent(fm, container, function () {
      fm.init();
    });

    document.body.appendChild(container);
  });

}

