exports.capitalise = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
};

exports.changeFont = function(selector, family, weight) {
  try {
    var nodes;
    if(selector.nodeName){
      nodes = [selector];
    }else{
      nodes = document.querySelectorAll(selector);
      nodes = Array.prototype.slice.call(nodes);
    }
    nodes.forEach(function (node) {
      node.style.fontFamily = family;
      node.style.fontWeight = weight;
    });
  } catch (ignore) { }
};
