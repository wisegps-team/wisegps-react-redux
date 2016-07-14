/**
 * WiStorm框架的基础文件，要使用框架必须引入本文件；
 * 包括了框架一些非常基础的东西，UI类的基类、基本工具等；
 */


//全局变量
window.WiStorm;
window._user;
window._g;


var ___={
	"app_name":"WiCARE",
	"ok":"确定",
	"cancel":"取消",
	"yes":"是",
	"no":"否"
}


function getSearch(){
    var url=location.search;
    if(!url)return {};
    url=url.split("?")[1].split("&");
    var json={};
    var n=url.length;
    for(var i=0;i<n;i++){
        json[url[i].split("=")[0]]=decodeURIComponent(url[i].split("=")[1]);
    }
    return json;
}
//获取跳转参数 即 http://127.0.0.1:8020/baba_wx/src/customer_add.html?a=123&b=asd  问号后面部分
window._g=getSearch();

var	WiStorm_root="http://"+location.host+"/";
if(location.host=="h5.bibibaba.cn")
	WiStorm_root="http://h5.bibibaba.cn/baba/wx/";
var u = navigator.userAgent;
var _d=false;
if(_g.debug)_d=true;
window.WiStorm={
	test_mode:false,
	debug:_d,
	config:{
		"description": "WiStorm框架的配置信息",
		"app_key": "9410bc1cbfa8f44ee5f8a331ba8dd3fc",
		"app_secret": "21fb644e20c93b72773bf0f8d0905052",
		"wx_app_id":"wxa5c196f7ec4b5df9",
		"skin": "default",
		"default_language": "zh-cn",
		"update_url": WiStorm_root+"/update/version.json",
		"wx_ticket_url":WiStorm_root+"wslib/toolkit/WX.TokenAndTicket.php?action=ticket",
		"wx_sdk":"http://res.wx.qq.com/open/js/jweixin-1.0.0.js",
		"wx_login":WiStorm_root+"wslib/toolkit/oauth2.php",
		"safety_url":WiStorm_root+"wslib/toolkit/Safety.php"
	},
	setting:{},//用户设置，由W.getSetting(name)和W.setSetting(key,val)操作
	included:[],//当前页面使用include(url)来包含的文件名
	root:"",//app根目录的绝对路径（即www目录的绝对路径）
	agent:{
	    trident: u.indexOf('Trident') > -1, //IE内核
	    presto: u.indexOf('Presto') > -1, //opera内核
	    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
	    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
	    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
	    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
	    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
	    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
	    iPad: u.indexOf('iPad') > -1, //是否iPad
	    weixin: u.indexOf('MicroMessenger') > -1, //是否微信
	    qq: u.match(/\sQQ/i) == " qq" //是否QQ
	}
};//包含框架相关
u=undefined;
_d=undefined;

//执行错误直接弹出
window.onerror=function(msg,url,l){
	var flie=self.location.href.split(/[\\\/.]/);
    var flieName=flie[flie.length-2];
    url=url.split(/[\\\/.]/);
    url=url[url.length-2];
    var text="错误："+msg+";\n界面："+flieName+";\n文件："+url+";\n行数："+l;
    if((msg.indexOf("WeixinJSBridge")!=-1&&l==1)||
		(msg=="Uncaught TypeError: Cannot read property 'classList' of null"&&url=="WiStorm"&&l==1))
		return;
	if(WiStorm.debug){
		alert(text);
	}else{
		var userText=localStorage.getItem("_WiStormUserSetting_");
		var user,account;
		if(userText){
			try{
				user=JSON.parse(userText);
			}catch(e){
				//TODO handle the exception
				user={account:"解析用户信息出错"};
			}
			account=user.account||"未登录";
		}else{
			account="未登录";
		}
		var errorJson={"bug_report":text,"account":account};
		if(typeof Wapi=="object"){//如果已经加载了api文件，则直接发送错误
			Wapi.user.createCrash(errorJson,function(res){});
		}else{//否则存在本地，等Wapi加载完会自动发送
			var errorLog=localStorage.getItem("errorList");
			var errorList;
			if(errorLog){
				try{
					errorList=JSON.parse(errorLog);
				}catch(e){
					//TODO handle the exception
					errorList=[];
				}
			}else{
				errorList=[];
			}
			errorList.push(errorJson);
			localStorage.setItem("errorList",JSON.stringify(errorList));
		}
	}
}

