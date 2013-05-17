(function () {
    var v = "1.8.3", script, done = false;

    function loadBookmarklet() {
        var $ = window.jQuery,
            mainContainer, leftContainer, rightContainer, addButton,
            idCounter = 0, googleFonts, fontConfigs = {}, activeConfig,
        // user inputs
            fontNameSelect, sizeInput, subsetSelect, variantSelect,
            styles = {
                mainContainer : {
                    width : "600px",
                    "min-height" : "220px",
                    "background-color" : "rgba(200,200,200,0.3)",
                    position : "fixed",
                    zIndex : "999",
                    "box-shadow" : "1px 1px 5px black",
                    overflow: "visible"
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
                }
            };

        /**
         *
         * @constructor
         */
        function FontConfiguration() {
            var object = {};
            object.selector = "";
            object.name = googleFonts[fontNameSelect.value].family;
            object.size = sizeInput.value;
            object.variant = variantSelect.value;
            object.subset = subsetSelect.value;
            object.active = true;
            return object;
        }

        /**
         * Parses the font weight from a given variant string.
         *
         * @param {string} variant
         * @returns {*} a number or the string "normal"
         */
        function parseVariant(variant) {
            switch(variant) {
                case "regular":
                    return "normal";
                case "italic":
                    return 400;
                default:
                    var test = parseInt(variant, 10);
                    return test;
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

        /**
         * Loads a specified webfont from a server, then executes a callback.
         *
         * @param config
         * @param callback
         */
        function loadWebFont(config, callback) {
            if(config.name) {
                //noinspection JSUnresolvedVariable,JSHint,JSLint
                WebFont.load({
                    google : {
                        families : [config.name + ":" + (config.variant || "") + ":" + (config.subset || "")]
                    },
                    active : callback
                });
            }
        }

        function saveToLocalStorage() {
            var tempConfig = $.extend(true, {}, fontConfigs), conf;
            for(conf in tempConfig) {
                if(tempConfig.hasOwnProperty(conf)) {
                    tempConfig[conf].selector = tempConfig[conf].selector.nodeName || tempConfig[conf].selector;
                }
            }
            localStorage.fontmarkletFontConfigs = JSON.stringify(tempConfig);
        }

        /**
         * Applies the FontConfiguration to all specified dom elements
         *
         * @param fontConfig
         */
        function applyFont(fontConfig) {
            saveToLocalStorage();
            if(fontConfig.active) {
                // select everything BUT the our own elements
                var elements = $(fontConfig.selector).not("#fontmarkletDiv *");
                loadWebFont(fontConfig, function () {
                    elements.css("font-family", fontConfig.name);
                    if(fontConfig.size) {
                        elements.css("font-size", fontConfig.size);
                    }
                    if(fontConfig.variant) {
                        elements.css("font-weight", parseVariant(fontConfig.variant));
                        elements.css("font-style", parseStyle(fontConfig.variant));
                    }
                });
            }
        }

        function reset(fontConfig) {
            $(fontConfig.selector).css("font-family", "");
            if(fontConfig.size) {
                $(fontConfig.selector).css("font-size", "");
            }
            if(fontConfig.variant) {
                $(fontConfig.selector).css("font-weight", "");
                $(fontConfig.selector).css("font-style", "");
            }
        }

        function updateSubsets(font) {
            var i, numberOfSubsets = font.subsets.length, option;
            $(subsetSelect).empty();
            for(i = 0; i < numberOfSubsets; i++) {
                option = document.createElement("option");
                option.innerHTML = font.subsets[i];
                option.value = font.subsets[i];
                subsetSelect.appendChild(option);
            }
            if(fontConfigs[activeConfig]) {
                fontConfigs[activeConfig].subset = font.subsets[0];
            }
        }

        function updateVariants(font) {
            var i, numberOfVariants = font.variants.length, option;
            $(variantSelect).empty();
            for(i = 0; i < numberOfVariants; i++) {
                option = document.createElement("option");
                option.innerHTML = font.variants[i];
                option.value = font.variants[i];
                variantSelect.appendChild(option);
            }
            if(fontConfigs[activeConfig]) {
                fontConfigs[activeConfig].variant = font.variants[0];
            }
        }

        function updateInputs(fontConfig) {
            $(fontNameSelect).children("option[title='" + fontConfig.name + "']").prop('selected', true);
            updateSubsets(googleFonts[$(fontNameSelect).val()]);
            updateVariants(googleFonts[$(fontNameSelect).val()]);
            $(subsetSelect).children("option[value='" + fontConfig.subset + "']").prop('selected', true);
            $(variantSelect).children("option[value='" + fontConfig.variant + "']").prop('selected', true);
        }


        function selectElement(callback) {
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
        }

        /**
         * Creates a new row with an input to set a jquery-selector, a delete-button
         * and a tickmark to check if this should be active or not
         *
         * @param id
         * @param fontConfig
         * @returns {HTMLElement}
         */
        function createSelectorRow(id, fontConfig) {
            fontConfig = fontConfig || {};
            var selectorDiv = document.createElement("div"),
                checkbox = document.createElement("input"),
                selectorInput = document.createElement("input"),
                deleteButton = document.createElement("button"),
                selectButton = document.createElement("button");
            $(selectorDiv).attr("id", id + "_selectorDiv")
                .css(styles.selectorDiv)
                .click(function () {
                    activeConfig = id;
                    $(this).css(styles.selectorDiv_selected);
                    $(this).siblings("div").css(styles.selectorDiv);
                    updateInputs(fontConfigs[id]);
                });
            $(checkbox).attr("type", "checkbox")
                .attr("checked", "true")
                .click(function () {
                    fontConfigs[id].active = this.checked;
                    reset(fontConfigs[id]);
                    applyFont(fontConfigs[id]);
                });
            selectorDiv.appendChild(checkbox);

            $(selectorInput).attr("id", id + "_selector")
                .attr("class", "selector")
                .css(styles.selectorInput)
                .attr("placeholder", "jQuery Selector")
                .val(fontConfig.selector || "")
                .change(function () {
                    reset(fontConfigs[id]);
                    $(selectButton).css(styles.selectButton);
                    fontConfigs[id].selector = this.value;
                    applyFont(fontConfigs[id]);
                });
            selectorDiv.appendChild(selectorInput);

            $(selectButton).html("Select Element")
                .css(styles.selectButton)
                .click(function () {
                    selectElement(function (element) {
                        reset(fontConfigs[id]);
                        $(selectButton).css(styles.selectButton_selected);
                        fontConfigs[id].selector = element;
                        applyFont(fontConfigs[id]);
                    });
                });
            selectorDiv.appendChild(selectButton);

            $(deleteButton).html("Delete").css(styles.deleteButton)
                .click(function () {
                    $(selectorDiv).remove();
                    reset(fontConfigs[id]);
                    fontConfigs[id] = undefined;
                    saveToLocalStorage();
                });
            selectorDiv.appendChild(deleteButton);
            return selectorDiv;
        }

        function loadFromLocalStorage() {
            var conf;
            if(localStorage.fontmarkletFontConfigs) {
                fontConfigs = JSON.parse(localStorage.fontmarkletFontConfigs);
                for(conf in fontConfigs) {
                    if(fontConfigs.hasOwnProperty(conf)) {
                        leftContainer.appendChild(createSelectorRow(idCounter++, fontConfigs[conf]));
                        applyFont(fontConfigs[conf]);
                    }
                }
            }
        }

        (function init() {

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
                        var $drag;
                        if(opt.handle === "") {
                            $drag = $(this).addClass('draggable');
                        } else {
                            $drag = $(this).addClass('active-handle').parent().addClass('draggable');
                        }
                        var z_idx = $drag.css('z-index'),
                            drg_h = $drag.outerHeight(),
                            drg_w = $drag.outerWidth(),
                            pos_y = $drag.offset().top + drg_h - e.pageY,
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
            }(jQuery));

            var firstScriptTag, webFontScript;

            fontNameSelect = document.createElement("select");
            $(fontNameSelect).attr("class", "selectFont")
                .css(styles.fontNameSelect)
                .change(function () {
                    var value = $(this).val();
                    updateSubsets(googleFonts[value]);
                    updateVariants(googleFonts[value]);
                    fontConfigs[activeConfig].name = googleFonts[value].family;
                    applyFont(fontConfigs[activeConfig]);
                });

            $.getJSON("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBRh3XwaTyAoCjBuAFQ6syYtRjRRdeJb4o&callback=?", function (data) {
                googleFonts = data.items;
                var i, max = googleFonts.length, option;
                for(i = 0; i < max; i++) {
                    option = document.createElement("option");
                    option.innerHTML = googleFonts[i].family;
                    option.title = googleFonts[i].family;
                    option.value = i;
                    fontNameSelect.appendChild(option);
                }
                updateSubsets(googleFonts[0]);
                updateVariants(googleFonts[0]);
            });

            webFontScript = document.createElement('script');
            webFontScript.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            webFontScript.type = 'text/javascript';
            webFontScript.async = 'true';
            webFontScript.onload = loadFromLocalStorage;

            firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(webFontScript, firstScriptTag);

            mainContainer = document.createElement("div");
            $(mainContainer).attr("id", "fontmarkletDiv").css(styles.mainContainer);

            ////////FILL LEFT CONTAINER////////////////

            leftContainer = document.createElement("div");
            $(leftContainer).css(styles.leftContainer);

            addButton = document.createElement("button");
            $(addButton).attr("id", "addFont")
                .html("Add Selector")
                .css(styles.addButton).click(function () {
                    var id = idCounter++, row;
                    fontConfigs[id] = new FontConfiguration();
                    row = createSelectorRow(id);
                    leftContainer.appendChild(row);
                    $(row).click();
                });
            leftContainer.appendChild(addButton);
            leftContainer.appendChild(document.createElement("br"));

            ///////FILL RIGHT CONTAINER//////////////

            rightContainer = document.createElement("div");
            $(rightContainer).css(styles.rightContainer);

            rightContainer.appendChild(fontNameSelect);

            subsetSelect = document.createElement("select");
            $(subsetSelect).attr("class", "subset")
                .css(styles.subsetSelect)
                .change(function () {
                    fontConfigs[activeConfig].subset = this.value;
                    applyFont(fontConfigs[activeConfig]);
                });
            rightContainer.appendChild(subsetSelect);

            variantSelect = document.createElement("select");
            $(variantSelect).attr("class", "variant")
                .css(styles.variantSelect)
                .change(function () {
                    fontConfigs[activeConfig].variant = this.value;
                    applyFont(fontConfigs[activeConfig]);
                });
            rightContainer.appendChild(variantSelect);

            sizeInput = document.createElement("input");
            $(sizeInput).attr("class", "fontSize")
                .css(styles.sizeInput)
                .attr("placeholder", "Font size in px")
                .change(function () {
                    fontConfigs[activeConfig].size = this.value;
                    applyFont(fontConfigs[activeConfig]);
                });
            rightContainer.appendChild(sizeInput);

            $(mainContainer).drags();
            mainContainer.appendChild(leftContainer);
            mainContainer.appendChild(rightContainer);
            //append the main container to the body, this must be done last, because of performance
            document.body.insertBefore(mainContainer, document.body.firstChild);
        }());
    }

    if(window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        script = document.createElement("script");
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
            //noinspection JSLint,JSValidateTypes,JSHint
            if(!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                loadBookmarklet();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    else {
        loadBookmarklet();
    }
}());