(function (window) {
    var v = "1.8.3", script, done = false;

    function loadBookmarklet() {
        var $ = window.jQuery,
        ui = require('./ui'),
        localstorage = require('./localstorage'),
        webfonts = require('./webfonts');

        webfonts.providers = {
          google : require('./providers/google'),
          local : require('./providers/local')
        };

        ui.init();
        webfonts.loadRequirements(function () {
            webfonts.setActiveProvider("google");
            localstorage.load();
        });
    }

    if(window.jQuery === undefined || window.jQuery.fn.jquery < v) {
        script = document.createElement("script");
        script.src = "https://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
        script.onload = script.onreadystatechange = function () {
            if(!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                done = true;
                loadBookmarklet();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {
        loadBookmarklet();
    }
}(window));
