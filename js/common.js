
/* global $fn, CryptoJS */

CryptoJS.pad.ZeroPadding={pad:function(a,c){var b=4*c;a.clamp();a.sigBytes+=b-(a.sigBytes%b||b)},unpad:function(a){for(var c=a.words,b=a.sigBytes-1;!(c[b>>>2]>>>24-8*(b%4)&255);)b--;a.sigBytes=b+1}};

//var iv = CryptoJS.enc.Hex.parse(CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex));

var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode: function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    // public method for decoding
    decode: function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode: function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode: function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};

const iv = CryptoJS.enc.Base64.parse(Base64.encode('a6afbbcbf8be7668')); 

function format_parse(key) {
    while (key.length < 16) {
        key = key + '\u0000';
    }
    return key;
}

function aes_encrypt(psw, key){
    key = CryptoJS.enc.Utf8.parse(format_parse(md5(key)));
    var raws = CryptoJS.enc.Utf8.parse(psw);//CryptoJS.pad.Pkcs7
    var encrypted = CryptoJS.AES.encrypt(raws, key, { 
        iv: iv,
        padding: CryptoJS.pad.ZeroPadding, 
        mode: CryptoJS.mode.CBC 
    });
    return Base64.encode(encrypted.toString());
}

function aes_decrypt(enc, key){
    key = CryptoJS.enc.Utf8.parse(md5(key));
    var encHex = Base64.decode(enc);
    var decrypt = CryptoJS.AES.decrypt(encHex, key, { 
        iv: iv,
        padding: CryptoJS.pad.ZeroPadding, 
        mode: CryptoJS.mode.CBC 
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8); 
    return decryptedStr;
}

function array2Json(o) {
    var r = [];
    if (typeof o === "string") return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
    if (typeof o === "object") {
        if (!o.sort) {
            for (var i in o)
                r.push(i + ":" + arrayToJson(o[i]));
            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                r.push("toString:" + o.toString.toString());
            }
            r = "{" + r.join() + "}";
        } else {
            for (var i = 0; i < o.length; i++) {
                r.push(arrayToJson(o[i]));
            }
                r = "[" + r.join() + "]";
        }
        return r;
    }
    return o.toString();
}

function jsonOut(text){
    return JSON.stringify(text, null, 4);
}

function containSpecial(s)
{      
    var judge = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);      
    return (judge.test(s));      
}

function nativeXMLHttp(method, link, param, callback) {
    var xmlhttp;
    // 适用于大多数浏览器，以及IE7和IE更高版本
    try{
        xmlhttp = new XMLHttpRequest();
    } catch (e) {
        // 适用于IE6
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            // 适用于IE5.5，以及IE更早版本
            try{
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e){}
        }
    }
    xmlhttp.open(method, link, true);
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
    xmlhttp.send(param);
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            if (typeof (callback) === "function") { 
                callback(xmlhttp.responseText);
            }
        }else if(xmlhttp.status === 401){
            location.reload(true);
        }else if(xmlhttp.status === 405){
            alert("405 Not Allowed");
        }else if(xmlhttp.status === 500){
            alert("Internal Server Error");
        }
    };
}

function requestJson(method, link, callback, json){
    var json = JSON.stringify(json);
    $.ajax({
        type: method,
        url: link,
        data: json,
        dataType:"json",
        success:function(data){
            if (typeof (callback) === "function") { 
                callback(data);
            }
        },
        error:function(jqXHR){
             if(jqXHR.status === "Unauthorized"){
                 
             }else{
                 alert(jqXHR.status);
             }
        }
    });
}

