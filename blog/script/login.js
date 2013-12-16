/// <reference path="jQuery1.9.js" />
/// <reference path="jquery.md5.js" />
$(function () {
    var messDom = $("#myModal .alert");
    messDom.hide();
    $("#btnLogin").click(function () {
        $('#myModal').modal('show');

    });
    $("#inputLogin").click(function () {
        var loginEmail = $("#inputEmail").val();
        var loginPwd = $("#inputPassword").val();
        if (loginEmail.trim() == "") {
            messDom.text("用户名不能为空。").show("slow");
            return false;
        }
        if (loginPwd.trim() == "") {
            messDom.text("密码不能为空。").show("slow");
            return false;
        }
        messDom.hide("slow");
        $.ajax({
            type: 'post',
            url: "/login",
            data: { cert: $.md5(loginPwd) },
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data.message == "1") {
                    messDom.text("亲！登录成功！").show("slow");

                } else {
                    messDom.text("亲！登录失败！").show("slow");
                }
            }
        });

    });

});