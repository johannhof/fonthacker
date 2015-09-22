import Kefir from 'kefir';
import Immutable from 'immutable';
import webfontloader from 'webfontloader';
import xpath from 'xpath-dom';

import dom from './dom';
import {events} from './emitter';

import fonts from './fonts';
import selectFont from './select_font';

let initialConfigs = [];
if (localStorage.__fm_configs){
  initialConfigs = JSON.parse(localStorage.__fm_configs).map((config) => [config._id, config]);
}

function copy(old, cur){
  return Object.assign({}, old, cur);
}

// A FontConfig describes a user font configuration
// Schema:
// {
//  _id: Number,
//  disabled: Boolean,
//  activeSelector: String{"css"|"xpath"},
//  selector: String,
//  font: {
//    family: String,
//    provider: String
//  },
//  weight: String
// }
const fontConfigs = Kefir
  .fromEvents(events, 'fontconfig')
  .merge(selectFont.filter((x) => x).map(function([e, config]){
    return {
      action: 'update:nodeSelector',
      id: config._id,
      obj: xpath.getXPath(e.target)
    };
  }))
  .combine(fonts)
  .scan(function(map, [{action, id, obj}, _fonts]){
    var config;
    if(id){
      config = map.get(id);
    }
    switch (action) {
      case 'add':
        const _id = Date.now();
        return map.set(_id, {
          _id: _id,
          selector: "#example",
          font: _fonts[Math.floor(Math.random() * _fonts.length)],
          weight: "normal"
        });
      case 'update:family':
        let f = _fonts.find((font) => font.family === obj) || {family: obj};
        return map.set(id, copy(config, { font: f }));
      case 'update:weight':
        return map.set(id, copy(config, {weight: obj}));
      case 'update:cssSelector':
        return map.set(id, copy(config, {activeSelector: 'css', selector: obj}));
      case 'update:nodeSelector':
        return map.set(id, copy(config, {activeSelector: 'xpath', selector: obj}));
      case 'disable':
        return map.set(id, copy(config, {disabled: true}));
      case 'enable':
        return map.set(id, copy(config, {disabled: false}));
      case 'remove':
        return map.delete(id);
    }
    return map;
  }, new Immutable.OrderedMap(initialConfigs))
  .map((map) => map.toArray())
  .toProperty();

const debounced = fontConfigs.debounce(250);

// reset all configs
debounced
  .slidingWindow(2, 2)
  .onValue(function ([old]) {
    old.forEach(function(config){
      dom.reset(config);
    });
  });

debounced.onValue(function (configs) {
  configs.forEach(function(config){
    if(!config.disabled){
      dom.apply(config);
    }
  });

  localStorage.__fm_configs = JSON.stringify(configs);
});

debounced.onValue(function (configs) {
    try {
      webfontloader.load({
        google: {
          families: configs
            .filter(config => config.font.provider === 'google')
            .map(function({font}) {
              return font.family + ":" + (font.variants ? font.variants.join(',') : '');
            })
        }
      });
    } catch (e) {
      console.warn("error loading webfonts:", e);
    }
  });

export default fontConfigs;
