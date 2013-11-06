var ui = {},
    selectorRow = require('./views/selectorRow'),
    styles = require('./styles'),
    draggable = require('./vendor/draggable'),
    $mainContainer,
    $selectorContainer,
    $rightContainer,
    $addButton,
    $fontProviderSelect;

ui.providerContainer = document.createElement("div");

ui.selectElement = function (callback) {
  var all = $("body *").not("#fontmarkletDiv *").not("#fontmarkletDiv");

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
  $selectorContainer.append(selectorRow(fontConfig));
};

ui.init = function (controller, providers) {
  var provider, option;

  $mainContainer = $(document.createElement("div"));
  $mainContainer.attr("id", "fontmarkletDiv").css(styles.mainContainer);

  $selectorContainer = $(document.createElement("div"));
  $selectorContainer.css(styles.selectorContainer);

  $addButton = $(document.createElement("button"));
  $addButton
    .attr("id", "addFont")
    .html("Add Selector")
    .css(styles.addButton).click(controller.addButtonClick);

  $selectorContainer.append($addButton);
  $selectorContainer.append(document.createElement("br"));

  $rightContainer = $(document.createElement("div"));
  $rightContainer.css(styles.rightContainer);

  // creates the select element which allows the user to choose
  // a font provider (eg Google)
  $fontProviderSelect = $(document.createElement("select"));
  $fontProviderSelect
    .attr("class", "selectProvider")
    .css(styles.fontProviderSelect)
    .change(function () {
      controller.fontProviderSelectChange($(this).val());
    });

  // fill it with all the providers
  for(provider in providers) {
    if(providers.hasOwnProperty(provider)) {
      option = document.createElement("option");
      option.value = provider;
      option.innerHTML = provider;
      $fontProviderSelect.append(option);
    }
  }

  $rightContainer.append($fontProviderSelect);
  $rightContainer.append(ui.providerContainer);

  // make the whole thing draggable
  draggable($mainContainer);

  $mainContainer.append($selectorContainer);
  $mainContainer.append($rightContainer);

  //append the main container to the body, this should be done last, because of performance
  document.body.insertBefore($mainContainer.get(0), document.body.firstChild);
};

module.exports = ui;
