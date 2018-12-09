
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

var Terminal = {
    // 辨别移动终端类型
    platform : function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        return {
            //IE内核
            windows: u.indexOf('Windows') > -1,
            //opera内核
            presto: u.indexOf('Presto') > -1,
            //苹果、谷歌内核
            webKit: u.indexOf('AppleWebKit') > -1,
            //火狐内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
            //是否为移动终端
            mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
            //ios终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
            //android终端或者uc浏览器
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            //是否iPad
            iPad: u.indexOf('iPad') > -1,
            //是否为iPhone或者QQHD浏览器
            iPhone: u.indexOf('iPhone') > -1,
            //是否为mac系统
            Mac: u.indexOf('Macintosh') > -1,
            //是否web应该程序，没有头部与底部
            webApp: u.indexOf('Safari') === -1
        };
    }(),
    // 辨别移动终端的语言：zh-cn、en-us、ko-kr、ja-jp...
    language : (navigator.browserLanguage || navigator.language).toLowerCase()
};

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

function json2String(data){
    var text = JSON.parse(data);
    text = JSON.stringify(text,null,2);
    if(text == undefined)
        text = eval("("+data+")");
    return text;
}

function array2String(o){
    var arr = []; 
    if(typeof o=="string"){ 
        return "\""+o.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r) /g,"\\r").replace(/(\t) /g,"\\t")+"\""; 
    } 
    if(typeof o=="object"){ 
        if(!o.sort){ 
            for(var i in o){ 
                arr.push("\""+i+"\":"+array2String(o[i])); 
            } 
            if(!!document.all&&!/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)){ 
                arr.push("toString:"+o.toString.toString()); 
            } 
            arr = "  {\n\t"+arr.join()+"\n  }"; 
        }else{ 
            for(var i=0;i<o.length;i++){ 
                arr.push(array2String(o[i])) 
            } 
            arr = "["+arr.join()+"]"; 
        } 
        return arr; 
    } 
    return o.toString(); 
}

function trimSpace(text){
    if(text == null) return null; else return str.replace(/^\s+|\s+$/g,"");
}

function trimComma(text) {
    if(text === null)
        return "";
    else
        return text.replace(/(.*)[,，]$/, '$1');
}

function checkifMetchNum(v)
{
    if(v!=null){
        var r,re;
        re = /\d*/i;
        r = v.match(re);
        return (r===v);
    }
    return false;
}

function checkifNum(v)
{
    if (v != null && v !== "") {
        if(v.toString().indexOf("e") !== -1){
            return false;
        }
        if(v.toString().indexOf("-") !== -1){
            return false;
        }
        return !isNaN(v);
    }
    return false;
}

function checkNULL(value){
    if(value === "null" || value === undefined || value === null)
        return "";
    else
        return value;
}

function checkOutofLength(value,length){
    let Val = value;
    if(value.length > parseInt(length)){
        Val = (Val.substring(0,parseInt(length)) + "...");
    }
    return Val;
}

function checkIfFiledir( s ){
    var special = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\+)(\=)(\[)(\])(\{)(\})(\|)(\')(\")(\,)(\<)(\>)(\?)(\)]+/);
    return ( special.test(s) );
}

function containSpecial( s ){
    var special = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
    return ( special.test(s) );
}

function containChinese( s ){
    return (/.*[\u4e00-\u9FFF]+.*$/.test(s)); // \u for unicode
}

function containNoglish( s ){
    return (escape(s).indexOf('%u') !== -1)
}

function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function getKeybyVal(map,val){
    // try {
    //     for (let key of map) {
    //         if (map[key] === val) {
    //             return key;
    //         }
    //     }
    // }catch(e){
        for (let key in map) {
            if (map[key] === val) {
                return key;
            }
        }
    // }
}

function beInArray(arr, val){
    for(let i = 0; i < arr.length; i++){
        if(val === arr[i]){
            return true;
        }
    }
    return false;
}

function beInObject(obj, val) {
    let ch = JSON.stringify(obj);
    return ch.indexOf(val) !== -1;
}

function showObject(oj){
    var sh = "";
    for(var name in oj){
        var val = oj[name];
        sh += name + ":" + val + "\n";
        if((typeof val==='object')&&val.constructor===Object) {
            for (var _in in val) {
                sh += name + ":" + val + "-" + _in + ":" + val[_in] + "\n";
            }
        }
    }
    console.log(sh);
}

// convert php array to javascript array
function parse_array(arrStr) {
    if(arrStr == null || arrStr === "")
        return;
    var tempKey = 'arr23' + new Date().getTime();
    var arrayJsonStr = '{"' + tempKey + '":' + arrStr + '}';
    var arrayJson;
    if (JSON && JSON.parse) {
        arrayJson = JSON.parse(arrayJsonStr);
    } else {
        arrayJson = eval('(' + arrayJsonStr + ')');
    }
    return arrayJson[tempKey];
}

