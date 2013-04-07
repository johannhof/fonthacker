(function () {
    var v = "1.8.3", script, done = false;

    function loadBookmarklet() {
        var $ = window.jQuery, applyButton, addButton, mainContainer, changeContainer, wf, s, select, input;
        mainContainer = document.createElement("div");
        mainContainer.id = "fontmarkletDiv";
        mainContainer.setAttribute("align", "center");
        mainContainer.style.width = "500px";
        mainContainer.style.height = "200px";
        mainContainer.style.backgroundColor = "#cccccc";
        mainContainer.style.left = 0;
        mainContainer.style.bottom = 0;
        mainContainer.style.position = "fixed";
        mainContainer.style.zIndex = "999";

        changeContainer = document.createElement("div");

        applyButton = document.createElement("button");
        applyButton.id = "applyFont";
        applyButton.innerHTML = "Apply";
        mainContainer.appendChild(applyButton);

        addButton = document.createElement("button");
        addButton.id = "applyFont";
        addButton.innerHTML = "Add";
        mainContainer.appendChild(addButton);

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

        function createFontChanger() {
            var singleInputContainer = document.createElement("div");
            singleInputContainer.appendChild(document.createElement("input"));
            singleInputContainer.appendChild(select.cloneNode(true));
            changeContainer.appendChild(singleInputContainer);
        }

        mainContainer.appendChild(changeContainer);
        document.body.insertBefore(mainContainer, document.body.firstChild);

        $(addButton).click(createFontChanger);

        function loadFont(name, selector){
            //noinspection JSUnresolvedVariable,JSHint,JSLint
            WebFont.load({
                google : {
                    families : [ name ]
                },
                active : function () {
                    $(selector).css("font-family", name);
                }
            });
        }

        $(applyButton).click(function () {
            var i, nodes = changeContainer.childNodes, max = nodes.length;
            for(i = 0; i < max; i++) {
                loadFont($(nodes[i]).children("select").val(),$(nodes[i]).children("input").val());
            }
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
    }
    else {
        loadBookmarklet();
    }
}());