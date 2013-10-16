
var localstorage = {},
    webfonts = require('./webfonts');


localstorage.save = function () {
    var tempConfig = [], conf;
    for(conf in webfonts.fontConfigs) {
        if(webfonts.fontConfigs.hasOwnProperty(conf) && webfonts.fontConfigs[conf]) {
            tempConfig.push(webfonts.fontConfigs[conf].provider.pack(webfonts.fontConfigs[conf]));
        }
    }
    localStorage.fontmarkletFontConfigs = JSON.stringify(tempConfig);
};

localstorage.load = function () {
    var name, config, tempConfig,
    ui = require('./ui');
    if(localStorage.fontmarkletFontConfigs) {
        tempConfig = JSON.parse(localStorage.fontmarkletFontConfigs);
        for(name in tempConfig) {
            if(tempConfig.hasOwnProperty(name)) {
                config = webfonts.providers[tempConfig[name].provider].unpack(tempConfig[name]);
                ui.addSelectorRow(config);
                webfonts.idCounter++;
                webfonts.fontConfigs[config.id] = config;
                config.provider.ui.update(config);
                config.load((function (config) {
                    return function () {
                        config.applyFont();
                    };
                }(config)));
            }
        }
    }
};

module.exports = localstorage;
