var google = {},
    styles = require('../styles'),
    webfonts = require('../webfonts'),
    localstorage = require('../localstorage'),
    ui = require('../ui'),
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
        if(this.active) {
            // select everything BUT our own elements
            var elements = $(this.selector).not("#fontmarkletDiv *");
            elements.css("font-family", this.family);
            if(this.size) {
                elements.css("font-size", this.size);
            }
            if(this.weight) {
                elements.css("font-weight", this.weight);
            }
            if(this.style) {
                elements.css("font-style", this.style);
            }
        }
    };
    this.load = function (callback) {
        if(this.family) {
            //noinspection JSUnresolvedVariable,JSHint,JSLint
            WebFont.load({
                google : {
                    families : [this.family + ":" + (this.variant || "") + ":" + (this.subset || "")]
                },
                active : callback
            });
        }

    };
    this.reset = function () {
        $(this.selector).css("font-family", "");
        $(this.selector).css("font-size", "");
        $(this.selector).css("font-weight", "");
        $(this.selector).css("font-style", "");
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
        $(fontFamilySelect).attr("class", "selectFont")
            .css(styles.fontNameSelect)
            .change(function () {
                var value = $(this).val();
                googleUiModule.updateSubsets(fonts[value].subsets);
                googleUiModule.updateVariants(fonts[value].variants);
                if(webfonts.getActiveConfig()) {
                    webfonts.getActiveConfig().family = fonts[value].family;
                }
                webfonts.getActiveConfig().load(function () {
                    webfonts.getActiveConfig().applyFont();
                });
                localstorage.save();
            });

        mainDiv.appendChild(fontFamilySelect);

        subsetSelect = document.createElement("select");
        $(subsetSelect).attr("class", "subset")
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
        $(variantSelect).attr("class", "variant")
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
        $(sizeInput).attr("class", "fontSize")
            .css(styles.sizeInput)
            .attr("placeholder", "Font size")
            .change(function () {
                webfonts.getActiveConfig().size = this.value;
                webfonts.getActiveConfig().applyFont();
            });
        mainDiv.appendChild(sizeInput);

        ui.providerContainer.appendChild(mainDiv);

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
