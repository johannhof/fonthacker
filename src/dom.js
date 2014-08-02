/**
 * This module is responsible for manipulating the DOM of the target page.
 * E.g adding or removing fonts, displaying hover state, etc.
 */

var elements;

/**
 * Initializes before the fm ui is loaded
 */
exports.init = function() {
  elements = document.querySelectorAll('body *');
  elements = Array.prototype.slice.call(elements);
};

function over(e) {
  e.target.style.backgroundColor = "lightblue";
}

function out(e) {
  e.target.style.backgroundColor = "";
}

/**
 * Select a target for font changing
 * @param {function} cb callback to be called when the user has chosen a target
 */
exports.select = function(cb) {

  var click = function(e) {
    e.preventDefault();
    out(e);

    var target = e.target;
    var name = target.nodeName;

    if (target.id) {
      name += "#" + target.id;
    } else if (target.className) {
      name += "." + target.className;
    }

    cb(target, name);

    elements.forEach(function(el) {
      el.removeEventListener('mouseover', over);
      el.removeEventListener('mouseout', out);
      el.removeEventListener('click', click);
    });

    return false;
  }.bind(this);

  elements.forEach(function(el) {
    el.addEventListener('mouseover', over);
    el.addEventListener('mouseout', out);
    el.addEventListener('click', click);
  });
};

function apply(font) {
  try {
    var nodes;
    if (font.selector.nodeName) {
      nodes = [font.selector];
    } else {
      nodes = document.querySelectorAll(font.selector);
      nodes = Array.prototype.slice.call(nodes);
    }
    nodes.forEach(function(node) {
      node.style.fontFamily = font.family;
      node.style.fontWeight = font.weight;
    });
  } catch (ignore) {}
}

exports.reset = function(selector) {
  apply({
    selector: selector,
    family: "",
    weight: ""
  });
}

exports.applyFont = function(fonts) {
  if (!Array.isArray(fonts)) {
    fonts = [fonts];
  }
  fonts.forEach(function(font) {
    if (font.disabled) return
    apply(font);
  });
}
