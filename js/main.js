$(function () {
    var pfeil = document.createElement("img");
    $(pfeil).attr("src", "img/pfeil.png");
    document.body.appendChild(pfeil);
    $(pfeil).hide();

    $(".bookmarklet").hover(function () {
        $(pfeil).css({
            position : "absolute",
            width : $(this).offset().left,
            left : 0,
            height : $(this).offset().top + 30 + "px",
            top : 0
        });
        $(pfeil).fadeIn(200);
    }, function () {
        $(pfeil).fadeOut(200);
    });
});