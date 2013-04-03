(function () {
    var v, divTag, button, wf, WebFontConfig, s;

    v = "1.8.3";

    if(window.jQuery !== undefined || window.jQuery.fn.jquery < v) {
        var done, script;
        done = false;
        script = document.createElement("script");
        script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
            if(!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    }

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

    divTag.innerHTML = "Test";

    document.body.insertBefore(divTag, document.body.firstChild);

    button = document.createElement("button");

    button.innerHTML = "Click Me!";

    document.getElementById("fontmarkletDiv").appendChild(button);

    WebFontConfig = {
        google : { families : [ 'Droid Sans', 'Droid Serif' ] }
    };
    wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);

    jQuery("button").click(function () {
        jQuery("body *").css("font-family", "Droid Sans");
    });
}());