/**
 * W是一个选择器，相当于jq的$，返回的是原生js对象（dom）
 * 框架封装的原生选择器，直接传递css选择字符串，默认返回第一个匹配的元素，
 * 如果需要返回全部匹配的元素需要指定第二个参数为true;
 * 返回原生的Element元素或者是所有匹配的Element组成的数组
 * @param {String} select,css选择器字符串
 * @param {Boolean} needAll,是否返回全部匹配的元素（默认只返回第一个）
 * @example
 * var tets1=W("div>a");
 * var test2=W("div>a",ture)[0];
 * @return {Element}
 */
function W(select,needAll){
	if(needAll)
		return document.querySelectorAll(select);
	else
		return document.querySelector(select);
}

/**
 * 空方法，用于需要空方法的地方，免得每次都创建
 */
W.noop = function(){};


W.debug=function(str){
	if(WiStorm.debug)
		alert(str);
};


/**
 * 模块load的事件封装
 * @param {String} name 语言包的名称
 * @param {view} view 要监听的view
 * @param {Function} callback load事件的触发
 */
W.viewLoaded=function(name,view,callback){
    view.addEventListener('load',function(e) {
		view.loaded=true;
		view.params=e.params;
        if(view.__||!name){
            callback(view.__);
            delete view.__;
        }
    });
	if(name)
		W.getLanguage(name,function(res){//加载语言
			view.__=res;
			if(view.loaded){
				callback(view.__);
				delete view.__;
			}  
		});
}


/**
 * 日期的toString方法扩展，输出更符合普通格式的字符串
 * @param {Date} d
 */
W.dateToString=function(d){
  var j={};
  j.m=d.getMonth()+1;
  j.d=d.getDate();
  j.h=d.getHours();
  j.mi=d.getMinutes();
  j.s=d.getSeconds();
  for(items in j){
    if(j[items]<10)
      j[items]="0"+j[items];
  }
  return d.getFullYear()+"-"+j.m+"-"+j.d+" "+j.h+":"+j.mi+":"+j.s;
}

/**
 * 
 * 兼容ios的字符串转日期对象
 * @param {String} str
 */
W.date=function(str) {
    var date = new Date();
    if(!str)
    	return date;
    var t=str.split(/[T\s]/);
    var str_before = t[0]; //获取年月日
    var str_after = t[1]; //获取时分秒
    var years = str_before.split('-')[0]; //分别截取得到年月日
    var months = str_before.split('-')[1] - 1;
    var days = str_before.split('-')[2];
    var hours = str_after.split(':')[0]||0;
    var mins = str_after.split(':')[1]||0;
    var seces = str_after.split(':')[2].replace("Z", "");
    var secs = seces.split('.')[0]||0;
    var smsecs = seces.split('.')[1]||0;
    if(str.indexOf("T")==-1){
    	date.setFullYear(years, months, days);
    	date.setHours(hours, mins, secs, smsecs);
    }else{
    	date.setUTCFullYear(years, months, days);
    	date.setUTCHours(hours, mins, secs, smsecs);
    }
    return date;
}

/**
 * 用于包含一个js文件到当前文件；
 * 包含时会先进行判断，是否已经包含过该文件，如果已经包含过则不处理；
 * @param {String} url  文件路径
 * @param {Function} callback 加载完成之后的回调方法
 */
W.include=function(url,callback,errorCall){
	var script=document.createElement("script");
	script.src=url;
	if(WiStorm.included.indexOf(script.src)!=-1){
		script.src=null;
		setTimeout(function(){callback(true)},0);
		return;
	}
	script.onload=callback;
	script.onabort=errorCall;
	script.onerror=errorCall;
	document.head.appendChild(script);

	//包含成功，把文件路径存储到WiStorm.included数组里
	WiStorm.included.push(script.src);
}

/**
 * 加载语言包
 * @param {name} 文件名
 */
W.getLanguage=function(name,callback){
	var url=WiStorm.root+"language/"+navigator.language.toUpperCase()+"/"+name+".json";
	W.getJSON(url,null,callback);
}


/**
 * 在文档加载时根据用户设置或者框架配置文件动态引入css
 * @param {String} cssName,css文件名（包含后缀）
 * @example
 * head><br>
 * title>单元测试页面 /title><br>
 * script src="wslib/WiStorm.js"> /script><br>
 * !--引入mui.css--><br>
 * script>link("mui.css")</script>
 * </head>
 */
W.link=function(cssName){
	var skinFolder=W.getSkin();
	var pathName=WiStorm.root+'skin/'+skinFolder+'/'+cssName;
	var l=document.createElement('link');
	l.href=pathName;
	l.rel="stylesheet";
	document.head.appendChild(l);
}