String.format = function ()
{
    var param = [];
    for (var i = 0, l = arguments.length; i < l; i++)
    {
        param.push(arguments[i]);
    }
    var statment = param[0]; // get the first element(the original statement)
    param.shift(); // remove the first element from array
    return statment.replace(/\{(\d+)\}/g, function(m, n)
    {
        return param[n];
    });
}

function getLocalTime(nS) {
    if(nS === 0 || nS === '0')
        return "Invalid Date";
    else
        return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
}

function convert_time_stamp_to_date(time_stamp){
    var a = new Date(time_stamp * 1000);
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = year + "-" + pad(month, 2) + "-" + pad(date, 2) + " " + pad(hour, 2) + ":" + pad(min, 2) + ":" + pad(sec, 2);
    return time;
}

function setCookie(name, value, day){
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie  = name + '=' + value
        + ';expires=' + date + ';path=/MyAutomatic;domain=' + window.location.hostname;
}

function getCookie(name){
    var reg = RegExp(name + '=([^;]+)');
    var arr = document.cookie.match(reg);
    if(arr){
        return arr[1];
    }else{
        return '';
    }
}

function delCookie(name){
    setCookie(name, '', -1);
}

// Sleep time expects milliseconds
async function sleep (time) {
    return await new Promise((resolve) => setTimeout(resolve, time));
}

let LOCK_MAP = new Map();

function lock(key){
    LOCK_MAP.set(key, 1);
}

function unlock(key){
    LOCK_MAP.set(key, 0);
}

function getLock(key) {
    return LOCK_MAP.get(key);
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
    var i = 0;
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            if (typeof (callback) === "function") { 
                callback(xmlhttp.responseText);
            }
        }else if(i == 0){
            i++;
            if(xmlhttp.status === 401){
                location.reload(true);            
                return;
            }else if(xmlhttp.status === 405){
                alert("405 Not Allowed");
                return;
            }else if(xmlhttp.status === 500){
                alert("Internal Server Error");
                return;
            }
        }
    };
}

function requestJson(json, link, method, callback) {
    //jquery.json
    var encoded;
    try{
        encoded = $.toJSON(json);
    }catch (e) {
        encoded = JSON.stringify(json);
    }
    $.ajax({
        url : link,
        type : method,
        data : encoded,
        dataType : 'json',
        contentType: "application/json; charset=utf-8",
        success : function(data, status, xhr) {
            // Do Anything After get Return data
            if(typeof(callback) === "function"){
                callback(data);
            }
        },
        error : function(xhr, error, exception) {
            // handle the error.
            if(exception.toString() === "Unauthorized"){
                if(link.indexOf("token")!==-1) {
                    location.reload(true);
                }else{
                    alert(401);
                }
            }else{
                alert(exception.toString());
            }
        }
    });
}

