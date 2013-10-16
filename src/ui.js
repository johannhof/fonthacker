var ui = {},
    controller = require('./controller'),
    selectorRow = require('./views/selectorRow'),
    styles = require('./styles'),
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

ui.init = function (providers) {
    var provider, option;

    // Make draggable
    (function ($) {
        $.fn.drags = function (opt) {
            var $el;
            opt = $.extend({handle : "", cursor : "move"}, opt);

            if(opt.handle === "") {
                $el = this;
            } else {
                $el = this.find(opt.handle);
            }

            return $el.css('cursor', opt.cursor).on("mousedown",function (e) {
                var $drag, z_idx, drg_h, drg_w, pos_y, pos_x;
                if(opt.handle === "") {
                    $drag = $(this).addClass('draggable');
                } else {
                    $drag = $(this).addClass('active-handle').parent().addClass('draggable');
                }
                z_idx = $drag.css('z-index');
                drg_h = $drag.outerHeight();
                drg_w = $drag.outerWidth();
                pos_y = $drag.offset().top + drg_h - e.pageY;
                pos_x = $drag.offset().left + drg_w - e.pageX;
                $drag.css('z-index', 1000).parents().on("mousemove", function (e) {
                    $('.draggable').offset({
                        top : e.pageY + pos_y - drg_h,
                        left : e.pageX + pos_x - drg_w
                    }).on("mouseup", function () {
                            $(this).removeClass('draggable').css('z-index', z_idx);
                        });
                });
                //e.preventDefault(); // disable selection
            }).on("mouseup", function () {
                    if(opt.handle === "") {
                        $(this).removeClass('draggable');
                    } else {
                        $(this).removeClass('active-handle').parent().removeClass('draggable');
                    }
                });
        };
    }($));

    mainContainer = document.createElement("div");
    $(mainContainer).attr("id", "fontmarkletDiv").css(styles.mainContainer);

    leftContainer = document.createElement("div");
    $(leftContainer).css(styles.leftContainer);

    addButton = document.createElement("button");
    $(addButton).attr("id", "addFont")
        .html("Add Selector")
        .css(styles.addButton).click(controller.addButtonClick);
    leftContainer.appendChild(addButton);
    leftContainer.appendChild(document.createElement("br"));

    rightContainer = document.createElement("div");
    $(rightContainer).css(styles.rightContainer);

    fontProviderSelect = document.createElement("select");
    $(fontProviderSelect).attr("class", "selectProvider")
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

    $(mainContainer).drags();
    mainContainer.appendChild(leftContainer);
    mainContainer.appendChild(rightContainer);
    //append the main container to the body, this should be done last, because of performance
    document.body.insertBefore(mainContainer, document.body.firstChild);
};

module.exports = ui;