/**
 * @constructor
 * @description 所有ui类的超类；子类需使用伪原型继承；本身没有实际作用，主要用于被继承实现，继承例子查看下面：
 * @param {string} tag 需要创建的标签名
 * @extends {Element}
 * @example	
 *	new UI("div");
 * @property {json} prototype 基类的原型链，用于存储基类的方法
 * @return {Element}
 */
function WiStormUI(tag){
	var obj=document.createElement(tag);

	var funObj=WiStormUI.prototype;
	for(fun in funObj){
		obj[fun]=funObj[fun];
    }
    obj._type="WiStormUI";
    obj._parentType="Element";
	return obj;
}
/**
 * 定义类方法
 */
WiStormUI.prototype={
	merge:function(obj){
		var funObj=obj.__proto__;
		for (fun in funObj) {
			this[fun]=funObj[fun];
	    }
	    this._parentType=this._type;
	    this._type=obj.constructor.name;
	},
	getName:function(){
		return this._type;
	},
	getParentName:function(){
		return this._parentType;
	},
	template:function(dom,data){
		var htm=dom.innerHTML;
		this.innerHTML=htm.replace(/(\<|&lt;)\%.*?\%(&gt;|\>)/g,function(word){
			word=word.replace(/(\<|&lt;|&gt;|\>|%)/g,'');
  			return data[word]||'';
		});
	}
};


/**
 * 框架的ajax
 * @param {String} url
 * @param {Object} options，具体可参考http://dev.dcloud.net.cn/mui/ajax/
 */
W.ajax=function(url,options) {
	var json={
		dataType:"json",
		timeout:10000,
		type:"GET",
		success:W.noop,
		error:W.noop
	}
	var headers = {
		"X-Requested-With": "XMLHttpRequest",
		"Accept": "*/*",
		"Content-Type": "application/x-www-form-urlencoded"
	};
	json.url=url;
	Object.assign(json,options);
	Object.assign(headers,options.headers);
	
	json.type=json.type.toUpperCase();
    var data="";
    if(json.data){
	    for (items in json.data){
			data+="&"+items+"="+json.data[items];
		}
		if(json.type=="GET")
			json.url+="?"+data.slice(1);
    }
	
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.responseType=json.dataType||'json';
	if (json.timeout>0){
		xmlhttp.timeout=json.timeout;
		xmlhttp.ontimeout=function(){
			json.error(xmlhttp,'timeout',json);
		}
	}
	
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState === 4) {
			xmlhttp.onreadystatechange = W.noop;
			if ((xmlhttp.status >= 200 && xmlhttp.status < 300) || xmlhttp.status === 304 ||xmlhttp.status === 0){
				var result = xmlhttp.response||{"status_code":-1,"err_msg":"无返回信息"};
				json.success(result, xmlhttp, json);
			} else {
				json.error(xmlhttp,xmlhttp.status ? 'error' : 'abort', json);
			}
		}
	}
	xmlhttp.open(json.type,json.url,true);
	
	for (var name in json.headers) {
		xmlhttp.setRequestHeader(name,json.headers[name]);
	}
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(data);
    
    return xmlhttp;
};

/**
 * 简化的ajax，用get方式
 * @param {String} url
 * @param {Object} data
 * @param {Function} success
 * @param {String} dataType
 */
W.get=function(url,data,success,dataType){
	var options={
		data:data,
		dataType:dataType,//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:success,
		error:function(xhr,type,errorThrown){
			console.log(type+"___url:"+url);
		}
	};
	W.ajax(url,options);
}

/**
 * 简化的ajax，用post方式
 * @param {String} url
 * @param {Object} data
 * @param {Function} success
 * @param {String} dataType
 */
W.post=function(url,data,success,dataType){
		var options={
		data:data,
		dataType:dataType,//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:success,
		error:function(xhr,type,errorThrown){
			console.log(type+"___url:"+url);
		}
	};
	W.ajax(url,options);	
}

/**
 * 简化的ajax，用get方式,返回json格式数据
 * @param {String} url
 * @param {Object} data
 * @param {Function} success
 */
W.getJSON=function(url,data,success){
	var options={
		data:data,
		dataType:"json",
		type:'get',
		timeout:10000,
		success:success,
		error:function(xhr,type,errorThrown){
			console.log(type+"___url:"+url);
		}
	};
	W.ajax(url,options);
}


/**
 * 热切换当前引用的css文件（切换皮肤）
 * @param {String} folderName,skin/下的代表皮肤的目录名
 * @example
 * W.changeSkin("default");//切换成默认皮肤
 */
