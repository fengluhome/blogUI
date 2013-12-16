/// <reference path="jQuery2.03.js" />



Number.prototype.toFixed = function (len) {/// <summary>控制0.00x转化时转化成0.00的情况(parseFloat.toFixed方法的不兼容) 20210829 xueyuanfeng</summary>   
    if (parseFloat(this) > 0) {
        return (parseInt(this * Math.pow(10, len) + 0.5) / Math.pow(10, len)).toString();
    }
    else if (parseFloat(this) == 0) return this.toString();
    else {
        var ret_str = this.toString();
        var arr_str = ret_str.split('.');
        if (arr_str.length > 1) {
            if (len < arr_str[1].length) {
                var _retsult = (parseInt((0 - this) * Math.pow(10, len) + 0.5) / Math.pow(10, len)).toString();
                _retsult = "-" + parseFloat(_retsult).toString();
                return _retsult;
            }
        }
        return this.toString();
    }
};
Number.prototype.ToString = function (format, udf_intDigits, udf_fractionDigits) {
    /// <summary> 数字按指定格式转化为字符串，小数可以舍弃，而整数部分不可以。例：var a = 1.1;； a.ToString("00") 及 a.ToString(2, 0)为"01"；a.ToString("0.00") 及 a.ToString(1, 2)为"1.10" </summary>
    ///	<param name="format"             type="String"> 格式，例：“0.00”、“00” </param>
    ///	<param name="udf_intDigits"      type="Integer"> 整数位数，不足的前面补 0 </param>
    ///	<param name="udf_fractionDigits" type="Integer"> 小数位数，不足的后面补 0 </param>
    if (arguments.length < 1 || arguments.length > 2) return this.toString();
    if (arguments.length == 1) { format = format.split("."); udf_intDigits = format[0].length; udf_fractionDigits = format.length > 1 ? format[1].length : 0; }
    else if (arguments.length == 2) { udf_fractionDigits = udf_intDigits; udf_intDigits = format; }
    var result = this.toFixed(udf_fractionDigits), lackIntDigits = udf_intDigits - result.split(".")[0].length;
    for (var i = 0; i < lackIntDigits; i++) { result = "0" + result; }
    var lastNub = udf_fractionDigits - (result.split(".").length > 1 ? result.split(".")[1].length : 0);
    if (udf_fractionDigits > 0) {
        if (result.split(".").length == 2) {
            for (var j = 0; j < lastNub; j++) {
                result += "0";
            }
        }
        else if (result.split(".").length == 1) {
            result += ".";
            for (var j = 0; j < lastNub; j++) {
                result += "0";
            }
        }
    }

    return result;
};
RegExp.WhiteBlank = /(^\s*)|(\s*$)/g;

String.prototype.ToString = String.prototype.toString;
String.prototype.Trim = function () {
    /// <summary> 去掉当前字符串的前后空格 </summary>
    return this.replace(RegExp.WhiteBlank, "");
};
String.prototype.Replace = function (oldStr, newStr) {
    /// <summary> 将当前字符串中的某个 子字符串 换成 指定字符串 </summary>
    return this.split(oldStr).join(newStr);
};
Date.ParseString = "yyyy-MM-dd HH:mm:ss";
Date.ShortCuts = { "yyyy": "setFullYear", "MM": "SetMonth", "dd": "setDate", "HH": "setHours", "mm": "setMinutes", "ss": "setSeconds" };
Date.prototype.SetMonth = function (mm) { this.setMonth(mm - 1); };
Date.prototype.ToString = function (udf_fmt, udf_fmtJson) {
    if (udf_fmt == undefined) udf_fmt = Date.ParseString;
    this["yyyy"] = this.getUTCFullYear(); this["MM"] = this.getUTCMonth() + 1; this["dd"] = this.getUTCDate(); this["HH"] = this.getUTCHours(); this["mm"] = this.getUTCMinutes(); this["ss"] = this.getUTCSeconds();
    var dtStr = udf_fmt; if (udf_fmtJson == undefined) udf_fmtJson = Date.ShortCuts;
    for (var key in udf_fmtJson) {
        dtStr = dtStr.Replace(key, this[key].ToString("00"));
    }
    return dtStr;
};
Date.Parse = function (str, udf_fmt, udf_fmtJson) {
    if (udf_fmt == undefined) udf_fmt = Date.ParseString;
    if (udf_fmtJson == undefined) udf_fmtJson = Date.ShortCuts;
    var newtime = new Date();
    for (var key in Date.ShortCuts) {
        var index = udf_fmt.indexOf(key), timevar = 0;
        if (udf_fmtJson[key] != undefined)
            timevar = str.substr(index, key.length);
        else
            timevar = timevar.ToString(key.length, 0);
        newtime[Date.ShortCuts[key]](parseInt(timevar, 10));
    }
    return newtime;
};

!function ($) {

    $(function () {

        // IE10 viewport hack for Surface/desktop Windows 8 bug
        //
        // See Getting Started docs for more information
        if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
            var msViewportStyle = document.createElement("style");
            msViewportStyle.appendChild(
              document.createTextNode(
                "@-ms-viewport{width:auto!important}"
              )
            );
            document.getElementsByTagName("head")[0].
              appendChild(msViewportStyle);
        }


        var $window = $(window)
        var $body = $(document.body)

        var navHeight = $('.navbar').outerHeight(true) + 10

        $body.scrollspy({
            target: '.bs-sidebar',
            offset: navHeight
        })

        $window.on('load', function () {
            $body.scrollspy('refresh')
        })

        $('.bs-docs-container [href=#]').click(function (e) {
            e.preventDefault()
        })






    })

}(window.jQuery)


$(function () { /// <summary>登陆</summary>
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
            data: {
                loginID: $.md5(loginEmail),
                cert: $.md5(loginPwd)
            },
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data.message == "0") {
                    messDom.text("亲！登录失败！").show("slow");
                } else {
                    $("#user-power").html(data.message);
                    document.cookie = "yaonie=" + data.yaonie + ";path=/;";
                    messDom.text("亲！登录成功！").show("slow");
                    $("#inputEmail,#inputPassword").val("");
                    $('#myModal').modal('hide');

                    var divheader = $("#div-header");
                    var height = divheader.height();
                    divheader.css({ "margin-top": -height });
                    setTimeout(function () {
                        divheader.animate({ "margin-top": 0 }, "slow");
                    }, 500);
                }
            }
        });

    });

 
});
var CookieUtil = {
    get: function (name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null;
        if (cookieStart > -1) {
            var cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    }
    , set: function (name, value, expires, path, domain, secure) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
        if (expires instanceof Date) {
            cookieText += "; expries=" + expires.toGMTString();
        }

        if (path) {

            cookieText += "; path=" + path;
        }
        if (domain) {
            cookieText += "; domain=" + domain;
        }
        if (secure) {
            cookieText += "; secure";
        }
        document.cookie = cookieText;

    }, del: function (name) {//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=; expires=" + date.toGMTString();
    }

}

window.henderBtnExit = function () {
    CookieUtil.del("yaonie");
    window.location.replace("/");

};
 