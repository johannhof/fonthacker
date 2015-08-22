var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
if (process.env.NODE_ENV === 'production'){
  script.src = 'https://joo.crater.uberspace.de/fontmarklet/fontmarklet.min.js';
}else{
  script.src = 'http://localhost:8080/fontmarklet.js?development=' + Math.random();
}
head.appendChild(script);

script.onload = function () {
  window.loadFontmarklet(null);
};