W.changeSkin=function(folderName){
	var skinFolder=W.getSkin();
	var allLink=W("link",true);
	var oldHref;
	for(var i=allLink.length-1;i>=0;i--){
		oldHref=allLink[i].href;
		allLink[i].href=oldHref.replace(WiStorm.root+"skin/"+skinFolder,WiStorm.root+"skin/"+folderName);
	}
	W.setSetting("skin",folderName);
}

/**
 * 返回当前应用的皮肤风格
 * @return {String}
 */
W.getSkin=function(){
	return W.getSetting("skin")||WiStorm.config.skin||"default";
}

/**
 * 按key返回用户设置的某个值
 * @param {String} key
 * @return {String}
 */
W.getSetting=function(key){
	return WiStorm.setting[key];
}

/**
 * 设置用户设置的值
 * @param {String} key
 * @param {Object} val
 */
W.setSetting=function(key,val){
	WiStorm.setting[key]=val;
	localStorage.setItem("_WiStormUserSetting_",JSON.stringify(WiStorm.setting));
}
/**
 * 返回元素的第j级祖先元素，
 * 当第二个参数是一个字符串时，那么此时相当于jq的parents()的用法
 * @param {Element} e,当前元素
 * @param {Number} j,祖先的层数或css选择器
 */
W.parents=function(e,j){
	if(typeof j=="number"){
		for(var i=0;i<j;i++){
			e=e.parentElement;
		}
		return e;
	}else{//以下代码未测试过
		var targets=document.querySelectorAll(j);//整个文档中符合选择器的元素
		var tl=targets.length;
		var parents=[];
		
		for(var p=e.parentElement;p;p=p.parentElement){
			for(var j=0;j<tl;j++){
				if(p==targets[j])
					return p;
			}
		}
	}
}

/**
 * 设置当前元素伪焦点，使用WiStormUI时有时需要伪焦点
 * @param {Element} dom,要设置伪焦点的元素
 */
W.focus=function(dom){
	dom.blur();
	W.blur();
	dom.setAttribute("data-w-focus","true");
	W.focus.target=dom;
}

/**
 * 把当前获得伪焦点的元素，取消伪焦点
 * @return {Element}
 */
W.blur=function(){
	var input=W.getFocus();
	if(input)
		input.setAttribute("data-w-focus","false");
	return input;
}

/**
 * 获取当前获得伪焦点的元素
 * @return {Element}
 */
W.getFocus=function(){
	return W.focus.target;
}

/**
 * 框架定义的警告框，按ios风格使用div重置,传入一个json,"title":"标题","content":"内容","callback": 点击确定后回调
 * @param {json} opt,弹出框配置
 * @example 
 * W.alert(json);<br>
 * W.alert("一切参数都是可选的，甚至可以直接传递一个字符串");<br>
 * W.alert("一切参数都是可选的，甚至可以直接传递一个字符串",callback);<br>
 */
W.alert=function (opt){
	var json={
		"title":___.app_name,
		"content":"",
		"ok":___.ok,
		"callback":function(){}
	}
	if(typeof opt=="string"||typeof opt=="number"){
		json.content=opt;
		json.callback=arguments[1]||function(){};
	}else
		Object.assign(json,opt);
		
	var obj=W.alertBox;
	if(obj){
		if(obj._show){
			obj.waiting.push(json);
		}else{
			obj.querySelector(".title").innerText=json.title;
			obj.querySelector(".alert").innerHTML=json.content;
			var ok=obj.querySelector(".alert_but>div");
			ok.innerText=json.ok;
			obj.callback=json.callback;
			obj.show();
		}
	}else{
		obj=new WiStormUI("div");
		obj.className="cover_paper alert_box fadeIn";
		obj.innerHTML='<div class="tabel_center"><div class="alert_view content fromTop"><div class="alert_content"><h3 class="title">'+json.title+'</h3><h4 class="alert">'+json.content+'</h4></div><div class="alert_but"><div>'+json.ok+'</div></div></div></div>';
		obj.show=WiStormUI.show;
		obj.hide=WiStormUI.hide;
		obj.callback=json.callback;
		obj.waiting=new Array();
		obj._show=true;
		obj.querySelector(".alert_but>div").addEvent("click",function(){
			W.alertBox.callback();
			W.alertBox.hide();
			if(obj.waiting.length){
				setTimeout("W.alert(W.alertBox.waiting.shift());",500);
			}
		},false);
		document.body.appendChild(obj);
		W.alertBox=obj;
	}
}

