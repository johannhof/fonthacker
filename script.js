(function () {
    var script = document.createElement('script');
    script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);

    var divTag = document.createElement("div");
    divTag.id = "typreviewDiv";
    divTag.setAttribute("align", "center");
    divTag.style.margin = "0px auto";
    divTag.style.width = "100%";
    divTag.style.height = "150px";
    divTag.style.backgroundColor = "green";
    divTag.style.left = 0;
    divTag.style.bottom = 0;
    divTag.style.position = "fixed";
    divTag.style.zIndex = "200";

    divTag.innerHTML = "Test";

    document.body.insertBefore(divTag, document.body.firstChild);

    var button = document.createElement("button");

    button.innerHTML = "Click Me!";

    document.getElementById("typreviewDiv").appendChild(button);

    WebFontConfig = {
        google : { families : [ 'Droid Sans', 'Droid Serif' ] }
    };
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);

    jQuery("button").click(function () {
        jQuery("body *").css("font-family", "Droid Sans");
    });
}());