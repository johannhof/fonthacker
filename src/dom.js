import xpath from 'xpath-dom';

/**
 * This module is responsible for manipulating the DOM of the target page.
 * E.g adding or removing fonts, displaying hover state, etc.
 */

/**
 * Select a target for font changing
 * @param {function} cb callback to be called when the user has chosen a target
 */
exports.select = function select(el, cb) {
  e.target.style.backgroundColor = "lightblue";

  var click = (e) => {
    e.preventDefault();
    out(e);

    const target = e.target;
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
  };

  elements.forEach(function(el) {
    el.addEventListener('mouseover', over);
    el.addEventListener('mouseout', out);
    el.addEventListener('click', click);
  });
};

exports.apply = function apply(config) {
  try {
    var nodes;
    if (config.activeSelector === "xpath") {
      nodes = xpath.findAll(config.selector);
    } else {
      nodes = document.querySelectorAll(config.selector);
      nodes = Array.prototype.slice.call(nodes);
    }
    nodes.forEach(function(node) {
      node.style.fontFamily = config.font.family;
      node.style.fontWeight = config.weight;
    });
  } catch (e) {
    console.warn("Error applying font", e);
  }
};

exports.reset = function reset(config) {
  exports.apply({
    activeSelector: config.activeSelector,
    selector: config.selector,
    font: {family: ""},
    weight: ""
  });
};