/**
 * 框架定义的带确认的警告框，按ios风格使用div重置,传入一个json,
 * "title":"标题","content":"内容","callback": 点击确定后回调,"y":"确定按钮文字","n":"取消按钮文字"
 * @param {json} opt,弹出框配置
 * @example 
 * W.confirm(json);<br>
 * W.confirm("一切参数都是可选的，甚至可以直接传递一个字符串");<br>
 * W.confirm("一切参数都是可选的，甚至可以直接传递一个字符串",callback);<br>
 */
W.confirm=function(opt){
	var json={
		"title":___.app_name,
		"content":"",
		"y":___.ok,
		"n":___.cancel,
		"callback":function(){}
	}
	if(typeof opt=="string"||typeof opt=="number"){
		json.content=opt;
		json.callback=arguments[1]||function(){};
	}else
		Object.assign(json,opt);
		
	var obj=W.confirmBox;
	if(obj){
		if(obj._show){
			obj.waiting.push(json);
		}else{
			obj.querySelector(".title").innerText=json.title;
			obj.querySelector(".alert").innerHTML=json.content;
			obj.querySelector(".alert_but>._but").innerText=json.y;
			obj.querySelector(".alert_but>.no").innerText=json.n;
			obj.callback=json.callback;
			obj.show();
		}
	}else{
		obj=new WiStormUI("div");
		obj.className="cover_paper alert_box fadeIn";
		obj.innerHTML='<div class="tabel_center"><div class="alert_view content fromTop"><div class="alert_content"><h3 class="title">'+json.title+'</h3><h4 class="alert">'+json.content+'</h4></div><div class="alert_but"><div class="_but" style="border-right:1px solid #ccc">'+json.y+'</div><div class="_but no">'+json.n+'</div</div></div></div>';
		obj.show=WiStormUI.show;
		obj.hide=WiStormUI.hide;
		obj.callback=json.callback;
		obj.waiting=new Array();
		obj._show=true;

		obj.querySelector(".alert_but>._but").addEvent("click",function(){
			W.confirmBox.callback(true);
			W.confirmBox.hide();
			if(obj.waiting.length){
				setTimeout("W.confirm(W.confirmBox.waiting.shift());",500);
			}
		},false);
		obj.querySelector(".alert_but>.no").addEvent("click",function(){
			W.confirmBox.callback(false);
			W.confirmBox.hide();
			if(obj.waiting.length){
				setTimeout("W.confirm(W.confirmBox.waiting.shift());",500);
			}
		},false);
		document.body.appendChild(obj);
		W.confirmBox=obj;
	}
}

/**
 * 框架定义的提示输入框，按ios风格使用div重置,传入一个json,
 * "title":"标题","content":"内容","callback": 点击确定后回调,"y":"确定按钮文字","n":"取消按钮文字"
 * @param {json} opt,弹出框配置
 * @example 
 * W.prompt(json);<br>
 * W.prompt("一切参数都是可选的，甚至可以直接传递一个字符串");<br>
 * W.prompt("一切参数都是可选的，甚至可以直接传递一个字符串",callback);<br>
 */
W.prompt=function(opt){
	var json={
		"title":___.app_name,
		"content":"",
		"y":___.ok,
		"n":___.cancel,
		"callback":function(){}
	}
	if(typeof opt=="string"||typeof opt=="number"){
		json.content=opt;
		json.callback=arguments[1]||function(){};
	}else
		Object.assign(json,opt);
		
	var obj=W.promptBox;
	if(obj){
		if(obj._show){
			obj.waiting.push(json);
		}else{
			obj.querySelector(".title").innerText=json.title;
			obj.querySelector(".alert").innerHTML=json.content;
			obj.querySelector(".alert_but>._but").innerText=json.y;
			obj.querySelector(".alert_but>.no").innerText=json.n;
			obj.callback=json.callback;
			obj.show();
		}
	}else{
		obj=new WiStormUI("div");
		obj.className="cover_paper alert_box fadeIn";
		obj.innerHTML='<div class="tabel_center" style="display:block;"><div class="alert_view content fromTop"><div class="alert_content" style="padding-bottom:0"><h3 class="title">'+json.title+'</h3><h4 class="alert">'+json.content+'</h4><input type="text" style="margin-bottom: .5em;"></div><div class="alert_but"><div class="_but" style="border-right:1px solid #ccc">'+json.y+'</div><div class="_but no">'+json.n+'</div</div></div></div>';
		obj.show=WiStormUI.show;
		obj.hide=WiStormUI.hide;
		obj.callback=json.callback;
		obj.waiting=new Array();
		obj._show=true;

		obj.querySelector(".alert_but>._but").addEvent("click",function(){
			var input=W.promptBox.querySelector("input");
			W.promptBox.callback(input.value);
			W.promptBox.hide();
			if(obj.waiting.length){
				setTimeout("W.prompt(W.promptBox.waiting.shift());",500);
			}
			input.value=null;
		},false);
		obj.querySelector(".alert_but>.no").addEvent("click",function(){
			W.promptBox.callback(null);
			W.promptBox.hide();
			if(obj.waiting.length){
				setTimeout("W.prompt(W.promptBox.waiting.shift());",500);
			}
			W.promptBox.querySelector("input").value=null;
		},false);
		document.body.appendChild(obj);
		W.promptBox=obj;
	}
}

