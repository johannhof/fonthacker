;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Super simple observer system.
 */
var events = {};

var Obsv = function(){
  // nothing yet
};

Obsv.prototype.on = function(event, callback){
    if(events[event]){
        events[event].push(callback);
    }else{
        events[event] = [callback];
    }
};

Obsv.prototype.emit = function(event){
    var eventArray = events[event], i;
    for(i = 0; i < eventArray.length; i++){
        eventArray[i]();
    }
};

module.exports = Obsv;

},{}],2:[function(require,module,exports){
(function (window) {
  var v = "1.8.3", script, done = false;

  /*
   * Loads the bookmarklet after requirements are set up
   */
  function loadBookmarklet() {
    console.log('Starting up the bookmarklet!');
    var ui = require('./ui'),
    controller = require('./controller'),
    localstorage = require('./localstorage'),
    webfonts = require('./webfonts');

    webfonts.providers = {
      google : require('./providers/google'),
      local : require('./providers/local')
    };

    ui.init(controller, webfonts.providers);
    webfonts.loadRequirements(function () {
      webfonts.setActiveProvider("google");
      localstorage.load();
    });
  }

  /*
   * Checks if a sufficient jQuery Version is already existent
   * if not, load it
   * then call the initial load function
   */
  if(window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    script = document.createElement("script");
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";

    script.onload = script.onreadystatechange = function () {
      if(!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        done = true;
        loadBookmarklet();
      }
    };

    document.getElementsByTagName("head")[0].appendChild(script);

  } else {
    loadBookmarklet();
  }

}(window));

},{"./controller":3,"./localstorage":4,"./providers/google":5,"./providers/local":6,"./ui":8,"./webfonts":11}],3:[function(require,module,exports){
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

},{"./Obsv":1,"./localstorage":4,"./styles":7,"./ui":8,"./webfonts":11}],4:[function(require,module,exports){
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

},{"./ui":8,"./webfonts":11}],5:[function(require,module,exports){
var google = {},
    styles = require('../styles'),
    webfonts = require('../webfonts'),
    localstorage = require('../localstorage'),
    fonts, mainDiv,
    fontFamilySelect, sizeInput, subsetSelect, variantSelect;

google.name = "google";

google.pack = function (config) {
  var packed = $.extend({}, config);
  packed.provider = google.name;
  packed.selector = config.selector.nodeName || config.selector;
  return packed;
};

google.unpack = function (packed) {
  var config = new google.FontConfiguration(packed.id);
  config.provider = webfonts.providers[packed.provider];
  config.selector = packed.selector;
  config.family = packed.family;
  config.variant = packed.variant;
  config.size = packed.size;
  config.weight = packed.weight;
  config.active = packed.active;
  return config;
};

/**
 * Parses the font weight from a given variant string.
 *
 * @param {string} variant
 * @returns {*} a number or the string "normal"
 */
function parseWeight(variant) {
  switch(variant) {
    case "regular":
      return "normal";
    case "italic":
      return 400;
    default:
      return parseInt(variant, 10);
  }
}

/**
 * Parses a font style from a given variant string, currently supports normal and italic.
 *
 * @param {string} variant
 * @returns {string}
 */
function parseStyle(variant) {
  if(variant.indexOf("regular") !== -1) {
    return "normal";
  }
  if(variant.indexOf("italic") !== -1) {
    return "italic";
  }
  return "normal";
}

google.FontConfiguration = function (id) {
  this.id = id;
  this.provider = google;
  this.selector = "";
  this.family = fonts[$(fontFamilySelect).val()].family;
  this.variant = $(variantSelect).val();
  this.size = sizeInput.value;
  this.weight = parseWeight($(variantSelect).val());
  this.subset = $(subsetSelect).val();
  this.active = true;

  this.applyFont = function () {
    // just here in case somebody wants to call apply directly
    return webfonts.applyFont(this.id);
  };

  this.load = function (callback) {
    if(this.family) {
      window.WebFont.load({
        google : {
          families : [this.family + ":" + (this.variant || "") + ":" + (this.subset || "")]
        },
        active : callback
      });
    }
  };

  this.css = function () {
    return {
      "font-family" : this.family || "",
      "font-size" : this.size || "",
      "font-weight" : this.weight || "",
      "font-style" : this.style || ""
    };
  };

  this.reset = function () {
    return {
      "font-family" : "",
      "font-size" : "",
      "font-weight" : "",
      "font-style" : ""
    };
  };
};

google.ui = (function () {
  var googleUiModule = {};

  googleUiModule.show = function () {
    $(mainDiv).show();
  };

  googleUiModule.hide = function () {
    $(mainDiv).hide();
  };

  googleUiModule.init = function () {
    mainDiv = document.createElement("div");

    fontFamilySelect = document.createElement("select");
    $(fontFamilySelect)
      .attr("class", "selectFont")
      .css(styles.fontNameSelect)
      .change(function () {
        var value = $(this).val();
        googleUiModule.updateSubsets(fonts[value].subsets);
        googleUiModule.updateVariants(fonts[value].variants);

        if(webfonts.getActiveConfig()) {
          webfonts.getActiveConfig().family = fonts[value].family;

          // reset to avoid bad request (wrong combination)
          webfonts.getActiveConfig().variant = "";
          webfonts.getActiveConfig().weight = "";

          webfonts.getActiveConfig().load(function () {
            webfonts.getActiveConfig().applyFont();
          });
          localstorage.save();
        }

      });

    mainDiv.appendChild(fontFamilySelect);

    subsetSelect = document.createElement("select");
    $(subsetSelect)
      .attr("class", "subset")
      .css(styles.subsetSelect)
      .change(function () {
        if(webfonts.getActiveConfig()) {
          webfonts.getActiveConfig().subset = this.value;
        }

        webfonts.getActiveConfig().load(function () {
          webfonts.getActiveConfig().applyFont();
        });

        localstorage.save();
      });
    mainDiv.appendChild(subsetSelect);

    variantSelect = document.createElement("select");
    $(variantSelect)
      .attr("class", "variant")
      .css(styles.variantSelect)
      .change(function () {
        if(webfonts.getActiveConfig()) {
          webfonts.getActiveConfig().variant = this.value;
          webfonts.getActiveConfig().weight = parseWeight(this.value);
          webfonts.getActiveConfig().style = parseStyle(this.value);
        }

        webfonts.getActiveConfig().load(function () {
          webfonts.getActiveConfig().applyFont();
        });

        localstorage.save();
      });
    mainDiv.appendChild(variantSelect);

    sizeInput = document.createElement("input");
    $(sizeInput)
      .attr("class", "fontSize")
      .css(styles.sizeInput)
      .attr("placeholder", "Font size")
      .change(function () {
        webfonts.getActiveConfig().size = this.value;
        webfonts.getActiveConfig().applyFont();
      });
    mainDiv.appendChild(sizeInput);

    var i, max = fonts.length, option;
    for(i = 0; i < max; i++) {
      option = document.createElement("option");
      option.innerHTML = fonts[i].family;
      option.title = fonts[i].family;
      option.value = i;
      fontFamilySelect.appendChild(option);
    }

    googleUiModule.updateSubsets(fonts[0].subsets);
    googleUiModule.updateVariants(fonts[0].variants);
    new google.FontConfiguration(-1).load();
    return mainDiv;
  };

  googleUiModule.updateSubsets = function (subsets) {
    var i, numberOfSubsets = subsets.length, option;
    $(subsetSelect).empty();

    for(i = 0; i < numberOfSubsets; i++) {
      option = document.createElement("option");
      option.innerHTML = subsets[i];
      option.value = subsets[i];
      subsetSelect.appendChild(option);
    }

    if(webfonts.getActiveConfig()) {
      webfonts.getActiveConfig().subset = subsets[0];
    }
  };

  googleUiModule.updateVariants = function (variants) {
    var i, numberOfVariants = variants.length, option;
    $(variantSelect).empty();

    for(i = 0; i < numberOfVariants; i++) {
      option = document.createElement("option");
      option.innerHTML = variants[i];
      option.value = variants[i];
      variantSelect.appendChild(option);
    }

    if(webfonts.getActiveConfig()) {
      webfonts.getActiveConfig().weight = parseWeight(variants[0]);
      webfonts.getActiveConfig().style = parseStyle(variants[0]);
    }
  };

  googleUiModule.update = function (fontConfig) {
    $(fontFamilySelect).children("option[title='" + fontConfig.family + "']").prop('selected', true);

    googleUiModule.updateSubsets(fonts[$(fontFamilySelect).val()].subsets);
    googleUiModule.updateVariants(fonts[$(fontFamilySelect).val()].variants);

    $(subsetSelect).children("option[value='" + fontConfig.subset + "']").prop('selected', true);
    $(variantSelect).children("option[value='" + fontConfig.variant + "']").prop('selected', true);
  };

  return googleUiModule;
}());

google.loadRequirements = function (callback) {
  var webFontScript = document.createElement('script'), firstScriptTag;
  webFontScript.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  webFontScript.type = 'text/javascript';
  webFontScript.async = 'true';
  webFontScript.onload = function () {
    $.getJSON("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBRh3XwaTyAoCjBuAFQ6syYtRjRRdeJb4o&callback=?",
      function (data) {
        fonts = data.items;
        callback(google);
      });
  };

  firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(webFontScript, firstScriptTag);
};

module.exports = google;

},{"../localstorage":4,"../styles":7,"../webfonts":11}],6:[function(require,module,exports){
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

},{"../styles":7,"../webfonts":11}],7:[function(require,module,exports){
module.exports = {
  mainContainer : {
      width : "500px",
      "min-height" : "150px",
      "background-color" : "rgba(250,250,250,0.7)",
      position : "fixed",
      zIndex : "999",
      border : "3px solid rgba(200,200,200,0.2)",
      overflow : "visible"
  },
  selectorContainer : {
      width : "300px",
      "min-height" : "150px",
      "float" : "left",
      overflow : "auto",
      "border-right" : "3px solid rgba(200,200,200,0.2)"
  },
  selectedElement : {
      border : "3px dotted grey",
      "-webkit-transition" : "all 0.2s",
      "-moz-transition" : "all 0.2s",
      "-o-transition" : "all 0.2s",
      transition : "all 0.2s ease-in-out"
  },
  unselectedElement : {
      border : "",
      "-webkit-transition" : "",
      "-moz-transition" : "",
      "-o-transition" : "",
      transition : ""
  },
  rightContainer : {
      padding : "10px",
      "text-align" : "center"
  },
  selectorDiv : {
      borderTop: "2px solid rgba(200,200,200,0.0)",
      borderBottom: "2px solid rgba(200,200,200,0.0)",
      height: "30px",
      "background-color" : "rgba(200,200,200,0.2)",
      cursor : "pointer"
  },
  selectorDiv_selected : {
      "background-color" : "rgb(37,141,200)"
  },
  addButton : {
      background : "rgb(143,200,0)",
      width : "100%",
      height : "30px",
      border : "none",
      cursor : "pointer",
      color : "white"
  },
  selectButton : {
      background : "rgb(140,180,200)",
      width : "24%",
      marginLeft : "10%",
      marginRight : "0%",
      height : "100%",
      cursor : "pointer",
      border : "none",
      color : "white"
  },
  selectButton_selected : {
      border : "1px solid rgb(143,200,0)"
  },
  selectorInput : {
      border : "none",
      marginRight : "0%",
      padding : "0",
      paddingLeft : "2%",
      "outline-width": 0,
      height : "100%",
      width : "40%"
  },
  deleteButton : {
      background : "rgb(200,73,20)",
      height : "100%",
      cursor : "pointer",
      width : "18%",
      border : "none",
      color : "white"
  },
  subsetSelect : {
      width : "100px"
  },
  variantSelect : {
      width : "100px"
  },
  sizeInput : {
      width : "100px"
  },
  fontNameSelect : {
      "width" : "150px"
  },
  fontProviderSelect : {
      "width" : "150px"
  }
};


},{}],8:[function(require,module,exports){
var ui = {},
    selectorRow = require('./views/selectorRow'),
    styles = require('./styles'),
    draggable = require('./vendor/draggable'),
    $mainContainer,
    $selectorContainer,
    $rightContainer,
    $addButton,
    $fontProviderSelect;

ui.providerContainer = document.createElement("div");

ui.selectElement = function (callback) {
  var all = $("body *").not("#fontmarkletDiv *").not("#fontmarkletDiv");

  all.on("mouseover.fontmarklet", function (event) {
    event.stopPropagation();

    $(this).css(styles.selectedElement);

    $(this).on('click.fontmarklet', function (event) {
      event.preventDefault();
      $(this).css(styles.unselectedElement);
      all.off('click.fontmarklet');
      all.off("mouseover.fontmarklet");
      all.off("mouseout.fontmarklet");
      callback(this);
    });
  });

  all.on("mouseout.fontmarklet", function (event) {
    event.stopPropagation();
    $(this).css(styles.unselectedElement);
    $(this).off('click.fontmarklet');
  });

};

ui.addSelectorRow = function (fontConfig) {
  $selectorContainer.append(selectorRow(fontConfig));
};

ui.init = function (controller, providers) {
  var provider, option;

  $mainContainer = $(document.createElement("div"));
  $mainContainer.attr("id", "fontmarkletDiv").css(styles.mainContainer);

  $selectorContainer = $(document.createElement("div"));
  $selectorContainer.css(styles.selectorContainer);

  $addButton = $(document.createElement("button"));
  $addButton
    .attr("id", "addFont")
    .html("Add Selector")
    .css(styles.addButton).click(controller.addButtonClick);

  $selectorContainer.append($addButton);
  $selectorContainer.append(document.createElement("br"));

  $rightContainer = $(document.createElement("div"));
  $rightContainer.css(styles.rightContainer);

  // creates the select element which allows the user to choose
  // a font provider (eg Google)
  $fontProviderSelect = $(document.createElement("select"));
  $fontProviderSelect
    .attr("class", "selectProvider")
    .css(styles.fontProviderSelect)
    .change(function () {
      controller.fontProviderSelectChange($(this).val());
    });

  // fill it with all the providers
  for(provider in providers) {
    if(providers.hasOwnProperty(provider)) {
      option = document.createElement("option");
      option.value = provider;
      option.innerHTML = provider;
      $fontProviderSelect.append(option);
    }
  }

  $rightContainer.append($fontProviderSelect);
  $rightContainer.append(ui.providerContainer);

  // make the whole thing draggable
  draggable($mainContainer);

  $mainContainer.append($selectorContainer);
  $mainContainer.append($rightContainer);

  //append the main container to the body, this should be done last, because of performance
  document.body.insertBefore($mainContainer.get(0), document.body.firstChild);
};

module.exports = ui;

},{"./styles":7,"./vendor/draggable":9,"./views/selectorRow":10}],9:[function(require,module,exports){
module.exports = function(el){
  (function ($) {
    $.fn.drags = function (opt) {
        var $el;
        opt = $.extend({handle : "", cursor : "move"}, opt);

        if(opt.handle === "") {
            $el = this;
        } else {
            $el = this.find(opt.handle);
        }

        return $el.css('cursor', opt.cursor).on("mousedown",function (e) {
            var $drag, z_idx, drg_h, drg_w, pos_y, pos_x;
            if(opt.handle === "") {
                $drag = $(this).addClass('draggable');
            } else {
                $drag = $(this).addClass('active-handle').parent().addClass('draggable');
            }
            z_idx = $drag.css('z-index');
            drg_h = $drag.outerHeight();
            drg_w = $drag.outerWidth();
            pos_y = $drag.offset().top + drg_h - e.pageY;
            pos_x = $drag.offset().left + drg_w - e.pageX;
            $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
                $('.draggable').offset({
                    top : e.pageY + pos_y - drg_h,
                    left : e.pageX + pos_x - drg_w
                }).on("mouseup", function () {
                        $(this).removeClass('draggable').css('z-index', z_idx);
                    });
            });
            //e.preventDefault(); // disable selection
        }).on("mouseup", function () {
                if(opt.handle === "") {
                    $(this).removeClass('draggable');
                } else {
                    $(this).removeClass('active-handle').parent().removeClass('draggable');
                }
            });
    };
  }(window.$));
  el.drags();
};

},{}],10:[function(require,module,exports){
var styles= require('../styles');

/**
 * Creates a new row with an input to set a jquery-selector, a delete-button
 * and a tickmark to check if this should be active or not
 *
 * @param fontConfig
 */
module.exports = function (fontConfig) {
  var selectorDiv = document.createElement("div"),
      checkbox = document.createElement("input"),
      selectorInput = document.createElement("input"),
      deleteButton = document.createElement("button"),
      selectButton = document.createElement("button"),
      id = fontConfig.id;

  $(selectorDiv)
    .attr("id", id + "_selectorDiv")
    .css(styles.selectorDiv)
    .click(function () {
      var controller = require('../controller');
      controller.selectorDivClick(id, selectorDiv);
    });

  $(checkbox)
    .attr("type", "checkbox")
    .attr("checked", "true")
    .click(function () {
      var controller = require('../controller');
      controller.activeCheckClick(id, checkbox);
    });
  selectorDiv.appendChild(checkbox);

  $(selectButton)
    .html("Select")
    .css(styles.selectButton)
    .click(function () {
      var controller = require('../controller');
      controller.selectButtonClick(id);
    });
  selectorDiv.appendChild(selectButton);

  $(selectorInput)
    .attr("id", id + "_selector")
    .attr("class", "selector")
    .css(styles.selectorInput)
    .attr("placeholder", "jQuery Selector")
    .val(fontConfig.selector || "")
    .on("keyup change", function () {
      var controller = require('../controller');
      controller.selectorInputChange(id, selectButton, this.value);
    });
  selectorDiv.appendChild(selectorInput);

  $(deleteButton)
    .html("Delete")
    .css(styles.deleteButton)
    .click(function () {
      var controller = require('../controller');
      controller.deleteButtonClick(id, selectorDiv);
    });
  selectorDiv.appendChild(deleteButton);
  return selectorDiv;
};


},{"../controller":3,"../styles":7}],11:[function(require,module,exports){
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

/**
 * Applies a webfont to its selector elements
 * This should be handled here and not in the provider object
 */
webfonts.applyFont = function(id, reset){
  try {
    var config = webfonts.fontConfigs[id];
    // select everything BUT our own elements
    var elements = $(config.selector).not("#fontmarkletDiv *");
    if(config.active && !reset){
      $(elements).css(config.css());
    }else{
      $(elements).css(config.reset());
    }
  } catch (e) {
    console.log("Fontmarklet: Invalid jQuery Selector");
  }
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
  if(activeConfig && activeConfig.id === id){
    activeConfig = null;
  }
  webfonts.fontConfigs[id] = undefined;
};

module.exports = webfonts;

},{"./ui":8}]},{},[1,2,3,4,5,6,7,8,9,10,11])
;