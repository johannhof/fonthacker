var styles= require('../styles');

/**
 * Creates a new row with an input to set a jquery-selector, a delete-button
 * and a tickmark to check if this should be active or not
 *
 * @param fontConfig
 */
module.exports = function (fontConfig) {
  var selectorDiv = document.createElement("div"),
      checkbox = document.createElement("input"),
      selectorInput = document.createElement("input"),
      deleteButton = document.createElement("button"),
      selectButton = document.createElement("button"),
      id = fontConfig.id;

  $(selectorDiv)
    .attr("id", id + "_selectorDiv")
    .css(styles.selectorDiv)
    .click(function () {
      var controller = require('../controller');
      controller.selectorDivClick(id, selectorDiv);
    });

  $(checkbox)
    .attr("type", "checkbox")
    .attr("checked", "true")
    .click(function () {
      var controller = require('../controller');
      controller.activeCheckClick(id, checkbox);
    });
  selectorDiv.appendChild(checkbox);

  $(selectButton)
    .html("Select")
    .css(styles.selectButton)
    .click(function () {
      var controller = require('../controller');
      controller.selectButtonClick(id);
    });
  selectorDiv.appendChild(selectButton);

  $(selectorInput)
    .attr("id", id + "_selector")
    .attr("class", "selector")
    .css(styles.selectorInput)
    .attr("placeholder", "jQuery Selector")
    .val(fontConfig.selector || "")
    .on("keyup change", function () {
      var controller = require('../controller');
      controller.selectorInputChange(id, selectButton, this.value);
    });
  selectorDiv.appendChild(selectorInput);

  $(deleteButton)
    .html("Delete")
    .css(styles.deleteButton)
    .click(function () {
      var controller = require('../controller');
      controller.deleteButtonClick(id, selectorDiv);
    });
  selectorDiv.appendChild(deleteButton);
  return selectorDiv;
};