/**
 * 框架定义的信息提示框，按ios风格使用div重置,传入要提示的字符串
 * @param {String} str,信息字符串
 * @example 
 * W.toast("5秒后会自动消失");
 */
W.toast=function(str){
	var obj=W.toastBox;
	if(obj&&!obj._show){
		if(W("input:focus")){
			obj.style.top="20%";
		}else{
			obj.style.top="70%";
		}
		obj.innerText=str;
		obj.show();
		setTimeout(function(){obj.hide()},5000);
	}else{
		obj=new WiStormUI("div");
		obj.className="toast alert_box fromDown";
		obj.innerText=str;
		obj.show=function(){
			this.className=this.className.replace("toTop","fromDown");
			this._show=true;
		};
		obj.hide=function(){
			this.className=this.className.replace("fromDown","toTop");
			this._show=false;
			W.toastBox=false;
			var that=this;
			setTimeout(function(){that.parentNode.removeChild(that)},500);
		};
		obj._show=true;
		if(W("input:focus")){
			obj.style.top="20%";
		}else{
			obj.style.top="70%";
		}
		document.body.appendChild(obj);
		W.toastBox=obj;
		setTimeout(function(){obj.hide()},5000);
	}
}

W.loading=function(b){
	if(!W.loading._load){
		var load=new WiStormUI("div");
		load.className="loading";
		load.innerHTML="<span></span><div class='text'></div>";
		W.loading._load=load;
		document.body.appendChild(load);
	}
	if(b){
		if(typeof b=="string"||typeof b=="number")
			W.loading._load.querySelector("div").innerText=b;
		W.loading._load.style.display="block";
	}else {
		W.loading._load.querySelector("div").innerText="";
		W.loading._load.style.display="none";
	}
}

W.update=function(url){
	plus.nativeUI.showWaiting("升级中...");
	var dtask=plus.downloader.createDownload(url,{method:"GET"},function(d,status){
	    if ( status == 200 ) { 
	        console.log( "Download wgtu success: " + d.filename );
		    plus.runtime.install(d.filename,{},function(){
	        	plus.nativeUI.closeWaiting();
	    	    plus.nativeUI.alert("Update wgtu success, restart now!",function(){
	            	plus.runtime.restart();
	        	});
	        },function(e){
	            plus.nativeUI.closeWaiting();
	            alert("Update wgtu failed: "+e.message);
	        });
	    } else {
	        plus.nativeUI.closeWaiting();
	        alert( "Download wgtu failed: " + status ); 
	    } 
	});
	dtask.addEventListener('statechanged',function(d,status){
	    console.log("statechanged: "+d.state);
	});

	//删除旧的更新包(如果有)
	plus.io.requestFileSystem( plus.io.PUBLIC_DOWNLOADS,function(fs){
		fs.root.createReader().readEntries(function(entries){
			for(var i=0;i<entries.length; i++){
				if(entries[i].name.search(".wgt")!=-1)
					entries[i].remove();
			}
		},function(e){
			alert("Read entries failed: "+e.message);
		});
	},function(e){
		alert("Request file system failed: "+e.message);
	});
	
	//下载新更新包
	dtask.start();
}

W.checkUpdate=function(){
	var check_url=WiStorm.config.update_url;
	W.getJSON(check_url,null,function(date){
		if(date.version!=WiStorm.version){
			W.confirm({
				"title":"应用更新",
				"content":"检测到有新版本："+date.version+"，"+date.content+"更新包大小："+date.size+"，是否现在更新？",
				"y":"现在更新",
				"n":"下次再说",
				"callback":function(b){
					if(b){
						if(date[WiStorm.version])
							W.update(date[WiStorm.version]);
						else
							W.alert("抱歉，没有您的版本升级包，请您到应用商店更新应用或到官网获取完整安装包");
					}
				}
			});
		}
	});
}

