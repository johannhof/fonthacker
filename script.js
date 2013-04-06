(function () {
    var v = "1.8.3", script, done = false;

    function loadBookmarklet() {
        var $ = window.jQuery, applyButton, addButton, divTag, wf, s, select,input;
        divTag = document.createElement("div");
        divTag.id = "fontmarkletDiv";
        divTag.setAttribute("align", "center");
        divTag.style.width = "200px";
        divTag.style.height = "200px";
        divTag.style.backgroundColor = "#cccccc";
        divTag.style.left = 0;
        divTag.style.bottom = 0;
        divTag.style.position = "fixed";
        divTag.style.zIndex = "999";

        applyButton = document.createElement("button");
        applyButton.id = "applyFont";
        applyButton.innerHTML = "Apply";
        divTag.appendChild(applyButton);

        addButton = document.createElement("button");
        addButton.id = "applyFont";
        addButton.innerHTML = "Add";
        divTag.appendChild(addButton);

        wf = document.createElement('script');
        wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);

        select = document.createElement("select");

        $.getJSON("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBRh3XwaTyAoCjBuAFQ6syYtRjRRdeJb4o&callback=?", function (data) {
            var i, items = data.items, max = items.length, option;
            for(i = 0; i < max; i++) {
                option = document.createElement("option");
                option.innerHTML = items[i].family;
                select.appendChild(option);
            }
        });

        function createFontChanger(){
            divTag.appendChild(document.createElement("input"));
            divTag.appendChild(select.cloneNode(true));
        }

        document.body.insertBefore(divTag, document.body.firstChild);

        $(addButton).click(createFontChanger);

        //TODO: Load in a loop for each fontchanger
        $(applyButton).click(function () {
            //noinspection JSUnresolvedVariable,JSHint,JSLint
            WebFont.load({
                google : {
                    families : [ $(select).val() ]
                },
                active : function () {
                    $("body *").css("font-family", $(select).val());
                }
            });
        });
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
    } else {
        loadBookmarklet();
    }
}());