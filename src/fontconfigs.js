import webfontloader from 'webfontloader';

import Kefir from 'kefir';
import Immutable from 'immutable';

import dom from './dom';
import {events} from './emitter';

import fonts from './fonts';

let initialConfigs = [];
if (localStorage.__fm_configs){
  initialConfigs = JSON.parse(localStorage.__fm_configs).map((config) => [config._id, config]);
}

function copy(old, cur){
  return Object.assign({}, old, cur);
}

const fontConfigs = Kefir
  .fromEvents(events, 'fontconfig')
  .combine(fonts)
  .scan(function(map, [{action, id, obj}, _fonts]){
    var config;
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
        config = map.get(id);
        let f = _fonts.find((font) => font.family === obj) || {family: obj};
        return map.set(id, copy(config, { font: f }));
      case 'update:weight':
        config = map.get(id);
        return map.set(id, copy(config, {weight: obj}));
      case 'update:selector':
        config = map.get(id);
        return map.set(id, copy(config, {selector: obj}));
      case 'disable':
        config = map.get(id);
        return map.set(id, copy(config, {disabled: true}));
      case 'enable':
        config = map.get(id);
        return map.set(id, copy(config, {disabled: false}));
      case 'remove':
        return map.delete(id);
    }
    return map;
  }, Immutable.Map(initialConfigs))
  .map((map) => map.toArray())
  .toProperty();

// reset all configs
fontConfigs
  .slidingWindow(2, 2)
  .onValue(function ([old]) {
    old.forEach(function(config){
      dom.reset(config.selector);
    });
  });

fontConfigs.onValue(function (configs) {
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

fontConfigs.onValue(function (configs) {
  configs.forEach(function(config){
    if(!config.disabled){
      dom.apply(config);
    }
  });

  localStorage.__fm_configs = JSON.stringify(configs);
});

export default fontConfigs;
