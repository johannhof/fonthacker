var Obsv = require('./Obsv'),
    ui = require('./ui'),
    localstorage = require('./localstorage'),
    styles = require('./styles'),
    webfonts = require('./webfonts');

var controller =  new Obsv();

controller.addButtonClick = function () {
  // create a new row
  var row = ui.addSelectorRow(webfonts.addFontConfig());

  // select the row (simulate a user click)
  $(row).click();
};

controller.deleteButtonClick = function (id, selectorDiv) {
  $(selectorDiv).remove();
  webfonts.applyFont(id, true);
  webfonts.deleteFontConfig(id);
  localstorage.save();
};

controller.selectButtonClick = function (id) {
  ui.selectElement(function (element) {
    webfonts.applyFont(id, true);
    $(this).css(styles.selectButton_selected);

    webfonts.fontConfigs[id].selector = element;
    webfonts.applyFont(id);

    localstorage.save();
  });
};

controller.selectorInputChange = function (id, selectButton, value) {
  webfonts.applyFont(id, true);
  $(selectButton).css(styles.selectButton);
  webfonts.fontConfigs[id].selector = value;
  webfonts.applyFont(id);
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
  webfonts.applyFont(id);
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
      webfonts.applyFont(activeId);
    });

    localstorage.save();
  }

};

module.exports = controller;
