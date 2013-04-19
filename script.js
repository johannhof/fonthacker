(function () {
    var v = "1.8.3", script, done = false;

    function loadBookmarklet() {
        var $ = window.jQuery, addButton, mainContainer, changeContainer, select, input, items;

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
         * Loads the specified font from Google Web Fonts
         *
         * @param {string} name the name of the font
         * @param {string} selector the jquery selector pointing to the item that should receive the new fontface
         * @param {number,optional} [size] the size of the font
         * @param {string,optional} [variant]
         * @param {string,optional} [subset] the subset of the font
         */
        function loadFont(name, selector, size, variant, subset) {
            var options = ":" + (variant || "") + ":" + (subset || "");
            //noinspection JSUnresolvedVariable,JSHint,JSLint
            WebFont.load({
                google : {
                    families : [ name + options ]
                },
                active : function () {
                    $(selector).css("font-family", name);
                    if(size) {
                        $(selector).css("font-size", size + "px");
                    }
                    if(variant) {
                        $(selector).css("font-weight", parseVariant(variant));
                        $(selector).css("font-style", parseStyle(variant));
                    }
                }
            });
        }

        function applyFonts() {
            var i, nodes = changeContainer.childNodes, max = nodes.length;
            for(i = 0; i < max; i++) {
                loadFont(items[$(nodes[i]).children(".selectFont").val()].family, $(nodes[i]).children(".selector").val(), $(nodes[i]).children(".fontSize").val(), $(nodes[i]).children(".variant").val(), $(nodes[i]).children(".subset").val());
            }
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

        function createFontChanger() {
            var singleInputContainer = document.createElement("div"),
                selectorInput = document.createElement("input"),
                sizeInput = document.createElement("input"),
                selectClone = select.cloneNode(true),
                subsetSelect = document.createElement("select"),
                variantSelect = document.createElement("select");

            $(subsetSelect).attr("class", "subset").css("width", "100px");
            $(variantSelect).attr("class", "variant").css("width", "100px");

            $(selectorInput).attr("class", "selector").css("width", "100px").attr("placeholder", "jQuery Selector").change(applyFonts);
            $(sizeInput).attr("class", "fontSize").css("width", "100px").attr("placeholder", "Font size in px").change(applyFonts);
            singleInputContainer.appendChild(selectorInput);
            singleInputContainer.appendChild(sizeInput);
            singleInputContainer.appendChild(selectClone);
            $(selectClone).change(function () {
                $(this).parent().children(".subset").replaceWith(createSubsets(items[$(this).val()]));
                $(this).parent().children(".variant").replaceWith(createVariants(items[$(this).val()]));
                applyFonts();
            });
            singleInputContainer.appendChild(subsetSelect);
            singleInputContainer.appendChild(variantSelect);
            changeContainer.appendChild(singleInputContainer);
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
            $(mainContainer).attr("align", "center").attr("id", "fontmarkletDiv").css({
                width : "600px",
                "min-height" : "200px",
                "background-color" : "rgba(200,200,200,0.7)",
                left : 0,
                bottom : 0,
                position : "fixed",
                zIndex : "999",
                border : "1px solid gray"
            });

            addButton = document.createElement("button");
            $(addButton).attr("id", "addFont").html("Add").css({
                margin : "5px",
                border : "none",
                background : "grey",
                padding : "5px 30px",
                color : "white",
                "border-radius" : "4px"
            }).click(createFontChanger);
            mainContainer.appendChild(addButton);

            changeContainer = document.createElement("div");
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