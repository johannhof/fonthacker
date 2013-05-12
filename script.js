(function () {
    var v = "1.8.3", script, done = false;

    function loadBookmarklet() {
        var $ = window.jQuery,
            mainContainer, leftContainer, rightContainer, addButton,
            idCounter = 0, items, fontConfigs = {}, activeConfig ,
        // user inputs
            fontNameSelect, sizeInput, subsetSelect, variantSelect,
            styles = {
                mainContainer : {
                    width : "600px",
                    "min-height" : "200px",
                    "background-color" : "rgba(200,200,200,0.3)",
                    left : 0,
                    bottom : 0,
                    position : "fixed",
                    zIndex : "999",
                    border : "1px solid gray"
                },
                leftContainer : {
                    width : "400px",
                    "min-height" : "200px",
                    float : "left",
                    "background-color" : "rgba(200,200,200,0.6)",
                    overflow : "auto"
                },
                selectedElement : {
                    borderColor : "grey",
                    borderWidth : "5px",
                    borderStyle : "dotted"
                },
                unselectedElement : {
                    borderColor : "",
                    borderWidth : "0",
                    borderStyle : ""
                },
                selectButton : {
                    background : "green"
                },
                selectButton_selected : {
                    background : ""
                },
                rightContainer : {
                    padding : "10px"
                },
                selectorDiv : {
                    "background-color" : "#DDDDDD",
                    padding : "5px",
                    cursor : "pointer"
                },
                selectorDiv_selected : {
                    "background-color" : "green"
                },
                selectorDiv_unselected : {
                    "background-color" : "#DDDDDD"
                },
                addButton : {
                    width : "90%",
                    margin : "8px",
                    border : "none",
                    background : "green",
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
            this.selector = "";
            this.name = items[fontNameSelect.value].family;
            this.size = sizeInput.value;
            this.variant = variantSelect.value;
            this.subset = subsetSelect.value;
            this.active = true;
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

        /**
         * Applies the FontConfiguration to all specified dom elements
         *
         * @param fontConfig
         */
        function applyFont(fontConfig) {
            if(fontConfig.active) {
                loadWebFont(fontConfig, function () {
                    $(fontConfig.selector).css("font-family", fontConfig.name);
                    if(fontConfig.size) {
                        $(fontConfig.selector).css("font-size", fontConfig.size);
                    }
                    if(fontConfig.variant) {
                        $(fontConfig.selector).css("font-weight", parseVariant(fontConfig.variant));
                        $(fontConfig.selector).css("font-style", parseStyle(fontConfig.variant));
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
        }

        function updateInputs(fontConfig) {
            $(fontNameSelect).children("option[title='" + fontConfig.name + "']").prop('selected', true);
            updateSubsets(items[$(fontNameSelect).val()]);
            updateVariants(items[$(fontNameSelect).val()]);
            $(subsetSelect).children("option[value='" + fontConfig.subset + "']").prop('selected', true);
            $(variantSelect).children("option[value='" + fontConfig.variant + "']").prop('selected', true);
        }

        function selectElement(callback) {
            var all = $("*");
            all.on("mouseenter.fontmarklet", function () {
                $(this).css(styles.selectedElement);
                $(this).on('click.fontmarklet', function () {
                    $(this).css(styles.unselectedElement);
                    all.off('click.fontmarklet');
                    all.off("mouseenter.fontmarklet");
                    all.off("mouseleave.fontmarklet");
                    callback(this);
                });
            });

            all.on("mouseleave.fontmarklet", function () {
                $(this).css(styles.unselectedElement);
                $(this).off('click.fontmarklet');
            });
        }

        /**
         * Creates a new row with an input to set a jquery-selector, a delete-button
         * and a tickmark to check if this should be active or not
         *
         * @param id
         * @returns {HTMLElement}
         */
        function createSelectorRow(id) {
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
                    $(this).siblings("div").css(styles.selectorDiv_unselected);
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
                .change(function () {
                    reset(fontConfigs[id]);
                    $(selectButton).css(styles.selectButton);
                    fontConfigs[id].selector = this.value;
                    applyFont(fontConfigs[id]);
                });
            selectorDiv.appendChild(selectorInput);

            $(selectButton).html("Select Element")
                .click(function () {
                    selectElement(function (element) {
                        reset(fontConfigs[id]);
                        $(selectButton).css(styles.selectButton_selected);
                        fontConfigs[id].selector = element;
                        applyFont(fontConfigs[id]);
                    });
                });
            selectorDiv.appendChild(selectButton);

            $(deleteButton).html("Delete")
                .click(function () {
                    $(selectorDiv).remove();
                    reset(fontConfigs[id]);
                    fontConfigs[id] = undefined;
                });
            selectorDiv.appendChild(deleteButton);
            return selectorDiv;
        }

        (function init() {
            var firstScriptTag, webFontScript;

            fontNameSelect = document.createElement("select");
            $(fontNameSelect).attr("class", "selectFont").css(styles.fontNameSelect).change(function () {
                var value = $(this).val();
                updateSubsets(items[value]);
                updateVariants(items[value]);
                fontConfigs[activeConfig].name = items[value].family;
                applyFont(fontConfigs[activeConfig]);
            });

            $.getJSON("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBRh3XwaTyAoCjBuAFQ6syYtRjRRdeJb4o&callback=?", function (data) {
                items = data.items;
                var i, max = items.length, option;
                for(i = 0; i < max; i++) {
                    option = document.createElement("option");
                    option.innerHTML = items[i].family;
                    option.title = items[i].family;
                    option.value = i;
                    fontNameSelect.appendChild(option);
                }
                updateSubsets(items[0]);
                updateVariants(items[0]);
            });

            webFontScript = document.createElement('script');
            webFontScript.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            webFontScript.type = 'text/javascript';
            webFontScript.async = 'true';

            firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(webFontScript, firstScriptTag);

            mainContainer = document.createElement("div");
            $(mainContainer).attr("id", "fontmarkletDiv").css(styles.mainContainer);

            ////////FILL LEFT CONTAINER////////////////

            leftContainer = document.createElement("div");
            $(leftContainer).css(styles.leftContainer);

            addButton = document.createElement("button");
            $(addButton).attr("id", "addFont")
                .html("Add")
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