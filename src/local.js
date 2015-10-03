exports.load = function(cb) {
  window.populateFontList = cb;

  var embed = document.createElement('embed');
  embed.setAttribute('width', '1');
  embed.setAttribute('height', '1');
  embed.setAttribute("type", "application/x-shockwave-flash");
  embed.setAttribute("allowscriptaccess", "always");
  embed.setAttribute('src', 'https://joo.crater.uberspace.de/fontmarklet/getFont.swf');
  document.body.appendChild(embed);
};

