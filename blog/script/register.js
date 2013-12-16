/// <reference path="jQuery2.03.js" />
/// <reference path="jquery.md5.js" />
/// <reference path="application.js" />

window.infoState = function (jquerydom, express) {
    if (express) {
        jquerydom.parent().parent().removeClass("has-error").addClass("has-success");
    } else {
        jquerydom.parent().parent().removeClass("has-success").addClass("has-error");
    }
}

$(function () {
    var isOne = true;
    var surr = "";

    $("#divMessage").hide();
    $("#inputMobile").popover({
        content: "请您输入常用的手机号码，用来接收<b>注册码</b>以及<b>找回密码</b>。",
        delay: { show: 500, hide: 100 },
        trigger: "focus ",
        container: 'body',
        html: true
    });
    $("#inputNickName").popover({
        content: "亲！给自己起个好听的名字吧",
        delay: { show: 500, hide: 100 },
        trigger: "focus ",
        container: 'body',
        html: true
    });
    var isPwd = false;
    $("#inputPasswordreg").popover({
        content: "亲！弄个大于6位的安全密码吧",
        delay: { show: 500, hide: 100 },
        trigger: "focus ",
        container: 'body',
        html: true
    }).keyup(function () {
        if ($(this).val().length >= 6) {
            infoState($(this), true);
            isPwd = true;
        } else {
            infoState($(this), false);
            isPwd = false;
        }
    });
    $("#inputPassword2reg").keyup(function () {
        if ($(this).val().length > 0 && $(this).val() === $("#inputPasswordreg").val()) {
            infoState($(this), true);
        } else {
            infoState($(this), false);
        }
        if (isOne) {
            $("#get-image").click();
            isOne = false;
        }
    });
    var isMobile = false;
    $("#inputMobile").keyup(function () {
        var reg = /^\d{11}$/;
        var _this = $(this);
        if (!reg.test(_this.val().replace(/-/g, ""))) {
            infoState(_this, false);
            isMobile = false;
        } else {
            infoState(_this, true);
            isMobile = true;
        }

    }).keypress(function (event) {
        var strCode = String.fromCharCode(event.which);
        var strLength = $(this).val().length;
        if (isNaN(strCode)) {
            return false;
        }
        if (strLength >= 13) {
            return false;
        }
        if (strLength == 3 || strLength == 8) {
            $(this).val($(this).val() + "-");
        }
    });
    var isNick = false;
    $("#inputNickName").blur(function () {
        if ($(this).val().trim().length > 0) {
            isNick = true;
            infoState($(this), true);
        }

    });
    $("#year,#month,#day").click(function () {
        var year = $("#year option:selected").attr("value");
        var month = $("#month option:selected").attr("value");
        var day = $("#day option:selected").attr("value");
        if (year === "0" || month === "0" || day === "0") {
            $("#divBrithday").addClass("has-error").removeClass("has-success");
        } else {
            $("#divBrithday").addClass("has-success").removeClass("has-error");

        }
    });
    $("#sex :radio").click(function () {
        $("#sex").addClass("has-success").removeClass("has-error");
    });
    $("#innputma").keyup(function () {
        if ($(this).val().length == 2) {
            $(this).parent().parent().parent().removeClass("has-success").removeClass("has-error");

        } else {
            $(this).parent().parent().parent().removeClass("has-success").addClass("has-error");

        }

    });

    $("#btnRegisterAction").click(function () {
        var nickName = $("#inputNickName").val().trim();
        var phone = $("#inputMobile").val().replace(/-/g, "");
        var password = $("#inputPasswordreg").val();
        var password2 = $("#inputPassword2reg").val();
        var year = $("#year option:selected").attr("value");
        var month = $("#month option:selected").attr("value");
        var day = $("#day option:selected").attr("value");
        var sex = $("#sex :checked").val();
        var ma = $("#innputma").val();
        if (nickName.trim() === "") {
            infoState($("#inputNickName"), false);
        }

        //  var birthday = Date.Parse(""+year + "-" + month + "-" + day,"yyyy-MM-dd");
        //yyyy-MM-ddTHH:mm:ss
        $("#inputNickName").blur();
        $("#inputMobile").keyup();
        $("#inputPasswordreg").keyup();
        $("#inputPassword2reg").keyup();
        $("#innputma").keyup();
        $("#year").click();
        if (sex == undefined) {
            $("#sex").addClass("has-error").removeClass("has-success");
        }
      
        if (nickName === ""
            || !isNick
            || !isMobile
            || !isPwd
            || year === "0"
            || month == "0"
            || day === "0"
            || sex == undefined
            || ma === ""
            ) {
            $("#divMessage").html((nickName === "" ? "这位<b>" : nickName) + "</b>同学，您还是填完表单吧！(红色代表未通过)").show("slow");
            return false;
        }
        if (password2 !== password) {
            infoState($("#inputPasswordreg"), false);
            infoState($("#inputPassword2reg"), false);
            $("#divMessage").html((nickName === "" ? "这位<b>" : nickName) + "</b>同学，两次输入的密码不一致(红色代表未通过)").show("slow");
            return false;
        }


        $("#divMessage").hide();

        var birthday = "" + year + "-" + month + "-" + day + "T00:00:00";

        $.ajax({
            type: 'post',
            url: "/register",
            data: {
                nickName: nickName,
                phone: phone,
                "login-phone": $.md5(phone),
                cert: $.md5(password),
                birthday: birthday,
                sex: sex,
                ma: ma,
                surr: surr
            },
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data.message) {
                    $("#divMessage").html(data.message).show("slow");
                } else {
                    document.cookie = "yaonie=" + data._id + "-" + data.status + ";path=/;";
                    window.location.replace("/");
                }
            }
        });
    });


    $("#get-image").click(function () {
        $.ajax(
            {
                type: "GET",
                url: "/register/get-img",
                cache: false,
                dataType: 'json',
                success: function (data) {
                    surr = data._id;
                    $("#yazhengma").show().attr("src", "data:image/png;base64," + data.base);
                }
            }
 );
    });
});