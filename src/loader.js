var http = require('./http');

function mergeLists(google, local, cb) {
  if (google && local) {
    cb(google.concat(local));
  }
}

function loadLocal(cb) {
  window.populateFontList = function(list) {
    cb(list.map(function(el) {
      return {
        provider: "local",
        family: el
      };
    }));
  };

  var embed = document.createElement('embed');
  embed.setAttribute('width', '1');
  embed.setAttribute('height', '1');
  embed.setAttribute("type", "application/x-shockwave-flash");
  embed.setAttribute("allowscriptaccess", "always");
  embed.setAttribute('src', 'https://ssl.kundenserver.de/johann-hofmann.com/fontmarklet/FontList.swf');
  document.body.appendChild(embed);
}

function loadGoogle(cb) {
  http.get("https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBRh3XwaTyAoCjBuAFQ6syYtRjRRdeJb4o", function(data) {
    var items = JSON.parse(data).items.map(function(item) {
      return {
        provider: "google",
        variants: item.variants,
        family: item.family
      };
    });
    cb(items);
  });
}

exports.loadAll = function(cb) {
  var google, local;

  loadGoogle(function(list) {
    google = list;
    mergeLists(google, local, cb);
  });

  loadLocal(function(list) {
    local = list;
    mergeLists(google, local, cb);
  });
};
