(function () {
    var v = "1.8.3", script, done = false;

    function loadBookmarklet() {
        var $ = window.jQuery, applyButton, addButton, mainContainer,
            changeContainer, wf, s, select, input, items, subsetSelect, variantSelect;

        function parseVariant(variant) {
            switch(variant) {
                case "regular":
                    return "normal";
                case "italic":
                    return 400;
                default:
                    var test = parseInt(variant, 10)
                    return test;
            }
        }

        function parseStyle(variant) {
            if(variant.indexOf("regular") !== -1) {
                return "normal";
            }
            if(variant.indexOf("italic") !== -1) {
                return "italic";
            }
            return "normal";
        }

        function applyFonts() {
            var i, nodes = changeContainer.childNodes, max = nodes.length;
            for(i = 0; i < max; i++) {
                loadFont(items[$(nodes[i]).children(".selectFont").val()].family, $(nodes[i]).children(".selector").val(), $(nodes[i]).children(".fontSize").val(), $(nodes[i]).children(".variant").val(), $(nodes[i]).children(".subset").val());
            }
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

        function createSubsets(font) {
            var i, numberOfSubsets = font.subsets.length, newSubsetSelect = document.createElement("select"), option;
            newSubsetSelect.className = "subset";
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
                selectClone = select.cloneNode(true);
            $(selectorInput).attr("class", "selector").attr("placeholder", "jQuery Selector");
            $(sizeInput).attr("class", "fontSize").attr("placeholder", "Font size in px");
            singleInputContainer.appendChild(selectorInput);
            singleInputContainer.appendChild(sizeInput);
            singleInputContainer.appendChild(selectClone);
            $(selectClone).change(function () {
                $(this).parent().children(".subset").replaceWith(createSubsets(items[$(this).val()]));
                $(this).parent().children(".variant").replaceWith(createVariants(items[$(this).val()]));
                applyFonts();
            });
            singleInputContainer.appendChild(subsetSelect.cloneNode(true));
            singleInputContainer.appendChild(variantSelect.cloneNode(true));
            changeContainer.appendChild(singleInputContainer);
        }

        mainContainer = document.createElement("div");
        mainContainer.id = "fontmarkletDiv";
        mainContainer.setAttribute("align", "center");
        $(mainContainer).css({
            width : "600px",
            height : "200px",
            "background-color" : "rgba(200,200,200,0.7)",
            left : 0,
            bottom : 0,
            position : "fixed",
            zIndex : "999",
            border : "1px solid gray"
        });

        addButton = document.createElement("button");
        addButton.id = "applyFont";
        addButton.innerHTML = "Add";
        $(addButton).css({
            margin : "5px",
            border : "none",
            background : "grey",
            padding : "5px 30px",
            color : "white",
            "border-radius" : "4px"
        });
        mainContainer.appendChild(addButton);
        changeContainer = document.createElement("div");

        mainContainer.appendChild(changeContainer);

        /* disabled for now
         applyButton = document.createElement("button");

         applyButton.id = "applyFont";
         applyButton.innerHTML = "Apply";
         $(applyButton).css({
         border : "none",
         background : "#05aa05",
         padding : "5px 30px",
         color : "white",
         "border-radius" : "4px"
         });
         mainContainer.appendChild(applyButton);
         */

        wf = document.createElement('script');
        wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        s = document.getElementsByTagName('script')[0];

        s.parentNode.insertBefore(wf, s);

        select = document.createElement("select");
        select.className = "selectFont";
        subsetSelect = document.createElement("select");
        subsetSelect.className = "subset";
        variantSelect = document.createElement("select");
        variantSelect.className = "variant";

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

        document.body.insertBefore(mainContainer, document.body.firstChild);

        $(addButton).click(createFontChanger);
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