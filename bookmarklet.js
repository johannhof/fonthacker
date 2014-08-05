var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.src = 'https://joo.crater.uberspace.de/fontmarklet/fontmarklet.min.js?development=' + Math.random();
head.appendChild(script);

var loader = document.createElement('div');
loader.innerHTML = "loading...";

loader.style.position = 'fixed';
loader.style.top = '50%';
loader.style.left = '50%';
loader.style.zindex = '999999';
loader.style.fontSize = '16px';
loader.style.backgroundColor = 'cornflowerblue';
loader.style.opacity = '1';
loader.style.padding = '5px 10px';
loader.style.color = 'white';
loader.style.fontFamily = 'Arial';
loader.style.transition = 'opacity 0.7s linear';

var op = 0;

var blink = setInterval(function() {
  op = op ^ 1;
  loader.style.opacity = op;
}, 800);

script.onload = function () {
  clearInterval(blink);
  loader.style.display = 'none';
}

document.body.appendChild(loader);
