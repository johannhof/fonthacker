/** @jsx React.DOM */

var React = require('react'),
    loader = require('./loader'),
    dom = require('./dom'),
    Fontmarklet = require('./views/fontmarklet');

// just for loading into the window object
var _WebFont = require('../vendor/webfont');

var fonts = [];

window.loadFontmarklet = function () {

  // create css file
  var style = document.createElement("link");
  if(process.env.NODE_ENV === "development"){
    style.href = "fm-style.css";
  }else{
    style.href = "https://joo.crater.uberspace.de/fontmarklet/fm-style.min.css";
  }
  style.setAttribute("rel", "stylesheet");
  style.setAttribute("type", "text/css");
  document.getElementsByTagName("head")[0].appendChild(style);

  // create font awesome css file
  var fontawesome = document.createElement("link");
  fontawesome.href = "https://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css";
  fontawesome.setAttribute("rel", "stylesheet");
  fontawesome.setAttribute("type", "text/css");
  document.getElementsByTagName("head")[0].appendChild(fontawesome);

  dom.init();

  // load font list
  loader.getNames(function (fonts) {
    var container = document.createElement('div');

    var fm = <Fontmarklet fonts={fonts} />;
    React.renderComponent(fm, container);

    document.body.appendChild(container);
  });

}

if(process.env.NODE_ENV !== "development"){
  loadFontmarklet();
}
