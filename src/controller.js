var controller = {},
    ui = require('./ui'),
    localstorage = require('./localstorage'),
    styles = require('./styles'),
    webfonts = require('./webfonts');

controller.addButtonClick = function () {
  var row = ui.addSelectorRow(webfonts.addFontConfig());
  $(row).click();
};

controller.deleteButtonClick = function (id, selectorDiv) {
  $(selectorDiv).remove();
  webfonts.fontConfigs[id].reset();
  webfonts.deleteFontConfig(id);
  localstorage.save();
};

controller.selectButtonClick = function (id) {
  ui.selectElement(function (element) {
    webfonts.fontConfigs[id].reset();
    $(this).css(styles.selectButton_selected);
    webfonts.fontConfigs[id].selector = element;
    webfonts.fontConfigs[id].applyFont();
    localstorage.save();
  });
};

controller.selectorInputChange = function (id, selectButton, value) {
  webfonts.fontConfigs[id].reset();
  $(selectButton).css(styles.selectButton);
  webfonts.fontConfigs[id].selector = value;
  webfonts.fontConfigs[id].applyFont();
  localstorage.save();
};

controller.selectorDivClick = function (id, selectorDiv) {
  $(selectorDiv).css(styles.selectorDiv_selected);
  $(selectorDiv).siblings("div").css(styles.selectorDiv);
  webfonts.setActiveConfig(id);
  webfonts.fontConfigs[id].provider.ui.update(webfonts.fontConfigs[id]);
};

controller.activeCheckClick = function (id, checkbox) {
  webfonts.fontConfigs[id].active = checkbox.checked;
  webfonts.fontConfigs[id].reset();
  webfonts.fontConfigs[id].applyFont();
};

controller.fontProviderSelectChange = function (value) {
  webfonts.setActiveProvider(value);
  var activeConfig = webfonts.getActiveConfig(), activeId, activeSelector;
  if(activeConfig) {
    var activeProvider = webfonts.getActiveProvider();
    activeId = activeConfig.id;
    activeSelector = activeConfig.selector;
    webfonts.fontConfigs[activeId] = new activeProvider.FontConfiguration(activeId);
    webfonts.fontConfigs[activeId].selector = activeSelector;
    webfonts.fontConfigs[activeId].load(function () {
      webfonts.fontConfigs[activeId].applyFont();
    });
    localstorage.save();
  }
};

module.exports = controller;
