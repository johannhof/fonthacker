var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.src = 'https://joo.crater.uberspace.de/fontmarklet/fontmarklet.min.js?development=' + Math.random();
head.appendChild(script);

var style = document.createElement('style');
style.innerHTML =
"@-webkit-keyframes fm-loader-rotate {\
  0% {\
    transform: rotateZ(0deg);\
  }\
  45% {\
    transform: rotateZ(180deg);\
  }\
  55% {\
    transform: rotateZ(180deg);\
  }\
  100% {\
    transform: rotateZ(360deg);\
  }\
}\
.fm-loader-logo {\
  top: 50%;\
  left: 50%;\
  width: 50px;\
  height: 50px;\
  background-color: deepskyblue;\
  border-radius: 50px;\
  color: white;\
  position: fixed;\
  overflow: hidden;\
  border: 5px solid deepskyblue;\
  -webkit-animation-name: fm-loader-rotate;\
  -webkit-animation-delay: 1s;\
  -webkit-animation-duration: 2s;\
  -webkit-animation-iteration-count: infinite;\
}\
.fm-loader-logo-f {\
  font-family: Lato;\
  position: absolute;\
  left: 5px;\
  top: -9px;\
  font-size: 65px;\
  font-weight: 600;\
  font-style: italic;\
}\
";
head.appendChild(style);

var loader = document.createElement('div');
loader.classList.add('fm-loader-logo');
loader.innerHTML = '<span class="fm-loader-logo-f">F</span>';

script.onload = function () {
  loader.style.display = 'none';
}

document.body.appendChild(loader);
