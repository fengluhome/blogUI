/// <reference path="jQuery2.03.js" />
/// <reference path="../bootstrap/js/bootstrap.js" />
var ip = "http://192.168.250.108:8080";

window.guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).toUpperCase();
};


var dataliks = [];

window.infoState = function (jquerydom, express) {
    if (express) {
        jquerydom.parent().parent().removeClass("has-error").addClass("has-success");
    } else {
        jquerydom.parent().parent().removeClass("has-success").addClass("has-error");
    }
}
window.isNil = function (arr) {
    var count = 0;
    for (var i = 0; i < arr.length; i++) {
        (function (i) {
            var dom = $(arr[i]);
            dom.keyup(function () {
                if (dom.val().trim().length == 0) {
                    infoState(dom, false);
                    count++;
                } else {
                    infoState(dom, true)
                }
            });
            dom.keyup();
        })(i);
    }
    return count == 0 ? true : false;
}
$(function () {
    $('.close').tooltip({ title: "关闭Esc", placement: 'left' });
    $("#modalDVR-message").hide();

    $("#input-addDvr").click(function () {
        $("#modalDVR").modal("show");
    });

    $("#modalDVR-add").click(function () {
        var account = $("#input-account").val();
        var password = $("#input-password").val();
        var ip = $("#input-ip").val();
        var port = $("#input-port").val();
        var manufacturer = $("#input-manufacturer").val();

        if (!isNil(["#input-account", "#input-password", "#input-ip",
            "#input-port", "#input-manufacturer"])) {
            $("#modalDVR-message").html("请认真填写表单!").show("slow");
            return;

        } else {
            $("#modalDVR-message").html("").hide();
        }

        $.ajax({
            tyoe: 'post',
            url: "",
            data: {
                user: account,
                pwd: password,
                ip: ip,
                port: port,
                manufacturer: manufacturer
            },
            cache: false,
            dataType: 'json',
            success: function (data) {

            },
            error: function () {
            }
        });
    });


    $.ajax({
        type: 'get',
        url: ip + "/dvr",
        data: {},
        cache: false,
        dataType: 'json',
        success: function (data) {

            dataliks = [];

            for (var i = 0; i < data.length; i++) {
                var strtr = "";
                var trid = guid();;
                strtr += "<tr id='" + trid + "'><td>" + data[i]["ip"] + "</td>";
                strtr += "<td>" + (data[i]["online?"] == "true" ? "是" : "否") + "</td>";
                strtr += "<td>" + data[i]["user"] + "</td>";
                strtr += "<td>" + data[i]["max-video"] + "</td>";
                strtr += "<td>" + data[i]["main-stream-type"] + "</td>";
                strtr += "<td>" + data[i]["manufacturer"] + "</td>";
                strtr += "<td>" + data[i]["port"] + "</td>";
                strtr += "<td>" + data[i]["connected?"] + "</td>";
                strtr += "<td>" + data[i]["sub-stream-type"] + "</td>";
                strtr += "<td>" + data[i]["pwd"] + "</td>";
                strtr += "<td>" + data[i]["model"] + "</td>";
                strtr += "<td>" + data[i]["max-audio"] + "</td>";
                strtr += "<td><button type='button' class='btn btn-primary'>编辑</button></td>";
                strtr += "<td><button type='button' class='btn btn-danger' onclick='dvrDelet(this)'>删除</button></td>";
                strtr += "</tr>";
                dataliks[trid] = data[i]["links"];
                $("#table_drv tbody").html(strtr);
            }
        },
        error: function () {

        }
    })
});
window.dvrDelet = function (trid) {
    $("#modal-dvr-del").modal("show");
    $("#modal-dvr-del #close").click(function () {
        $("#modal-dvr-del").modal('hide');
    });
    $("#modal-dvr-del #ok").click(function () {
        $("#modal-dvr-del").modal('hide');
    });
    //document.querySelector("#modal-dvr-del #close").addEventListener("click", function () {
    //    $("#modal-dvr-del").modal('hide');
    //}, false);
    //document.querySelector("#modal-dvr-del #ok").addEventListener("click", function () {
    //    $("#modal-dvr-del").modal('hide');
    //    //$.AjaxGT("delete", httpHead + "/api/user/" + _this.id, {}, function () {
    //    //    showMsg("删除成功！", "userListMsgInfo");
    //    //    $(_this).parents("tr").detach();
    //    //}, function () {
    //    //    showMsg("删除失败！", "userListMsgInfo");
    //    //});
    //}, false);
};
