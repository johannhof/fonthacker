(function () {
    var v = "1.8.3", script, done = false;

    function loadBookmarklet() {
        var $ = window.jQuery, controller, ui, localstorage, webfonts,
            styles = {
                mainContainer : {
                    width : "600px",
                    "min-height" : "220px",
                    "background-color" : "rgba(200,200,200,0.3)",
                    position : "fixed",
                    zIndex : "999",
                    "box-shadow" : "1px 1px 5px black",
                    overflow : "visible"
                },
                leftContainer : {
                    width : "400px",
                    "min-height" : "200px",
                    float : "left",
                    overflow : "auto",
                    "border-right" : "1px solid lightgray"
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
                selectButton : {
                    background : "rgb(140,180,200)",
                    width : "30%",
                    margin : "8px",
                    "border-color" : "rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)",
                    color : "white",
                    "text-shadow" : "0 -1px 0 rgba(0, 0, 0, 0.25)",
                    "box-shadow" : "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)",
                    "border-radius" : "4px"
                },
                selectButton_selected : {
                    border : "1px solid rgb(143,200,0)"
                },
                rightContainer : {
                    padding : "10px",
                    "text-align" : "center"
                },
                selectorDiv : {
                    "background-color" : "rgba(255,255,255,0.6)",
                    padding : "5px",
                    cursor : "pointer"
                },
                selectorDiv_selected : {
                    "background-color" : "rgb(37,141,200)"
                },
                addButton : {
                    background : "rgb(143,200,0)",
                    width : "92%",
                    margin : "8px",
                    "border-color" : "rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)",
                    color : "white",
                    "text-shadow" : "0 -1px 0 rgba(0, 0, 0, 0.25)",
                    "box-shadow" : "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)",
                    "border-radius" : "4px"
                },
                deleteButton : {
                    background : "rgb(200,73,20)",
                    width : "20%",
                    margin : "8px",
                    "border-color" : "rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25)",
                    color : "white",
                    "text-shadow" : "0 -1px 0 rgba(0, 0, 0, 0.25)",
                    "box-shadow" : "inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05)",
                    "border-radius" : "4px"
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
                selectorInput : {
                    width : "100px"
                },
                fontNameSelect : {
                    "width" : "150px"
                },
                fontProviderSelect : {
                    "width" : "150px"
                }
            };

        controller = {
            addButtonClick : function () {
                var row = ui.createSelectorRow(webfonts.addFontConfig());
                $(row).click();
            },
            deleteButtonClick : function (id, selectorDiv) {
                $(selectorDiv).remove();
                webfonts.fontConfigs[id].reset();
                webfonts.deleteFontConfig(id);
                localstorage.save();
            },
            selectButtonClick : function (id) {
                ui.selectElement(function (element) {
                    webfonts.fontConfigs[id].reset();
                    $(this).css(styles.selectButton_selected);
                    webfonts.fontConfigs[id].selector = element;
                    webfonts.fontConfigs[id].applyFont();
                    localstorage.save();
                });
            },
            selectorInputChange : function (id, selectButton, value) {
                webfonts.fontConfigs[id].reset();
                $(selectButton).css(styles.selectButton);
                webfonts.fontConfigs[id].selector = value;
                webfonts.fontConfigs[id].applyFont();
                localstorage.save();
            },
            selectorDivClick : function (id, selectorDiv) {
                $(selectorDiv).css(styles.selectorDiv_selected);
                $(selectorDiv).siblings("div").css(styles.selectorDiv);
                webfonts.setActiveConfig(id);
                webfonts.fontConfigs[id].provider.ui.update(webfonts.fontConfigs[id]);
            },
            activeCheckClick : function (id, checkbox) {
                webfonts.fontConfigs[id].active = checkbox.checked;
                webfonts.fontConfigs[id].reset();
                webfonts.fontConfigs[id].applyFont();
            },
            fontProviderSelectChange : function (value) {
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
            }
        };

        ui = (function (controller) {
            var uiModule = {},
                mainContainer, leftContainer, rightContainer, addButton,
                fontProviderSelect;

            uiModule.providerContainer = document.createElement("div");

            /**
             * Creates a new row with an input to set a jquery-selector, a delete-button
             * and a tickmark to check if this should be active or not
             *
             * @param fontConfig
             */
            uiModule.createSelectorRow = function (fontConfig) {
                var selectorDiv = document.createElement("div"),
                    checkbox = document.createElement("input"),
                    selectorInput = document.createElement("input"),
                    deleteButton = document.createElement("button"),
                    selectButton = document.createElement("button"),
                    id = fontConfig.id;
                $(selectorDiv).attr("id", id + "_selectorDiv")
                    .css(styles.selectorDiv)
                    .click(function () {
                        controller.selectorDivClick(id, selectorDiv);
                    });
                $(checkbox).attr("type", "checkbox")
                    .attr("checked", "true")
                    .click(function () {
                        controller.activeCheckClick(id, checkbox);
                    });
                selectorDiv.appendChild(checkbox);

                $(selectorInput).attr("id", id + "_selector")
                    .attr("class", "selector")
                    .css(styles.selectorInput)
                    .attr("placeholder", "jQuery Selector")
                    .val(fontConfig.selector || "")
                    .change(function () {
                        controller.selectorInputChange(id, selectButton, this.value);
                    });
                selectorDiv.appendChild(selectorInput);

                $(selectButton).html("Select Element")
                    .css(styles.selectButton)
                    .click(function () {
                        controller.selectButtonClick(id);
                    });
                selectorDiv.appendChild(selectButton);

                $(deleteButton)
                    .html("Delete")
                    .css(styles.deleteButton)
                    .click(function () {
                        controller.deleteButtonClick(id, selectorDiv);
                    });
                selectorDiv.appendChild(deleteButton);
                leftContainer.appendChild(selectorDiv);
            };

            uiModule.selectElement = function (callback) {
                var all = $("body *").not("#fontmarkletDiv *");
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

            uiModule.init = function () {
                var provider, option;

                // Make draggable
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
                }($));

                mainContainer = document.createElement("div");
                $(mainContainer).attr("id", "fontmarkletDiv").css(styles.mainContainer);

                leftContainer = document.createElement("div");
                $(leftContainer).css(styles.leftContainer);

                addButton = document.createElement("button");
                $(addButton).attr("id", "addFont")
                    .html("Add Selector")
                    .css(styles.addButton).click(controller.addButtonClick);
                leftContainer.appendChild(addButton);
                leftContainer.appendChild(document.createElement("br"));

                rightContainer = document.createElement("div");
                $(rightContainer).css(styles.rightContainer);

                fontProviderSelect = document.createElement("select");
                $(fontProviderSelect).attr("class", "selectProvider")
                    .css(styles.fontProviderSelect)
                    .change(function () {
                        var value = $(this).val();
                        controller.fontProviderSelectChange(value);
                    });

                for(provider in webfonts.providers) {
                    if(webfonts.providers.hasOwnProperty(provider)) {
                        option = document.createElement("option");
                        option.value = provider;
                        option.innerHTML = provider;
                        fontProviderSelect.appendChild(option);
                    }
                }

                rightContainer.appendChild(fontProviderSelect);
                rightContainer.appendChild(uiModule.providerContainer);

                $(mainContainer).drags();
                mainContainer.appendChild(leftContainer);
                mainContainer.appendChild(rightContainer);
                //append the main container to the body, this should be done last, because of performance
                document.body.insertBefore(mainContainer, document.body.firstChild);
            };

            return uiModule;
        }(controller));

        localstorage = (function () {
            var localstorageModule = {};

            localstorageModule.save = function () {
                var tempConfig = [], conf;
                for(conf in webfonts.fontConfigs) {
                    if(webfonts.fontConfigs.hasOwnProperty(conf) && webfonts.fontConfigs[conf]) {
                        tempConfig.push(webfonts.fontConfigs[conf].provider.pack(webfonts.fontConfigs[conf]));
                    }
                }
                localStorage.fontmarkletFontConfigs = JSON.stringify(tempConfig);
            };

            localstorageModule.load = function () {
                var name, config, tempConfig;
                if(localStorage.fontmarkletFontConfigs) {
                    tempConfig = JSON.parse(localStorage.fontmarkletFontConfigs);
                    for(name in tempConfig) {
                        if(tempConfig.hasOwnProperty(name)) {
                            config = webfonts.providers[tempConfig[name].provider].unpack(tempConfig[name]);
                            ui.createSelectorRow(config);
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

            return localstorageModule;
        }());

        webfonts = (function () {
            var fontsModule = {}, activeConfig, activeProvider;

            fontsModule.providers = {};

            fontsModule.fontConfigs = {};

            fontsModule.idCounter = Math.round(Math.random() * 100000);

            fontsModule.loadRequirements = function (callback) {
                var modulesDone = 0, provider;

                function check(module) {
                    module.ui.init();
                    module.ui.hide();
                    if(--modulesDone === 0) {
                        callback();
                    }
                }

                for(provider in fontsModule.providers) {
                    if(fontsModule.providers.hasOwnProperty(provider)) {
                        if(fontsModule.providers[provider].loadRequirements) {
                            modulesDone++;
                            fontsModule.providers[provider].loadRequirements(check);
                        }
                    }
                }
            };

            fontsModule.loadWebFont = function (config, callback) {
                config.provider.loadWebFont(config, callback);
            };

            fontsModule.setActiveProvider = function (name) {
                if(activeProvider) {
                    activeProvider.ui.hide();
                }
                activeProvider = fontsModule.providers[name];
                activeProvider.ui.show();
            };

            fontsModule.getActiveProvider = function () {
                return activeProvider;
            };

            fontsModule.setActiveConfig = function (id) {
                activeConfig = fontsModule.fontConfigs[id];
            };

            fontsModule.getActiveConfig = function () {
                return activeConfig;
            };

            fontsModule.addFontConfig = function () {
                var id = fontsModule.idCounter++;
                fontsModule.fontConfigs[id] = new activeProvider.FontConfiguration(id);
                fontsModule.setActiveConfig(id);
                return fontsModule.fontConfigs[id];
            };

            fontsModule.deleteFontConfig = function (id) {
                fontsModule.fontConfigs[id] = undefined;
            };

            return fontsModule;
        }());

        webfonts.providers.google = (function () {
            var googleModule = {}, fonts, mainDiv,
                fontFamilySelect, sizeInput, subsetSelect, variantSelect;

            googleModule.name = "google";

            googleModule.pack = function (config) {
                var packed = $.extend({}, config);
                packed.provider = googleModule.name;
                packed.selector = config.selector.nodeName || config.selector;
                return packed;
            };

            googleModule.unpack = function (packed) {
                var config = new googleModule.FontConfiguration(packed.id);
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

            googleModule.FontConfiguration = function (id) {
                this.id = id;
                this.provider = googleModule;
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

            googleModule.ui = (function () {
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
                    new googleModule.FontConfiguration(-1).load();
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

            googleModule.loadRequirements = function (callback) {
                var webFontScript = document.createElement('script'), firstScriptTag;
                webFontScript.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
                webFontScript.type = 'text/javascript';
                webFontScript.async = 'true';
                webFontScript.onload = function () {
                    $.getJSON("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBRh3XwaTyAoCjBuAFQ6syYtRjRRdeJb4o&callback=?",
                        function (data) {
                            fonts = data.items;
                            callback(googleModule);
                        });
                };

                firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(webFontScript, firstScriptTag);
            };

            return googleModule;
        }());

        webfonts.providers.local = (function () {
            var localModule = {}, fonts, mainDiv,
                fontFamilySelect, sizeInput;

            localModule.name = "local";

            localModule.pack = function (config) {
                var packed = $.extend({}, config);
                packed.provider = localModule.name;
                packed.selector = config.selector.nodeName || config.selector;
                return packed;
            };

            localModule.unpack = function (packed) {
                var config = new localModule.FontConfiguration(packed.id);
                config.provider = webfonts.providers[packed.provider];
                config.selector = packed.selector;
                config.family = packed.family;
                config.size = packed.size;
                config.active = packed.active;
                return config;
            };

            localModule.FontConfiguration = function (id) {
                this.id = id;
                this.provider = localModule;
                this.selector = "";
                this.family = fonts[$(fontFamilySelect).val()];
                this.size = sizeInput.value;
                this.active = true;
                this.applyFont = function () {
                    if(this.active) {
                        // select everything BUT our own elements
                        var elements = $(this.selector).not("#fontmarkletDiv *");
                        elements.css("font-family", this.family);
                        if(this.size) {
                            elements.css("font-size", this.size);
                        }
                    }
                };
                this.load = function (callback) {
                    callback();
                };
                this.reset = function () {
                    $(this.selector).css("font-family", "");
                    $(this.selector).css("font-size", "");
                };
            };

            localModule.ui = (function () {
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
                    $(fontFamilySelect).attr("class", "selectFont")
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
                    $(sizeInput).attr("class", "fontSize")
                        .css(styles.sizeInput)
                        .attr("placeholder", "Font size in px")
                        .change(function () {
                            webfonts.getActiveConfig().size = this.value;
                            webfonts.getActiveConfig().applyFont();
                        });
                    mainDiv.appendChild(sizeInput);

                    ui.providerContainer.appendChild(mainDiv);
                };


                localUiModule.update = function (fontConfig) {
                    $(fontFamilySelect).children("option[title='" + fontConfig.family + "']").prop('selected', true);
                };

                return localUiModule;
            }());

            localModule.loadRequirements = function (callback) {
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
                embed.setAttribute('src', 'http://johannhof.github.io/fontmarklet/FontList.swf');
                document.body.appendChild(embed);
                callback(localModule);
            };

            return localModule;
        }());

        ui.init();
        webfonts.loadRequirements(function () {
            webfonts.setActiveProvider("google");
            localstorage.load();
        });
    }

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
}());