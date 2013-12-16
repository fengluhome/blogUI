/// <reference path="jQuery1.9.js" />
$(function () {
    $(document.body).click(function (event) {
        if (event.target.tagName == 'IMG' || event.target.tagName == 'img')

            var cursor = $(event.target).attr("data-small");
        if (cursor == "true") {
            imgShow.big(event.target);
        } else if (cursor == "false") {
            imgShow.small();
        }


    });

});

window.imgShow = {
    smallID: null,
    modalID: "myModal-ys-img-big",
    bigID: "sys-img-big",
    big: function (img) {
        var div = $(img).parent().parent().parent();
        this.smallID = div.attr("id");
        var smallImages = div.find("img");
        var bigInner = $("#" + this.bigID + " .carousel-inner")
        var bigIndicators = $("#" + this.bigID + " .carousel-indicators");
        var htm = "", ol = "";
        for (var i = 0; i < smallImages.length; i++) {
            if (smallImages[i].src == img.src) {
                htm += "<div class='item active'>";
                ol += "<li data-target='#" + this.bigID + "' data-slide-to='" + i + "' class='active'></li>";
            } else {
                htm += "<div class='item'>";
                ol += "<li data-target='#" + this.bigID + "' data-slide-to='" + i + "'></li>";

            }

            htm += "<img data-small='false' src='" + smallImages[i].src + "' />";
            htm += "</div>";

        }
        bigInner.html(htm);
        bigIndicators.html(ol);
        div = null;
        smallImages = null;
        bigInner = null;
        $("#" + this.modalID).modal('show');

    },
    small: function () {
        $("#" + this.modalID).modal('hide');
    }

}