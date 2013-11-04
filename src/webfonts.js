var webfonts = {};

var activeConfig, activeProvider;

webfonts.providers = {};

webfonts.fontConfigs = {};

webfonts.idCounter = Math.round(Math.random() * 100000);

webfonts.loadRequirements = function (callback) {
  var ui = require('./ui');
  var modulesDone = 0, provider;

  function check(mod) {
    ui.providerContainer.appendChild(mod.ui.init());
    mod.ui.hide();

    if(--modulesDone === 0) {
      callback();
    }
  }

  for(provider in webfonts.providers) {
    if(webfonts.providers.hasOwnProperty(provider)) {
      if(webfonts.providers[provider].loadRequirements) {
        modulesDone++;
        webfonts.providers[provider].loadRequirements(check);
      }
    }
  }
};

webfonts.loadWebFont = function (config, callback) {
  config.provider.loadWebFont(config, callback);
};

webfonts.setActiveProvider = function (name) {
  if(activeProvider) {
    activeProvider.ui.hide();
  }

  activeProvider = webfonts.providers[name];
  activeProvider.ui.show();
};

webfonts.getActiveProvider = function () {
  return activeProvider;
};

webfonts.setActiveConfig = function (id) {
  activeConfig = webfonts.fontConfigs[id];
};

webfonts.getActiveConfig = function () {
  return activeConfig;
};

webfonts.addFontConfig = function () {
  var id = webfonts.idCounter++;
  webfonts.fontConfigs[id] = new activeProvider.FontConfiguration(id);
  webfonts.setActiveConfig(id);
  return webfonts.fontConfigs[id];
};

webfonts.deleteFontConfig = function (id) {
  webfonts.fontConfigs[id] = undefined;
};

module.exports = webfonts;