function pop_hide(){
    $('#ly').remove();
    setPopDivNoScroll("clazz_pop_div", "id_pop_div", false);
    setCookie("pop_state","hide");
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
            // text = text.substring(0,290) + " ...";
        }
    }
    winNode.after('<div id="ly" style="position:fixed; top:0; left:0; z-index:2; width:100%; height:100%; background:#f5f5f5; filter:alpha(opacity=70); opacity:0.7;display: none;"></div>');
    winNode.html(
        '<div class="title">提示！<span class="hide" title="关闭" onclick="pop_hide()">✖</span></div>' +
        '<div id="content" style="word-wrap:break-word;margin: 3% 0 0 0;">'+ text +'</div>'
    );
    $('#ly').show();
    $("#content").css({
        'overflow': 'auto',
        'width': (width-1)+'px',
        'height': (height-50)+'px'
    });
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
        setCookie("pop_state","show");
    }else if(display === "move"){
        //by hooyes
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
        $('#ly').css({'display': 'none'});
        $(window).scroll(function(){
            winNode.hide();
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
    var pertime = (nt-ot)/1000; //计算出上次调用该方法时到现在的时间差，单位为秒(s)
    ot = new Date().getTime(); //重新赋值时间，用于下次计算
    var perload = evt.loaded - oloaded; //计算该分段上传的文件大小，单位bit
    oloaded = evt.loaded;//重新赋值已上传文件大小，用以下次计算
    //上传速度计算
    var speed = perload/pertime;//单位bit/s
    var bspeed = speed;
    var units = 'b/s';
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
    if(bspeed===0){
        time.innerHTML = '上传已取消';
    }
}

function checkAllBoxs(elem, name, text_id) {
    if($(elem).prop( "checked" )) {
        $("#"+text_id).html("cancel");
        $("input[name='"+name+"']").each(function () {
            this.checked = true;
        });
    }else{
        $("#"+text_id).html("select");
        $("input[name='"+name+"']").each(function () {
            this.checked = false;
        });
    }
}

function getSelectedBox(box_name) {
    var a = "";
    $('input[type="checkbox"][name="'+box_name+'"]:checked').each(
        function () {
            a = a + $(this).val() + ",";
        }
    );
    return trimComma(a);
}

// data-clipboard-target: #<elemID>
// data-clipboard-action: cut/copy
// data-clipboard-text: text
function setClipboard(clazz, label, callback) {
    $("#"+label).html("");
    var clipboard = new ClipboardJS('.' + clazz);
    clipboard.on('success', function(e) {
        if(typeof(callback) === "function"){
            callback();
        }
    });
    clipboard.on('error', function(e) {
        $("#"+label).html("&nbsp;fail...");
        console.log(e);
    });
}

var g_sort = false;
var g_timer = null;
var g_target = 0;
var g_leader = 0;

function sortTablebyValue(tb_id, th_id){
    let tabNode = document.getElementById(tb_id);
    let row0 = tabNode.rows;
    let row1 = [];
    for (let x = 1; x < row0.length; x++) {
        row1[x - 1] = row0[x];
    }
    for (let x = 0; x < row1.length - 1; x++) {
        for (let y = x + 1; y < row1.length; y++) {
            if (parseInt(row1[x].cells[1].innerHTML) > parseInt(row1[y].cells[1].innerHTML)) {
                let temp = row1[x];
                row1[x] = row1[y];
                row1[y] = temp;
            }
        }
    }
    let icon = document.getElementById(th_id);
    if (g_sort) {
        for (let x = 0; x < row1.length; x++) {
            row1[x].parentNode.appendChild(row1[x]);
        }
        icon.innerHTML = "<i>◩</i>";
        g_sort = true;
    }else{
        for (let x = row1.length-1; x >=0; x--) {
            row1[x].parentNode.appendChild(row1[x]);
        }
        icon.innerHTML = "<i>◪</i>";
        g_sort = false;
    }
}

function scroll2BodyTop() {
    clearInterval(g_timer);
    g_timer = setInterval(function () {
        //获取步长
        var step = (g_target - g_leader) / 10;
        //二次处理步长
        step = step>0?Math.ceil(step):Math.floor(step);
        g_leader = g_leader + step;
        //屏幕(页面)滚动到某个位置
        window.scrollTo(0, g_leader);
        //清除定时器
        if(g_leader === 0){
            clearInterval(g_timer);
        }
    },25);
    document.body.scrollTop = 0;
}

function setPopComponent(display, top_id, btm_elem, width, height, left)
{
    click_delete_module = 0;
    let top_val = null;
    if(top_id) {
        top_val = ($("#" + top_id).get(0).getBoundingClientRect().top);
    }
    let left_val = 0;
    if(left){
        left_val = parseInt(left);
    }
    $('#ly').remove();
    setPopDivNoScroll("clazz_pop_div","main_pop_div",display,top_val,left_val,width,height,null,btm_elem);
}

function getBackgroundColor($dom) {
    let bgColor = "";
    while($dom[0].tagName.toLowerCase() !== "html") {
        bgColor = $dom.css("background-color");
        if(bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent") {
            break;
        }
        $dom = $dom.parent();
    }
    return bgColor;
}

String.prototype.colorHex = function(){
    let that = this;
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(that)) {
        let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        let strHex = "#";
        for (let i=0; i<aColor.length; i++) {
            let hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            if(hex.length === 1) {
                hex = "0" + hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    } else if (reg.test(that)) {
        let aNum = that.replace(/#/,"").split("");
        if (aNum.length === 6) {
            return that;
        } else if(aNum.length === 3) {
            let numHex = "#";
            for (let i=0; i<aNum.length; i+=1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    }
    return that;
};

function padding0(num, length) {
    if((num + "").length >= length) {
        return num;
    }
    return padding0("0" + num, length)
}

function hexToRgbA(hex){
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length === 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x'+c.join('');
        return 'RGB('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+')';
        //return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('bad Hex.');
}

// onmouseover="changeTrColor(this,'over')" onmouseout="changeTrColor(this,'out')"
function changeTrColor(elem,flag){
    let colorRgb = getBackgroundColor($(elem));
    let colorHex = colorRgb.colorHex();
    let colorVal = parseInt(colorHex.slice(1),16);
    if(colorVal > 0)
        colorVal -= 8;
    else
        colorVal += 8;
    let colorNear = hexToRgbA("#" + padding0(colorVal,6).toString(16));
    if(flag === "over"){
        $(elem).css({"background": colorNear});
    }else if(flag === 'out'){
        colorVal += 2 * 8;
        colorRgb = hexToRgbA("#" + padding0(colorVal,6).toString(16));
        $(elem).css({"background": colorRgb});
    }
}