/**
 * 判断是否email
 * @param {Object} str
 */
W.isEmail=function(str){
	var exp=new RegExp("^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$");
	return exp.test(str);
}

/**
 * 把json从本地存储里获取出来，并转换成json对象，如果非json数据，第二个参数传true
 * @param {String} name
 * @param {Boolean} notJson
 */
W.ls=function(name,notJson){
	var r=localStorage.getItem(name);
	if(r&&r!=""){
		if(notJson){
			return r;
		}else{
			try{
				return JSON.parse(r);
			}catch(err){
				return null;
			}
		}
	}else return null;
}

/**
 * 存储json到本地存储，如果不是json对象，则第三个参数传true
 * @param {String} name
 * @param {Object} val
 * @param {Boolean} notJson
 */
W.setLS=function(name,val,notJson){
	if(notJson)
		localStorage.setItem(name,val);
	else 
		localStorage.setItem(name,JSON.stringify(val)); 
}

/**
 * 返回当前url内的search数据数组（即?后面部分）
 * @example
 * //url="www.baidu.com?w=123"
 * var test=W.getSearch();
 * alert(test.w);
 */
W.getSearch=getSearch;
getSearch=undefined;

/**
 * 设置cookie，expiredays负数代表分钟，正数的单位为“天”（24小时）path为cookie的有效路径
 * @param {String} c_name
 * @param {String} value
 * @param {Number} expiredays
 * @param {String} path
 */
W.setCookie=function(c_name,value,expiredays,path){
	var exdate=new Date();
	expiredays=expiredays||1;//默认为1天
	if(expiredays>1)
		exdate.setDate(exdate.getDate()+expiredays);
	else if(expiredays>0)
		exdate.setHours(exdate.getHours()+expiredays*24);
	else 
		exdate.setMinutes(exdate.getMinutes()-expiredays);
	var domain="";
	if(path){
		domain="; path="+path+";";
	}else{
		domain="; path=/; domain="+document.domain;
	}
	var tem=c_name+"="+encodeURIComponent(value)+((expiredays==null)?"":";expires="+exdate.toGMTString())+domain;
	document.cookie=tem;
}

/**
 * 获取cookie
 * @param {String} c_name
 */
W.getCookie=function(c_name){
	if(document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name+"=");
		if (c_start!=-1){ 
		    c_start=c_start + c_name.length+1;
		    c_end=document.cookie.indexOf(";",c_start);
		    if(c_end==-1)c_end=document.cookie.length;
		    return decodeURIComponent(document.cookie.substring(c_start,c_end));
	    } 
	}
}

//重新加载用户设置
W._getSeting=function(){
	var setting=localStorage.getItem("_WiStormUserSetting_");
	try{
		if(setting)
			WiStorm.setting=JSON.parse(setting);
		else
			WiStorm.setting={};
	}catch(err){
		console.log(___.setting_echange_skinrror);
	}
	delete setting;
}

W.logout=function(){
	W.setCookie("access_token","");
	W.setSetting("user",null);
	W.setSetting("pwd",null);
	W._login=false;
	top.location=WiStorm.root+'index.html?intent=logout';
}

W.wxLogin=function(s){
	W.setCookie("access_token","");
	W.setSetting("user",null);
	var state=s||'sso_login';
	if(WiStorm.test_mode){
		var url = WiStorm.config.wx_login; //测试使用
		url = url.replace(/\?\S*/, "");
		url = W.encoded(url);
		top.location = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WiStorm.config.wx_app_id+"&redirect_uri=http://h5.bibibaba.cn/jump.html&response_type=code&scope=snsapi_userinfo&state="+url+"#wechat_redirect";
	}else{
		W.setCookie("__login_redirect_uri__",location.href,-15);
		var u=encodeURIComponent(WiStorm.config.wx_login);
		top.location="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WiStorm.config.wx_app_id+"&redirect_uri="+u+"&response_type=code&scope=snsapi_userinfo&state="+state+"#wechat_redirect";
	}				
}

//静默授权获取open_id
W.getOpenId=function(needweixin,s){
	if(needweixin||!WiStorm.agent.weixin)return;
	s=s||"getOpenId";
	W.setCookie("__login_redirect_uri__",location.href,-15);
	var u=encodeURIComponent(WiStorm.config.wx_login);
	top.location="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+WiStorm.config.wx_app_id+"&redirect_uri="+u+"&response_type=code&scope=snsapi_base&state="+s+"#wechat_redirect";
}

/**
 * 输出api返回的错误信息
 * @param {Object} code
 */