function setPopDivNoScroll(clazz_pop_div, id_pop_div, display, text, top, left, width, height, top_id, btm_elem){
    var div_pop = "";
    try{
        div_pop = document.getElementById(id_pop_div);
    }catch(e){
        console.log("get "+id_pop_div+" element error\n"+e);
        return;
    }
    var winNode = $("#"+id_pop_div);
    width = (width === null || width === undefined || width === 0) ? 300 : width;
    height = (height === null || height === undefined || height === 0) ? 160 : height;
    top = (top === null || top === undefined || top === 0) ? 100 : (top > height ? top - height : top);
    if(top + height > $(window).height()){
        top = (top - height - 100);
    }
    if(top_id){
        top = ($("#"+top_id).get(0).getBoundingClientRect().top);
    }
    var css = {
        'left': '30%',
        'top': top+'px',
        'z-index': '3',
        'border': '1px solid #ff6600',
        'background-color': "#fff",
        'margin': '100px auto',
        'padding': 0,
        'display': 'none',
        'text-align': 'right',
        'width': width+'px',
        'height': height+'px'
    };
    div_pop.style.setProperty('position', 'absolute', 'important');
    winNode.css(css);
    if(left){
        winNode.css({left:left});
    }
    winNode.on('click','');
    div_pop.style.display = 'block';
    if(text){
        if(text.length > 290){
            text = text.substring(0,290) + " ...";
        }
    }
    winNode.html(
        '<div class="title">提示 !<span class="hide" onclick="pop_hide()">X</span></div>' +
        '<div id="content" style="word-wrap:break-word">'+ text +'</div>'
    );
    if(display && typeof(display) === "boolean"){
        var clazz = $('.'+clazz_pop_div);
        winNode.get(0).offsetHeight += 30;
        var scrollTop = $(window).scrollTop();
        var    winWidth = $(window).width(), winHeight = $(window).height(); 
        var objLeft = (winWidth - clazz.width()) / 2;
        var objTop = /*(winHeight - clazz.height()) / 2*/ top + scrollTop;
        winNode.css({
            left: objLeft + 'px',
            top: objTop + 'px'
        });
        $(window).scroll(function(){
            winWidth = $(window).width();
            winHeight = $(window).height();
            scrollTop = $(document).scrollTop();
            objLeft = (winWidth - clazz.width()) / 2;
            objTop = top + scrollTop;
            winNode.css({
                left: objLeft + 'px',
                top: objTop + 'px',
                'display': 'block'
            });
        });
        if(btm_elem){
            var btm_elem_top = $("#"+btm_elem).offset().top + 27;
            var pop_div_elem = $("#main_pop_div");
            var pop_div_height = pop_div_elem.height();
            if(pop_div_elem.offset().top + pop_div_height - btm_elem_top < 25){
                pop_div_elem.height(pop_div_height + 25);
            }
        }
    }else if(display === "move"){
        //hooyes
        (function(document){
            $fn.Drag = function(){
                var M = false;
                var Rx, Ry;
                var cursorY = 0;
                var offset;
                var t = $(this);
                t.mousedown(function(event){
                    offset = winNode.offset();
                    cursorY = event.pageY;
                    Rx = event.pageX - (parseInt(t.css("left"))||0);
                    Ry = cursorY - (parseInt(t.css("top"))||0);
                    if(cursorY <= (offset.top + 20) && cursorY > offset.top){
                        t.css("position", "absolute").fadeTo(20, 0.8);
                    }
                    M = true;
                }).mouseup(function(){
                    t.fadeTo(20,1);
                    M = false;
                });
                t.mouseleave(function(event){
                    Rx = event.pageX - (parseInt(t.css("left"))||0);
                    Ry = cursorY - (parseInt(t.css("top"))||0);
                    M = false;
                });
                $(document).mousemove(function(event){
                    offset = winNode.offset();
                    cursorY = event.pageY;
                    var judge = offset.left + winNode.width() - 40;
                    if(cursorY <= (offset.top+20) && cursorY > offset.top && event.pageX < judge){
                        t.css('cursor', 'move');
                        if(M){
                            t.css({
                                top: cursorY - Ry,
                                left: event.pageX - Rx
                            });
                        }
                    }else{
                        t.css('cursor', 'default');
                    }
                });
            };
        })(document);
        $(document).ready(function(){
            winNode.Drag();
        });
        $(window).scroll(function(){
            winNode.css({'display':'block'});
        });
    }else{
        div_pop.style.display = 'none';
        $(window).scroll(function(){
            winNode.css({
                'display': 'none'
            });
        });
    }
}
//上传文件方法
function UpladFile(elem, url) {
    // js获取文件
    var fileObj = document.getElementById(elem).files[0];
    var fileName = document.getElementById(elem).value;
    // FormData对象
    var form = new FormData(); 
    form.append("file", fileObj);
    form.append("name", fileName);

    var xhrup = new XMLHttpRequest();    // XMLHttpRequest 对象
    xhrup.open("POST", url, true);       // POST方式，url为服务器请求地址，参数3规定请求是否异步处理。
    xhrup.onload = uploadComplete;       // 请求完成
    xhrup.onerror =  uploadFailed;       // 请求失败

    xhrup.upload.onprogress = progressFunction;//[调用上传进度方法]
    xhrup.upload.onloadstart = function(){//上传开始执行方法
        ot = new Date().getTime();   //设置上传开始时间
        oloaded = 0;//设置上传开始时，以上传的文件大小为0
    };
    xhrup.send(form); //开始上传，发送form数据
    return xhrup;
}
//上传成功响应
function uploadComplete(evt) {
    //服务断接收完文件返回的结果
    var rsp_text = evt.target.responseText;
    if(rsp_text.indexOf("ERROR:") !== -1){
        setPopDivNoScroll("clazz_pop_div", "id_pop_div", true, rsp_text);
        return;
    }
    alert(rsp_text);

}
//上传失败
function uploadFailed(evt) {
    alert("上传请求错误！");
}
//取消上传
function cancleUploadFile(xhr){
    xhr.abort();
}
//上传进度实现方法，上传过程中会频繁调用该方法
function progressFunction(evt) {
    var progressBar = document.getElementById("progressBar");
    var percentageDiv = document.getElementById("percentage");
    // event.total是需要传输的总字节，event.loaded是已经传输的字节。如果event.lengthComputable不为真，则event.total等于0
    if (evt.lengthComputable) {//
        if(progressBar === null){
            return;
        }
        progressBar.max = evt.total;
        progressBar.value = evt.loaded;
        percentageDiv.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
    }
    var time = document.getElementById("time");
    var nt = new Date().getTime();//获取当前时间
    var pertime = (nt-ot)/1000; //计算出上次调用该方法时到现在的时间差，单位为s
    ot = new Date().getTime(); //重新赋值时间，用于下次计算
    var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位b
    oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算
    //上传速度计算
    var speed = perload/pertime;//单位b/s
    var bspeed = speed;
    var units = 'b/s';//单位名称
    if(speed/1024>1){
        speed = speed/1024;
        units = 'k/s';
    }
    if(speed/1024>1){
        speed = speed/1024;
        units = 'M/s';
    }
    speed = speed.toFixed(1);
    //剩余时间
    var resttime = ((evt.total-evt.loaded)/bspeed).toFixed(1);
    time.innerHTML = '，速度：'+speed+units+'，剩余时间：'+resttime+'s';
    if(bspeed===0)
        time.innerHTML = '上传已取消';
}
