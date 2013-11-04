(function (window) {
  var v = "1.8.3", script, done = false;

  /*
   * Loads the bookmarklet after requirements are set up
   */
  function loadBookmarklet() {
    var $ = window.jQuery,
    ui = require('./ui'),
    controller = require('./controller'),
    localstorage = require('./localstorage'),
    webfonts = require('./webfonts');

    webfonts.providers = {
      google : require('./providers/google'),
      local : require('./providers/local')
    };

    ui.init(controller, webfonts.providers);
    webfonts.loadRequirements(function () {
      webfonts.setActiveProvider("google");
      localstorage.load();
    });
  }

  /*
   * Checks if a sufficient jQuery Version is already existent
   * if not, load it
   * then call the initial load function
   */
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