W.errorCode=function(json){
	if(json.status_code==3){
		W.confirm("错误码：3；登录凭证已失效，点击确定登录；",function(b){
			if(b){
				if(WiStorm.agent.weixin){
					W.wxLogin();
				}else{
					W.setCookie("__login_redirect_uri__",location.href,-15);
					top.location=WiStorm.root+"index.html";
				}
			}
		});
	}else{
		W.alert("error_code："+json.status_code+"；error_msg："+json.err_msg);
	}
}



///下面是一些进入应用则需要执行的代码，例如加载配置文件，语言文件等

//根据页面路径获取绝对路径
var tem=location.href;
var s=tem.search("/www/")+5;
WiStorm.root=tem.slice(0,s);
if(location.protocol=="http:"||location.protocol=="https:"){//浏览器环境
	WiStorm.root=WiStorm_root;
	WiStorm.isWeb=true;
}
tem=undefined;
s=undefined;

/**
 * 获取本地用户存储
 * 在微信中每隔24小时会清理一次，所以基本上只能得到本次登录之后存储的数据
 */
W._getSeting();
window._user=W.getSetting("user");
if(_user&&_user.access_token){
	W._login=true;
}else 
	W._login=false;



W.login=function(){
	if(_g.sso_login){//已经授权
		if (!_g.access_token) {//登录不成功
			if (_g.status_code == 1) {//未绑定
				W.toRegister();
				return;
			}else{//登录失败
				W.errorCode(_g);
				return;
			}
		} else {
			//登录成功
			W.setSetting("openId",_g.openid);
			W.setCookie("access_token", _g.access_token,1);
			var gd={
				access_token: _g.access_token
			}
			if(_g.cust_id){
				gd.cust_id=_g.cust_id;
			}else if(_g.temporary){//临时页面
				gd.login_id=_g.openid;
			}else{
				W.toRegister();
				return;
			}
			Wapi.user.get(function(res) {//获取用户数据
				if (res.status_code) {
					W.alert(res.err_msg+"；获取用户信息失败；error_code:"+res.status_code);
					return;
				} else {
					W._loginSuccess(res);
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent("W.loginSuccess", false, false);//当页面load事件触发并且已经登录成功则会触发该事件,用于某些需要不经过登录页也可以直接访问，但是又需要用户授权登录的页面
					window.dispatchEvent(evt);
				}
			},gd);
		}
	}else{
		W.alert("没有sso_login");
	}
}
W._loginSuccess=function(res){
	W._login = true;//表示已登录
	_user=res;
	_user.open_id=res.login_id;
	_user.access_token=W.getCookie("access_token");
	//如果是商户登录，seller_id等于他自己的cust_id
	res.seller_id=(res.cust_type==2)?res.cust_id:res.seller_id;
	if(res.privilege){
		try{
			res.privilege=JSON.parse(res.privilege);
		}catch(e){
			//TODO handle the exception
			delete res.privilege
		}
	}
	W.setSetting("user",res);
}

W.toRegister=function(){
	W.alert("没有帐号或者未启用，请先注册",function(){
		W.setCookie("__login_redirect_uri__",location.href,-60);
		var reg=/src\/baba\/\S*\.html.*/;
		var url=location.href;
		var registerUrl="index.html?intent=register";
		if(reg.test(url)){
			registerUrl="index.html?intent=register&type=user";
		}
		top.location=WiStorm.root+registerUrl;
	});
}

if(_g.needUser&&!_g.openid){
	W.wxLogin();
}else if(_g.needOpenId=="true"){
	if(!_g.openid){
		var pi=W.ls('_useropenid',true);
		if(!pi)
			W.getOpenId();
		else _g.openid=pi;
	}else{
		W.setLS('_useropenid',_g.openid,true);
	}
}
if(!W._login&&location.pathname.indexOf("index.html")<0&&_g.intent!="logout"){
	if(WiStorm.agent.weixin){
		if(_g.sso_login){
			window.addEventListener("load",W.login);
		}else{
			W.wxLogin();
		}
	}else{
		W.setCookie("__login_redirect_uri__",location.href,-15);
		top.location=WiStorm.root+"index.html";
	}
}else if(W._login){
	window.addEventListener("load",function(){
		var evt = document.createEvent("HTMLEvents");
		evt.initEvent("W.loginSuccess", false, false);//当页面load事件触发并且已经登录成功则会触发该事件,用于某些需要不经过登录页也可以直接访问，但是又需要用户授权登录的页面
		window.dispatchEvent(evt);
	});
}