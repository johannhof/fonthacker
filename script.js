(function () {
    var v, divTag, button, wf, s, done;

    v = "1.8.3";

    if(window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        var script;
        done = false;
        script = document.createElement("script");
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
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

    function loadBookmarklet() {
        divTag = document.createElement("div");
        divTag.id = "fontmarkletDiv";
        divTag.setAttribute("align", "center");
        divTag.style.width = "150px";
        divTag.style.height = "150px";
        divTag.style.backgroundColor = "#cccccc";
        divTag.style.left = 0;
        divTag.style.bottom = 0;
        divTag.style.position = "fixed";
        divTag.style.zIndex = "999";

        document.body.insertBefore(divTag, document.body.firstChild);

        button = document.createElement("button");
        button.id = "applyFont";
        button.innerHTML = "Click Me!";

        document.getElementById("fontmarkletDiv").appendChild(button);

        wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);

        var select = document.createElement("select");
        select.id = "fontSelect";
        document.getElementById("fontmarkletDiv").appendChild(select);

        jQuery.getJSON("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBRh3XwaTyAoCjBuAFQ6syYtRjRRdeJb4o", function (data) {
            for(var i = 0; i < data.items.length; i++) {
                var option = document.createElement("option")
                option.innerHTML = data.items[i].family;
                select.appendChild(option);
            }
        })

        jQuery("#applyFont").click(function () {
            WebFont.load({
                google : {
                    families : [ $("#fontSelect").val() ]
                },
                active : function () {
                    jQuery("body *").css("font-family", $("#fontSelect").val());
                }
            })
        });
    }
}());