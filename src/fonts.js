import Kefir from 'kefir';
import util from './util';
import fontList from '../google_fonts.json'

function loadLocal(cb) {
  window.populateFontList = cb;

  var embed = document.createElement('embed');
  embed.setAttribute('width', '1');
  embed.setAttribute('height', '1');
  embed.setAttribute("type", "application/x-shockwave-flash");
  embed.setAttribute("allowscriptaccess", "always");
  embed.setAttribute('src', 'https://joo.crater.uberspace.de/fontmarklet/getFont.swf');
  document.body.appendChild(embed);
}

const googleFonts = Kefir
  .constant(fontList)
  .map(function({items}){
    return items.map(function(item) {
        return {
          provider: "google",
          variants: item.variants,
          family: item.family
        };
    });
  })
  .toProperty(() => []);

const localFonts = Kefir
  .fromCallback(loadLocal)
  .map(function(items){
    return items.map(function(item) {
        return {
          provider: "local",
          family: item
        };
    });
  })
  .toProperty(() => []);

const fonts = Kefir
  .combine([googleFonts, localFonts], (a, b) => a.concat(b))
  .toProperty();

export default fonts;

