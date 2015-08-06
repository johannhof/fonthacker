import "babel-core/polyfill";

import React from 'react';
import Kefir from 'kefir';

import Fontmarklet from './views/fontmarklet';

import suggestions from './suggestions';
import fontConfigs from './fontconfigs';
import fonts from './fonts';

//var selectFont = Kefir
  //.fromEvents(document.body, 'mouseover')
  //.slidingWindow()

// create font awesome css file
const fontawesome = document.createElement("link");
fontawesome.href = "https://netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css";
fontawesome.setAttribute("rel", "stylesheet");
fontawesome.setAttribute("type", "text/css");
document.getElementsByTagName("head")[0].appendChild(fontawesome);

window.loadFontmarklet = function (_container) {
  const container = document.createElement('div');
  if(!_container){
    document.body.appendChild(container);
  }

  Kefir
    .combine([fonts, fontConfigs, suggestions])
    .onValue(function([_fonts, _fontConfigs, _suggestions]){
      React.render(
        <Fontmarklet suggestions={_suggestions} fonts={_fonts} fontConfigs={_fontConfigs} />,
        _container || container
      );
    });

};
