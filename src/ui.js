var ui = {},
    selectorRow = require('./views/selectorRow'),
    styles = require('./styles'),
    draggable = require('./vendor/draggable'),
    mainContainer, leftContainer, rightContainer,
    addButton,
    fontProviderSelect;

ui.providerContainer = document.createElement("div");

ui.selectElement = function (callback) {
  var all = $("body *").not("#fontmarkletDiv *");

  all.on("mouseover.fontmarklet", function (event) {
    event.stopPropagation();

    $(this).css(styles.selectedElement);

    $(this).on('click.fontmarklet', function (event) {
      event.preventDefault();
      $(this).css(styles.unselectedElement);
      all.off('click.fontmarklet');
      all.off("mouseover.fontmarklet");
      all.off("mouseout.fontmarklet");
      callback(this);
    });
  });

  all.on("mouseout.fontmarklet", function (event) {
    event.stopPropagation();
    $(this).css(styles.unselectedElement);
    $(this).off('click.fontmarklet');
  });

};

ui.addSelectorRow = function (fontConfig) {
  leftContainer.appendChild(selectorRow(fontConfig));
};

ui.init = function (controller, providers) {
  var provider, option;

  mainContainer = document.createElement("div");
  $(mainContainer).attr("id", "fontmarkletDiv").css(styles.mainContainer);

  leftContainer = document.createElement("div");
  $(leftContainer).css(styles.leftContainer);

  addButton = document.createElement("button");
  $(addButton)
    .attr("id", "addFont")
    .html("Add Selector")
    .css(styles.addButton).click(controller.addButtonClick);

  leftContainer.appendChild(addButton);
  leftContainer.appendChild(document.createElement("br"));

  rightContainer = document.createElement("div");
  $(rightContainer).css(styles.rightContainer);

  fontProviderSelect = document.createElement("select");
  $(fontProviderSelect)
    .attr("class", "selectProvider")
    .css(styles.fontProviderSelect)
    .change(function () {
      var value = $(this).val();
      controller.fontProviderSelectChange(value);
    });

  for(provider in providers) {
    if(providers.hasOwnProperty(provider)) {
      option = document.createElement("option");
      option.value = provider;
      option.innerHTML = provider;
      fontProviderSelect.appendChild(option);
    }
  }

  rightContainer.appendChild(fontProviderSelect);
  rightContainer.appendChild(ui.providerContainer);

  draggable($(mainContainer));
  mainContainer.appendChild(leftContainer);
  mainContainer.appendChild(rightContainer);

  //append the main container to the body, this should be done last, because of performance
  document.body.insertBefore(mainContainer, document.body.firstChild);
};

module.exports = ui;
