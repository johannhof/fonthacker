var local = {},
    styles = require('../styles'),
    webfonts = require('../webfonts'),
    fonts,
    mainDiv,
    fontFamilySelect, sizeInput;

local.name = "local";

local.pack = function (config) {
  var packed = $.extend({}, config);
  packed.provider = local.name;
  packed.selector = config.selector.nodeName || config.selector;
  return packed;
};

local.unpack = function (packed) {
  var config = new local.FontConfiguration(packed.id);
  config.provider = webfonts.providers[packed.provider];
  config.selector = packed.selector;
  config.family = packed.family;
  config.size = packed.size;
  config.active = packed.active;
  return config;
};

local.FontConfiguration = function (id) {
  this.id = id;
  this.provider = local;
  this.selector = "";
  this.family = fonts[$(fontFamilySelect).val()];
  this.size = sizeInput.value;
  this.active = true;

  this.applyFont = function () {
    // just here in case somebody wants to call apply directly
    return webfonts.applyFont(this.id);
  };

  this.load = function (callback) {
    // nothing to load, just call back
    callback();
  };

  this.css = function () {
    return {
      "font-family" : this.family || "",
      "font-size" : this.size || ""
    };
  };

  this.reset = function () {
    return {
      "font-family" : "",
      "font-size" : ""
    };
  };
};

local.ui = (function () {
  var localUiModule = {};

  localUiModule.show = function () {
    $(mainDiv).show();
  };

  localUiModule.hide = function () {
    $(mainDiv).hide();
  };


  localUiModule.init = function () {
    mainDiv = document.createElement("div");

    fontFamilySelect = document.createElement("select");
    $(fontFamilySelect)
      .attr("class", "selectFont")
      .css(styles.fontNameSelect)
      .change(function () {
        var value = $(this).val();
        if(webfonts.getActiveConfig()) {
          webfonts.getActiveConfig().family = fonts[value];
        }
        webfonts.getActiveConfig().applyFont();
      });

    mainDiv.appendChild(fontFamilySelect);

    sizeInput = document.createElement("input");
    $(sizeInput)
      .attr("class", "fontSize")
      .css(styles.sizeInput)
      .attr("placeholder", "Font size in px")
      .change(function () {
        webfonts.getActiveConfig().size = this.value;
        webfonts.getActiveConfig().applyFont();
      });

    mainDiv.appendChild(sizeInput);
    return mainDiv;
  };

  localUiModule.el = mainDiv;

  localUiModule.update = function (fontConfig) {
    $(fontFamilySelect).children("option[title='" + fontConfig.family + "']").prop('selected', true);
  };

  return localUiModule;
}());

local.loadRequirements = function (callback) {
  window.populateFontList = function (list) {
    fonts = list;
    var i, max = fonts.length, option;

    for(i = 0; i < max; i++) {
      option = document.createElement("option");
      option.innerHTML = fonts[i];
      option.title = fonts[i];
      option.value = i;
      fontFamilySelect.appendChild(option);
    }
  };

  var embed = document.createElement('embed');
  embed.setAttribute('width', '1');
  embed.setAttribute('height', '1');
  embed.setAttribute("type", "application/x-shockwave-flash");
  embed.setAttribute("allowscriptaccess", "always");
  embed.setAttribute('src', 'https://ssl.kundenserver.de/johann-hofmann.com/fontmarklet/FontList.swf');
  document.body.appendChild(embed);
  callback(local);
};

module.exports = local;
