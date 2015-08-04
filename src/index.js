import "babel-core/polyfill";
import 'webfontloader';

import React from 'react';
import Kefir from 'kefir';
import Immutable from 'immutable';

import util from './util';
import local from './local';
import dom from './dom';
import {events} from './emitter';
import Fontmarklet from './views/fontmarklet';


//var selectFont = Kefir
  //.fromEvents(document.body, 'mouseover')
  //.slidingWindow()

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

let initialConfigs = [];
if (localStorage.__fm_configs){
  initialConfigs = JSON.parse(localStorage.__fm_configs).map((config) => [config._id, config]);
}

var fontConfigs = Kefir
  .fromEvents(events, 'fontconfig')
  .scan(function(map, {action, id, obj}){
    var config;
    switch (action) {
      case 'add':
        const _id = Date.now();
        return map.set(_id, {
          _id: _id,
          selector: "#example",
          family: "Helvetica",
          weight: "normal"
        });
      case 'update':
        console.log(map.get(id), obj);
        return map.set(id, Object.assign({}, obj));
      case 'disable':
        config = map.get(id);
        config.disabled = true;
        return map.set(id, config);
      case 'enable':
        config = map.get(id);
        config.disabled = false;
        return map.set(id, config);
    }
  }, Immutable.Map(initialConfigs))
  .map((map) => map.toArray())
  .toProperty();

// reset all configs
fontConfigs
  .slidingWindow(2, 2)
  .onValue(function ([old, _]) {
    old.forEach(function(config){
      if(!config.disabled){
        dom.reset(config.selector);
      }
    });
  });

fontConfigs.onValue(function (configs) {
  configs.forEach(function(config){
    if(!config.disabled){
      dom.apply(config);
    }
  });
  localStorage.__fm_configs = JSON.stringify(configs);
});

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
    .combine([googleFonts, localFonts, fontConfigs])
    .onValue(function([_googleFonts, _localFonts, _fontConfigs]){
      React.render(<Fontmarklet fonts={_googleFonts.concat(_localFonts)} fontConfigs={_fontConfigs} />, _container || container);
    });

};
