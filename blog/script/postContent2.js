/// <reference path="jQuery2.03.js" />

window.imageobj = {
    count: 0,
    htm: function (fileName) {
        if ($("#sortable1 li[data-filename]").length >= 8) return;
        var str = "<li data-filename='" + fileName + "'> "
        str += "<div class='upload-div-img'>";
        str += "<img src='images/GsNJNwuI-UM.gif' /></div></li>";
        $("#add-image").before(str);

    },
    ajax: function (arrimg) {
        var domhead = $("#sortable1 li[data-filename]");
        for (var i = 0; i < domhead.length; i++) {
            for (var j = 0; j < arrimg.length; j++) {
                var $child = $(domhead[i]);
                if ($child.attr("data-filename") == arrimg[j]["filename"]) {
                    $child.find("div").remove();
                    var str = "<img data-name='" + arrimg[j]["new-name"] + "' src='/up/" + arrimg[j]["new-name"] + "' class='img-thumbnail' />";
                    $child.html(str);
                }
                $child = null;
            }
        }
        domhead = null;
    }
}
$(function () {
    $("#input-search").focus(function () {
        $("#div-search").animate({ width: "260" }, "slow");
    }).blur(function () {
        $("#div-search").animate({ width: "200" }, 500);
    });

    $("#divUpdate-image").sortable();
    $("#divUpdate-image").disableSelection();

    $('#inputTitle').tooltip({
        placement: "left",
        title: "请示输入标题",
        container: 'body'
    })

    document.getElementById("editor").designMode = 'On';
    $("#inputPost").click(function () {
        $("#inputEditor").val($("#editor").html());
        //非空判读
        var title = $("#inputTitle").val();
        var content = $("#inputEditor").val();
        var images = [];
        var del = [];

        if (title.trim() == "") {
            systemInfo.show("请输入标题！");
            return;
        }
        if (content.trim() == "") {
            systemInfo.show("请输入文章内容！");
            return;
        }
        var domhead = $("#sortable1 li[data-filename]");

        //是否上传完毕
        for (var i = 0; i < domhead.length; i++) {
            if ($(domhead[i]).find("div").length > 0) {
                systemInfo.show("图片为上传完成，请稍后提交！");
                return;
            }
        }

        //添加images数组
        for (var i = 0; i < domhead.length; i++) {
            images.push($(domhead[i]).find("img").attr("data-name"));
        }

        var domhead2 = $("#sortable2 li[data-filename]");

        for (var i = 0; i < domhead2.length; i++) {
            var dataName = $(domhead2).find("img").attr("data-name");
            if (dataName != "") {
                del.push(dataName);
            }
        }

        //过滤html

        console.log(content);
        $("#inputPost").attr("disabled", true);
        //提交表单
        $.ajax({
            type: 'post',
            url: "/content/write",
            data: {
                title: title,
                content: content,
                images: images,
                del: del

            },
            cache: false,
            dataType: 'json',
            success: function (data) {
                systemInfo.show("发布成功！");
                $("#inputPost").attr("disabled", false);
            },
            error: function () {
                systemInfo.show("发布失败！");
                $("#inputPost").attr("disabled", false);

            }
        });
    });
    $('#editor').click(function () {
        $('#myModalFace').modal('hide');
    });
    $("#editor").keyup(function (event) {
        if (event.keyCode == 13) {
            _dom = document.getElementById("inputPost");
            if (_dom.scrollIntoViewIfNeeded) {
                console.log("ddd");
                _dom.scrollIntoViewIfNeeded(true);

            } else {
                _dom.scrollIntoView(true);
            }
        }
    });


    $("#btnShowFace").click(function () {
        $("#editor").focus();
    });
    $("#pictureBtn").click(function () {
        $("#pictureFile").click();
    });
    $("#add-image").click(function () {
        $("#pictureFile").click();
    });

    $("#faceImg img").click(function () {
        $('#myModalFace').modal('hide');
        document.getElementById("editor").focus();
        document.execCommand("insertimage", false, $(this).attr("data-face"));

    });
    systemAlterInfo.init();
    var strfileInfo = " <img src='images/20131202204227.jpg ' class='img-rounded' /><h3>只能上传小于2M的图片</h3><p>只能上传小于2M的图片，请下载 <a href='soft/XnConvert图片压缩软件.exe' class='btn btn-info '>XnConvert图片压缩软件<span class='glyphicon glyphicon-arrow-down'></span></a></p><p>为了让你的电脑支持更丰富的图片(webp格式图片)，请下载<a class='btn btn-info ' href='soft/图片增强装置.exe'>图片增强装置 <span class='glyphicon glyphicon-arrow-down'></span></a></p>";
    /// <summary>检查图片类型</summary>
    var checkImage = function (files) {
        if (files == undefined) return false;
        for (var i = 0; i < files.length; i++) {
            if (files[i].type.match(/image.*/)) {
            } else {
                systemAlterInfo.show(strfileInfo);
                return false;
            }
            if (parseFloat(files[i].size) > 2000000) {
                systemAlterInfo.show(strfileInfo);
                return false;
            }

        }
        return true;
    }

    $("#pictureFile").change(function () {

        if (!$("#divUpdate").is(":visible")) {
            $("#divUpdate").show(2000);
        }

        var arrimg = [];

        var files = this.files;
        if (!checkImage(files)) return;
        for (var i = 0; i < files.length; i++) {
            if (files[i].type.match(/image.*/)) {
                window.imageobj.htm(files[i].name);
                arrimg.push({ "filename": files[i].name, "new-name": "ring-multipart-5315107477143581241.gif" });
            } else {
                alert("只能上传图片");
                return;
            }
        }


        $.upload("/content/upload", files, {
            upload: {
                progress: function () {
                    console.log("上传中");
                }

            },
            success: function (data) {
                window.imageobj.ajax(data);

            }
        });
    });


});
$(function () {
    systemInfo.init();
    //activate: null,
    //beforeStop: null, 图像真正移动之前
    //change: null,
    //deactivate: null,
    //out: null,
    //over: null,
    //receive: null,
    //remove: null,
    //sort: null,
    //start: null,
    //stop: null,
    //update: null
    $("#sortable1, #sortable2").sortable({
        connectWith: ".connectedSortable",
        cursor: "pointer",
        beforeStop: function (event, ui) {
            if ($(ui.item[0]).attr("id") == "add-image") {
                return false;
            }

        },
        receive: function (event, ui) {
            $(ui.item[0]).hide();
            systemInfo.show("删除图片成功!");

        }
    }).disableSelection();
});
window.systemInfo = {
    id: "system-info",
    init: function () {
        var htm = "<div id='" + this.id + "' class='alert alert-success system-info-div'>";
        htm += " <a href='#' class='alert-link'></a>";
        htm += " </div>";
        $(document.body).append(htm);
    },
    show: function (html) {
        var div = $("#" + this.id);
        div.find(".alert-link").html(html);
        var height = div.height();
        var scroltop = $(document).scrollTop();
        div.css({
            top: -height
        }).animate({
            top: scroltop,
            opacity: 'toggle'
        }, "slow");

        setTimeout(function () {
            systemInfo.hide();
        }, 2000);
    },
    hide: function () {
        var div = $("#" + this.id);
        var scroltop = $(document).scrollTop();
        var height = div.height();
        div.animate({ top: -height }, "slow", function () {
            div.hide();
        });
    }

  
};
window.systemAlterInfo = {
    id: "system-alter-info",
    init: function () {
        var htm = "<div id='" + this.id + "' class='modal fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button><h4 class='modal-title'>友情提示</h4></div><div class='modal-body' style='text-align: center;'></div></div></div></div>";
        $(document.body).append(htm);
    },
    show: function (msg) {
        var mo = $("#" + this.id);
        mo.find(".modal-body").html(msg);
        mo.modal('show');
    }
};

