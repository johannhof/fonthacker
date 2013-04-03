(function () {

    // the minimum version of jQuery we want
    var v = "1.8.2";

    // check prior inclusion and version
    if(window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        var done = false;
        var script = document.createElement("script");
        script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
            if(!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                done = true;
                start();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    else {
        start();
    }

    function start() {
            var divTag, WebFontConfig, wf, s, button;
            divTag = document.createElement("div");
            divTag.id = "typreviewDiv";
            divTag.setAttribute("align", "center");
            divTag.style.width = "150px";
            divTag.style.height = "150px";
            divTag.style.backgroundColor = "lightgrey";
            divTag.style.left = 0;
            divTag.style.bottom = 0;
            divTag.style.position = "fixed";
            divTag.style.zIndex = "999";

            divTag.innerHTML = "Test";

            document.body.insertBefore(divTag, document.body.firstChild);

            button = document.createElement("button");

            button.innerHTML = "Click Me!";

            document.getElementById("typreviewDiv").appendChild(button);

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
    }

}());