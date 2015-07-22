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

//exports.load = function(fonts) {
  //if (!Array.isArray(fonts)) {
    //fonts = [fonts];
  //}
  //fonts = fonts.filter(function(font) {
    //return font.provider === "google";
  //});
  //if (fonts.length < 1) {
    //return;
  //}
  //window.WebFont.load({
    //google: {
      //families: fonts.map(function(val) {
        //return val.family + ":" + (val.variants ? val.variants.join(',') : '');
      //})
    //}
  //});
//};

