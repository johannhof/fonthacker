import "babel-core/polyfill";

import React from 'react';
import Kefir from 'kefir';

import util from './util';
import local from './local';
import dom from './dom';
import {events} from './emitter';
import Fontmarklet from './views/fontmarklet';

// just for loading into the window object
require('webfontloader');

var googleFonts = Kefir
  .fromCallback(util.get.bind(null, "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBRh3XwaTyAoCjBuAFQ6syYtRjRRdeJb4o"))
  .map((data) => JSON.parse(data))
  .map(function({items}){
    return items.map(function(item) {
        return {
          provider: "google",
          variants: item.variants,
          family: item.family
        };
    });
  })
  .toProperty(() => []);

var localFonts = Kefir
  .fromCallback(local.load)
  .map(function(items){
    return items.map(function(item) {
        return {
          provider: "local",
          family: item
        };
    });
  })
  .toProperty(() => []);

var fontConfigs = Kefir
  .fromEvents(events, 'fontconfig').map((action, id) => ({action, id}))
  .scan(function(map, {action, id}){
    switch (action) {
      case 'add':
        const _id = Date.now();
        map.set(_id, {_id: _id, family: "Helvetica" });
        break;
      case 'disable':
        const config = map.get(id);
        config.disabled = true;
        map.set(id, config);
        break;
    }
    return map;
  }, new Map())
  .map((map) => Array.from(map.values()))
  .toProperty();

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

  dom.init();

  Kefir
    .combine([googleFonts, localFonts, fontConfigs])
    .onValue(function([_googleFonts, _localFonts, _fontConfigs]){
      React.render(<Fontmarklet fonts={_googleFonts.concat(_localFonts)} fontConfigs={_fontConfigs} />, _container || container);
    });

};
