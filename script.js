(function () {
    var v = "1.8.3", script, done = false;

    function loadBookmarklet() {
        var $ = window.jQuery,
            idCounter = 0, addButton, mainContainer, selectorContainer, changeContainer, select, input, items,
            fontConfigs = {}, activeConfig , singleInputContainer = document.createElement("div"),
            sizeInput = document.createElement("input"),
            subsetSelect = document.createElement("select"),
            variantSelect = document.createElement("select");


        function FontConfiguration() {
            this.selector = "";
            this.name = select.value;
            this.size = sizeInput.value;
            this.variant = variantSelect.value;
            this.subset = subsetSelect.value;
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

        function applyFonts(id) {
            loadWebFont(fontConfigs[id], function () {
                $(fontConfigs[id].selector).css("font-family", fontConfigs[id].name);
                if(fontConfigs[id].size) {
                    $(fontConfigs[id].selector).css("font-size", fontConfigs[id].size + "px");
                }
                if(fontConfigs[id].variant) {
                    $(fontConfigs[id].selector).css("font-weight", parseVariant(fontConfigs[id].variant));
                    $(fontConfigs[id].selector).css("font-style", parseStyle(fontConfigs[id].variant));
                }
            });
        }

        function createSubsets(font) {
            var i, numberOfSubsets = font.subsets.length, newSubsetSelect = document.createElement("select"), option;
            newSubsetSelect.className = "subset";
            $(newSubsetSelect).attr("class", "subset").css("width", "100px");
            for(i = 0; i < numberOfSubsets; i++) {
                option = document.createElement("option");
                option.innerHTML = font.subsets[i];
                newSubsetSelect.appendChild(option);
            }
            return newSubsetSelect;
        }

        function createVariants(font) {
            var i, numberOfVariants = font.variants.length, newVariantSelect = document.createElement("select"), option;
            newVariantSelect.className = "variant";
            $(newVariantSelect).attr("class", "variant").css("width", "100px");
            for(i = 0; i < numberOfVariants; i++) {
                option = document.createElement("option");
                option.innerHTML = font.variants[i];
                newVariantSelect.appendChild(option);
            }
            return newVariantSelect;
        }

        function createSelectorRow(id) {
            var div = document.createElement("div"),
                checkbox = document.createElement("input"),
                selectorInput = document.createElement("input"),
                deleteButton = document.createElement("button");
            $(checkbox).attr("type", "checkbox").attr("checked", "true");
            $(div).attr("id", id + "_selectorDiv")
                .css({
                    background : "green",
                    padding : "5px",
                    cursor : "pointer"
                }).click(function () {
                    activeConfig = id;
                    $(this).css("background-color", "green");
                    $(this).siblings("div").css("background-color", "#DDDDDD");
                });
            $(selectorInput).attr("id", id + "_selector")
                .attr("class", "selector")
                .css("width", "100px")
                .attr("placeholder", "jQuery Selector")
                .change(function () {
                    fontConfigs[id].selector = this.value;
                    applyFonts(id);
                });
            $(deleteButton).html("Delete");
            div.appendChild(checkbox);
            div.appendChild(selectorInput);
            div.appendChild(deleteButton);
            return div;
        }

        (function init() {
            var s, webFontScript;
            select = document.createElement("select");
            $(select).attr("class", "selectFont").css("width", "150px");

            $.getJSON("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBRh3XwaTyAoCjBuAFQ6syYtRjRRdeJb4o&callback=?", function (data) {
                items = data.items;
                var i, max = items.length, option;
                for(i = 0; i < max; i++) {
                    option = document.createElement("option");
                    option.innerHTML = items[i].family;
                    option.value = i;
                    select.appendChild(option);
                }
            });

            webFontScript = document.createElement('script');
            webFontScript.src = ('https:' === document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
            webFontScript.type = 'text/javascript';
            webFontScript.async = 'true';

            s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(webFontScript, s);

            mainContainer = document.createElement("div");
            $(mainContainer).attr("id", "fontmarkletDiv").css({
                width : "600px",
                "min-height" : "200px",
                "background-color" : "rgba(200,200,200,0.3)",
                left : 0,
                bottom : 0,
                position : "fixed",
                zIndex : "999",
                border : "1px solid gray"
            });

            selectorContainer = document.createElement("div");
            $(selectorContainer).attr("id", "fontmarkletDiv").css({
                width : "250px",
                "min-height" : "200px",
                float : "left",
                "background-color" : "rgba(200,200,200,0.6)",
                overflow : "auto"
            });
            mainContainer.appendChild(selectorContainer);

            addButton = document.createElement("button");
            $(addButton).attr("id", "addFont")
                .html("Add")
                .css({
                    width : "90%",
                    margin : "8px",
                    border : "none",
                    background : "green",
                    color : "white"
                }).click(function () {
                    var id = idCounter++, row;
                    fontConfigs[id] = new FontConfiguration();
                    row = createSelectorRow(id);
                    selectorContainer.appendChild(row);
                    $(row).click();
                });
            selectorContainer.appendChild(addButton);
            selectorContainer.appendChild(document.createElement("br"));

            changeContainer = document.createElement("div");

            $(subsetSelect).attr("class", "subset").css("width", "100px");
            $(variantSelect).attr("class", "variant").css("width", "100px");

            $(sizeInput).attr("class", "fontSize")
                .css("width", "100px")
                .attr("placeholder", "Font size in px")
                .change(function () {
                    fontConfigs[activeConfig].size = this.value;
                });
            singleInputContainer.appendChild(sizeInput);
            singleInputContainer.appendChild(select);
            $(select).change(function () {
                var value = $(this).val();
                $(this).siblings(".subset").replaceWith(createSubsets(items[value]));
                $(this).siblings(".variant").replaceWith(createVariants(items[value]));
                fontConfigs[activeConfig].name = items[value].family;
                applyFonts(activeConfig);
            });
            singleInputContainer.appendChild(subsetSelect);
            singleInputContainer.appendChild(variantSelect);
            changeContainer.appendChild(singleInputContainer);
            mainContainer.appendChild(changeContainer);

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