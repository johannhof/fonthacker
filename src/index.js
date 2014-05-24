/** @jsx React.DOM */
var React = require('react');
var loader = require('./loader');
var FontConfig = require('./fontconfig');

// just for loading into the window object
var _WebFont = require('../vendor/webfont');

var fonts = [];

var Header = React.createClass({
  render: function() {
    return (
      <div className="fm-header">
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
    return {
      fontConfigs : []
    }
  },

  addFont : function () {
    this.state.fontConfigs.push({
      selector : "#abc",
      family : "Lato"
    });
    this.setState();
  },

  removeFont : function (index) {
    this.state.fontConfigs.splice(index, 1);
    this.setState();
  },

  updateFont : function (i, conf, cb) {
    this.state.fontConfigs[i] = conf;
    this.setState({
      fontConfigs : this.state.fontConfigs
    }, cb);
  },

  render: function() {
    return (
      <div id="fontmarklet">
        <Header/>
        {this.state.fontConfigs.map(function (conf, i) {
          return <FontConfig update={this.updateFont.bind(this, i)}
                             remove={this.removeFont.bind(this, i)}
                             fonts={this.props.fonts}
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

    React.renderComponent(<Fontmarklet fonts={fonts} />, container);

    document.body.appendChild(container);
  });

}

