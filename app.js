var bookmarklet = document.getElementById("bookmarklet");
var overlay = document.getElementById("overlay");

bookmarklet.addEventListener('mouseover', function() {
  overlay.classList.add('visible');
});

bookmarklet.addEventListener('mouseout', function() {
  overlay.classList.remove('visible');
});

setTimeout(function() {
  loadFontmarklet(document.getElementById("fm-container-1"));
}, 3000);

setTimeout(function() {
  loadFontmarklet(document.getElementById("fm-container-2"));
}, 5000);

