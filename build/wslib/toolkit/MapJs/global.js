//自动关闭提示框  
function Alerts(str) {
    var msgw, msgh, bordercolor;
    msgw = 350; //提示窗口的宽度  
    msgh = 80; //提示窗口的高度  
    titleheight = 25 //提示窗口标题高度  
    bordercolor = "#FD9900"; //提示窗口的边框颜色  
    titlecolor = "#FD9900"; //提示窗口的标题颜色  
    var sWidth, sHeight;
    //获取当前窗口尺寸  
    sWidth = document.body.offsetWidth;
    sHeight = document.body.offsetHeight;
    //    //背景div  
    var bgObj = document.createElement("div");
    bgObj.setAttribute('id', 'alertbgDiv');
    bgObj.style.position = "absolute";
    bgObj.style.top = "0";
    bgObj.style.background = "#E8E8E8";
    bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
    bgObj.style.opacity = "0.6";
    bgObj.style.left = "0";
    bgObj.style.width = sWidth + "px";
    bgObj.style.height = sHeight + "px";
    bgObj.style.zIndex = "10000";
    document.body.appendChild(bgObj);
    //创建提示窗口的div  
    var msgObj = document.createElement("div")
    msgObj.setAttribute("id", "alertmsgDiv");
    msgObj.setAttribute("align", "center");
    msgObj.style.background = "white";
    msgObj.style.border = "1px solid " + bordercolor;
    msgObj.style.position = "absolute";
    msgObj.style.left = "50%";
    msgObj.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    //窗口距离左侧和顶端的距离   
    msgObj.style.marginLeft = "-225px";
    //窗口被卷去的高+（屏幕可用工作区高/2）-150  
    msgObj.style.top = document.body.scrollTop + (window.screen.availHeight / 2) - 150 + "px";
    msgObj.style.width = msgw + "px";
    msgObj.style.height = msgh + "px";
    msgObj.style.textAlign = "center";
    msgObj.style.lineHeight = "25px";
    msgObj.style.zIndex = "10001";
    document.body.appendChild(msgObj);
    //提示信息标题  
    var title = document.createElement("h4");
    title.setAttribute("id", "alertmsgTitle");
    title.setAttribute("align", "left");
    title.style.margin = "0";
    title.style.padding = "3px";
    title.style.background = bordercolor;
    title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
    title.style.opacity = "0.75";
    title.style.border = "1px solid " + bordercolor;
    title.style.height = "18px";
    title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
    title.style.color = "white";
    title.innerHTML = "提示消息";
    document.getElementById("alertmsgDiv").appendChild(title);
    //提示信息  
    var txt = document.createElement("p");
    txt.setAttribute("id", "msgTxt");
    txt.style.margin = "16px 0";
    txt.innerHTML = str;
    document.getElementById("alertmsgDiv").appendChild(txt);
    //设置关闭时间  
    window.setTimeout("closewin()", 2000);
}
function closewin() {
    document.body.removeChild(document.getElementById("alertbgDiv"));
    document.getElementById("alertmsgDiv").removeChild(document.getElementById("alertmsgTitle"));
    document.body.removeChild(document.getElementById("alertmsgDiv"));
}


//function inArray(needle, array) {
//    if (typeof needle == "string" || typeof needle == "number") {
//        var len = array.length;
//        for (var i = 0; i < len; i++) {
//            if (needle === array[i]) {
//                return true;
//            }
//        }
//        return false;
//    }
//}

function getDirect(direct) {
    var obj_direct = 0;
    if ((direct >= 0 && direct <= 22) || (direct > 337 && direct <= 360)) {
        obj_direct = 0;
    }
    else if (direct > 22 && direct <= 67) {
        obj_direct = 45;
    }
    else if (direct > 67 && direct <= 112) {
        obj_direct = 90;
    }
    else if (direct > 112 && direct <= 157) {
        obj_direct = 135;
    }
    else if (direct > 157 && direct <= 202) {
        obj_direct = 180;
    }
    else if (direct > 202 && direct <= 247) {
        obj_direct = 225;
    }
    else if (direct > 247 && direct <= 292) {
        obj_direct = 270;
    }
    else if (direct > 292 && direct <= 337) {
        obj_direct = 315;
    }
    else {
        obj_direct = 0;
    }
    return obj_direct;
}

function getIconStatus(vehicle) {
    var icon_status = "stop";
    if (!getOnLine(vehicle)) {
        icon_status = "offline";
    } else {
        if (vehicle.active_gps_data.uni_alerts.length > 0) {
            icon_status = "alert";
        } else {
            if (vehicle.active_gps_data.speed > 10) {
                icon_status = "run";
            } else {
                icon_status = "stop";
            }
        }
    }
    return icon_status;
}

function getIconName(vehicle) {
    var icon_name = "normal";
    if (vehicle.obj_type == 0) {
        icon_name = "normal";
    }
    return icon_name;
}

function getIcon(vehicle, map_type) {
    switch (map_type) {
        case MAP_TYPE_GOOGLE:
            var icon = new google.maps.MarkerImage(); //标注
            var icon_name = getIconName(vehicle);
            var icon_status = getIconStatus(vehicle);
            icon_direct = getDirect(vehicle.active_gps_data.direct);
            //icon.size = new google.maps.Size(20, 20);
            icon.anchor = new google.maps.Point(10, 10);
            //icon.url = "../../Content/MapImages/" + icon_name + "_" + icon_status + "_" + icon_direct + ".png";
            icon.url = "../../stylesheets/objects/" + icon_name + "_" + icon_status + "_" + icon_direct + ".gif";
            return icon;
            break;
        case MAP_TYPE_BAIDU:
            var icon_name = getIconName(vehicle);
            var icon_status = getIconStatus(vehicle);
            icon_direct = getDirect(vehicle.active_gps_data.direct);
            var icon = new BMap.Icon("../../stylesheets/objects/" + icon_name + "_" + icon_status + "_" + icon_direct + ".gif", new BMap.Size(28, 28));
            //icon.anchor = 10;
            return icon;
            break;
    }
}

function getPoiIcon(poi, map_type) {
    switch (map_type) {
        case MAP_TYPE_GOOGLE:
            var icon = new google.maps.MarkerImage(); //标注
            icon.anchor = new google.maps.Point(0, 0);
            icon.url = "../../images/poi_normal.gif";
            return icon;
            break;
        case MAP_TYPE_BAIDU:
            var icon = new BMap.Icon("../../images/poi_normal.gif", new BMap.Size(6, 6));
            icon.anchor = 0;
            return icon;
            break;
    }
}

Date.prototype.format = function (format) {
    var o =
    {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

function dateDiff(sDate1, sDate2, mode) {     //sDate1和sDate2是2004-10-18格式
    var iDays;
    if (mode == "dd") {
        iDays = parseInt(Math.abs(sDate1 - sDate2) / 1000 / 60 / 60 / 24);    //把相差的毫秒数转换为天数
    } else if (mode == "mm") {
        iDays = parseInt(Math.abs(sDate1 - sDate2) / 1000 / 60);    //把相差的毫秒数转换为分钟
    }
    return iDays;
}

function getMapContent(vehicle, if_playback) {
    var show_mode = 2;
    var rcv_time = "";
    var httpath = window.location.href;
    if (httpath.indexOf("PlayBackaInfo") != -1)//除了回放显示gps_time 其他都显示rcv_time
        rcv_time = NewDate(vehicle.active_gps_data.gps_time);
    else
        rcv_time = NewDate(vehicle.active_gps_data.rcv_time);

    //    var rcv_time = NewDate(vehicle.active_gps_data.gps_time);
    rcv_time = rcv_time.format("yyyy-MM-dd hh:mm:ss");
    var _vehiclesim = vehicle.sim;
    if (_vehiclesim === undefined) {
        _vehiclesim = "";
    }
    var content = "<div class='zhishichuang'><div class='wind'>";
    content += "<p><span><font style='font-size: 15px; font-weight:bold; font-family:微软雅黑;' >" + vehicle.nick_name + "</font></span>" + "                     ";
    if (if_playback) {
        show_mode = 3;
    } else {
        show_mode = 2;
    }
    var wifis = vehicle.active_gps_data.signal;
    var isonline = getOnLine(vehicle);
    if (wifis <= 10) {
        content += "<img src='../../images/wifi1.png'  title='信号差'/> ";
        if (vehicle.active_gps_data.uni_status[0] != 8197) {
            if (vehicle.active_gps_data.gps_flag == 1)
                content += "<img src='../../images/gps.png' title='无定位' />  ";
            else if (vehicle.active_gps_data.gps_flag == 2)
                content += "<img src='../../images/gps_g.png' title='定位' />";
        }
        content += "</p>";
    }
    else if (wifis > 10 && wifis <= 15) {
        content += "<img src='../../images/wifi2.png' title='信号弱' />  ";
        if (vehicle.active_gps_data.uni_status[0] != 8197) {
            if (vehicle.active_gps_data.gps_flag == 1)
                content += "<img src='../../images/gps.png' title='无定位' />  ";
            else if (vehicle.active_gps_data.gps_flag == 2)
                content += "<img src='../../images/gps_g.png' title='定位' />";
        }
        content += "</p>";
    }
    else if (wifis > 15 && wifis <= 20) {
        content += "<img src='../../images/wifi3.png'  title='信号良'/>  ";
        if (vehicle.active_gps_data.uni_status[0] != 8197) {
            if (vehicle.active_gps_data.gps_flag == 1)
                content += "<img src='../../images/gps.png' title='无定位' />  ";
            else if (vehicle.active_gps_data.gps_flag == 2)
                content += "<img src='../../images/gps_g.png' title='定位' />";
        }
        content += "</p>";
    }
    else if (wifis > 20) {
        content += "<img src='../../images/wifi4.png' title='信号强' />  ";
        if (vehicle.active_gps_data.uni_status[0] != 8197) {
            if (vehicle.active_gps_data.gps_flag == 1)
                content += "<img src='../../images/gps.png' title='无定位' />  ";
            else if (vehicle.active_gps_data.gps_flag == 2)
                content += "<img src='../../images/gps_g.png' title='定位' />";
        }
        content += "</p>";
    }

    if (show_mode == 3 || getOnLine(vehicle)) {
        content += "<p><span><font color='#244FAF'>车辆状态：</font></span>" + getStatusDesc(vehicle, show_mode) + "</p>";
    } else {
        content += "<p><span><font color='#244FAF'>SIM卡号：</font></span>" + _vehiclesim + "</p>";
    }
    content += "<p><span><font color='#244FAF'>定位时间：</font></span>" + rcv_time + "</p>";
    // 加入油耗
    if(vehicle.active_gps_data.fuel > 0){
        content += "<p><span><font color='#244FAF'>累计油耗：</font></span>" + vehicle.active_gps_data.fuel.toFixed(0) + "升</p>";
    }
    // 如果将到期30天内，则进行续费提示
    var now = new Date();
    if (typeof (vehicle.service_end_date) != "undefined" && vehicle.service_end_date != null) {
        rcv_time = NewDate(vehicle.service_end_date);
    }
    else
        rcv_time = "";
    if (dateDiff(rcv_time, now, "dd") < 30) {
        content += "<p><span><font color='#CD0200'>服务到期：</font></span>" + vehicle.service_end_date + "</p>";
    }
    content += "</div></div>";
    return content;
}

/*
五、	终端状态定义
a)	设防：STATUS_FORTIFY = 0x2001
b)	锁车：STATUS_LOCK = 0x2002
c)	基站定位：STATUS_NETLOC = 0x2003
d)	ACC状态：STATUS_ACC = 0x2004
e)	省电状态：STATUS_SLEEP = 0x2005
f)	报警器检测线：STATUS_ALARM = 0x2006
g)	继电器检测线：STATUS_RELAY = 0x2007
h)	自定义IO1：STATUS_INPUT1 = 0x2008
i)	自定义IO2：STATUS_INPUT2 = 0x2009
j)	自定义IO3：STATUS_INPUT3 = 0x200A
k)	短信发送状态：STATUS_SMS = 0x200B

六、	终端报警定义
a)	紧急报警：ALERT_SOS = 0x3001
b)	超速报警：ALERT_OVERSPEED = 0x3002
c)	震动报警：ALERT_VIRBRATE = 0x3003
d)	位移报警：ALERT_MOVE = 0x3004
e)	防盗器报警：ALERT_ALARM = 0x3005
f)	非法行驶报警：ALERT_INVALIDRUN = 0x3006
g)	进围栏报警：ALERT_ENTERGEO = 0x3007
h)	出围栏报警：ALERT_EXITGEO = 0x3008
i)	断电报警：ALERT_CUTPOWER = 0x3009
j)	低电压报警：ALERT_LOWPOWER = 0x300A
k)	GPS天线断路报警：ALERT_GPSCUT = 0x300B
l)	疲劳驾驶报警：ALERT_OVERDRIVE = 0x300C
m)	非法启动：ALERT_INVALIDACC = 0x300D
n)	非法开车门：ALERT_INVALIDDOOR = 0x300E
*/
// show_mode 
// 1: 车辆列表中
// 2: 实时监控中
// 3: 轨迹回放中
function getStatusDesc(vehicle, show_mode) {
    /*
    离线，1--显示SIM卡号, 2--离线1个小时内小时显示“离线 <1小时“，超过1个小时，显示离线“离线 xx个小时”
    在线，有效定位，速度超过10公里，显示：行驶，其他状态 xx公里/小时，速度低于等于10公里，显示：静止，其他状态
    在线，无效定位，如果信号小于指定值，速度超过10公里，显示：盲区，速度低于等于10公里，显示：静止
    */
    var desc = "";
    // 如果数据接收时间在10分钟以内，认为在线，否则为离线
    var now = new Date();
    rcv_time = NewDate(vehicle.active_gps_data.rcv_time);
    if (show_mode == 3 || dateDiff(now, rcv_time, "mm") < 1440) {
        if (vehicle.active_gps_data.gps_flag % 2 == 0) {
            if (vehicle.active_gps_data.speed > 10) {
                desc = "行驶";
                if (getUniStatusDesc(vehicle.active_gps_data.uni_status) != ",省电状态")
                    desc += getUniStatusDesc(vehicle.active_gps_data.uni_status);
                desc += getUniAlertsDesc(vehicle.active_gps_data.uni_alerts) + " " + parseInt(vehicle.active_gps_data.speed) + "公里/小时";
            } else {
                desc = "静止";
                if (getUniStatusDesc(vehicle.active_gps_data.uni_status) != ",省电状态")
                    desc += getUniStatusDesc(vehicle.active_gps_data.uni_status);
                desc += getUniAlertsDesc(vehicle.active_gps_data.uni_alerts);
            }
        } else {
            if (vehicle.active_gps_data.speed > 10) {
                desc = "行驶";
                if (getUniStatusDesc(vehicle.active_gps_data.uni_status) != ",省电状态")
                    desc += getUniStatusDesc(vehicle.active_gps_data.uni_status);
                desc += getUniAlertsDesc(vehicle.active_gps_data.uni_alerts) + " " + parseInt(vehicle.active_gps_data.speed) + "公里/小时";
            }
            else {
                desc = "静止";
                if (getUniStatusDesc(vehicle.active_gps_data.uni_status) != ",省电状态")
                    desc += getUniStatusDesc(vehicle.active_gps_data.uni_status);
                desc += getUniAlertsDesc(vehicle.active_gps_data.uni_alerts);
            }
            //            else {
            //                desc = "静止" + getUniStatusDesc(vehicle.active_gps_data.uni_status) + getUniAlertsDesc(vehicle.active_gps_data.uni_alerts);
            //            }
        }
    } else {
        if (show_mode == 1) {
            var now = new Date();
            rcv_time = NewDate(vehicle.active_gps_data.rcv_time);
            var m = dateDiff(now, rcv_time, "mm");
            if (m < 1440) {
                desc = "离线 < 24小时";
            } else {
                desc = "离线 " + parseInt(m / 60 / 24) + " 天";
            }
        } else {
            desc = "";
        }
    }
    return desc;
}




//处理js时间转化的方法
function NewDate(str) {
    var date = new Date();
    var str_before = str.split('T')[0]; //获取年月日
    var str_after = str.split('T')[1]; //获取时分秒
    var years = str_before.split('-')[0]; //分别截取得到年月日
    var months = str_before.split('-')[1] - 1;
    var days = str_before.split('-')[2];
    var hours = str_after.split(':')[0];
    var mins = str_after.split(':')[1];
    var seces = str_after.split(':')[2].replace("Z", "");
    var secs = seces.split('.')[0];
    var smsecs = seces.split('.')[1];
    date.setUTCFullYear(years, months, days);
    date.setUTCHours(hours, mins, secs, smsecs);
    return date;
}


function getUniStatusDesc(uni_status) {
    var desc = "";
    for (var i = 0; i < uni_status.length; i++) {
        switch (uni_status[i]) {
            //case STATUS_ACC: desc += ",启动"; break;                                 
            case STATUS_FORTIFY: desc += ",设防"; break;
            case STATUS_LOCK: desc += ",锁车"; break;
            case STATUS_NETLOC: desc += ",基站定位"; break;
            //case STATUS_SLEEP: desc += ",省电状态"; break;
        }
    }
    return desc;
}

function getUniAlertsDesc(uni_alerts) {
    var desc = "";
    for (var i = 0; i < uni_alerts.length; i++) {
        switch (uni_alerts[i]) {
            case ALERT_SOS: desc += ",紧急报警"; break;
            case ALERT_OVERSPEED: desc += ",超速报警"; break;
            case ALERT_VIRBRATE: desc += ",震动报警"; break;
            case ALERT_MOVE: desc += ",位移报警"; break;
            case ALERT_ALARM: desc += ",防盗器报警"; break;
            case ALERT_INVALIDRUN: desc += ",非法行驶报警"; break;
            case ALERT_ENTERGEO: desc += ",进围栏报警"; break;
            case ALERT_EXITGEO: desc += ",出围栏报警"; break;
            case ALERT_CUTPOWER: desc += ",断电报警"; break;
            case ALERT_LOWPOWER: desc += ",低电压报警"; break;
            case ALERT_GPSCUT: desc += ",GPS断线报警"; break;
            case ALERT_OVERDRIVE: desc += ",疲劳驾驶报警"; break;
            case ALERT_INVALIDACC: desc += ",非法点火报警"; break;
            case ALERT_INVALIDDOOR: desc += ",非法开门报警"; break;
        }
    }
    return desc;
}


// getOnLine 
// 1: 车辆列表中
// 2: 地图中
function getOnLine(vehicle) {
    var desc = "";
    var now = new Date();
    now = now.format("yyyy-MM-dd hh:mm:ss");
    rcv_time = NewDate(vehicle.active_gps_data.rcv_time);
    rcv_time = rcv_time.format("yyyy-MM-dd hh:mm:ss");
    var m = dateOnLine(now, rcv_time, "mm");
    if (m < 1440) {
        desc = true;
    } else {
        desc = false;
    }
    return desc;
}

function dateOnLine(sDate1, sDate2, mode) {     //sDate1和sDate2是2004-10-18格式
    var iDays
    var date1 = new Date(Date.parse(sDate1.replace(/-/g, "/"))); //转换成Data();  
    var date2 = new Date(Date.parse(sDate2.replace(/-/g, "/"))); //转换成Data();  
    if (mode == "dd") {
        iDays = parseInt(Math.abs(date1 - date2) / 1000 / 60 / 60 / 24);    //把相差的毫秒数转换为天数
    } else if (mode == "mm") {
        iDays = parseInt(Math.abs(date1 - date2) / 1000 / 60);    //把相差的毫秒数转换为分钟
    }
    return iDays;
}


function _getStatusDesc(vehicle, show_mode) {
    /*
    离线，1--显示SIM卡号, 2--离线1个小时内小时显示“离线 <1小时“，超过1个小时，显示离线“离线 xx个小时”
    在线，有效定位，速度超过10公里，显示：行驶，其他状态 xx公里/小时，速度低于等于10公里，显示：静止，其他状态
    在线，无效定位，如果信号小于指定值，速度超过10公里，显示：盲区，速度低于等于10公里，显示：静止
    */
    var desc = "";
    // 如果数据接收时间在10分钟以内，认为在线，否则为离线
    var now = new Date();
    rcv_time = NewDate(vehicle.rcv_time);
    //    if (dateDiff(now, rcv_time, "mm") < 1440) {
    if (vehicle.gps_flag % 2 == 0) {
        if (vehicle.speed > 10) {
            desc = "行驶";
            if (getUniStatusDesc(vehicle.uni_status) != ",省电状态")
                desc += getUniStatusDesc(vehicle.uni_status);
            desc += getUniAlertsDesc(vehicle.uni_alerts) + " " + parseInt(vehicle.speed) + "公里/小时";
        } else {
            desc = "静止";
            if (getUniStatusDesc(vehicle.uni_status) != ",省电状态")
                desc += getUniStatusDesc(vehicle.uni_status);
            desc += getUniAlertsDesc(vehicle.uni_alerts);
        }
        //        } else {
        //            if (vehicle.speed > 10) {
        //                desc = "行驶";
        //                if (getUniStatusDesc(vehicle.uni_status) != ",省电状态")
        //                    desc += getUniStatusDesc(vehicle.uni_status);
        //                desc += getUniAlertsDesc(vehicle.uni_alerts) + " " + parseInt(vehicle.speed) + "公里/小时";
        //            }
        //            else {
        //                desc = "静止";
        //                if (getUniStatusDesc(vehicle.uni_status) != ",省电状态")
        //                    desc += getUniStatusDesc(vehicle.uni_status);
        //                desc += getUniAlertsDesc(vehicle.uni_alerts);
        //            }
        //        }
    }
    //    else {
    //        if (show_mode == 1) {
    //            var now = new Date();
    //            rcv_time = NewDate(vehicle.rcv_time);
    //            var m = dateDiff(now, rcv_time, "mm");
    //            if (m < 1440) {
    //                desc = "离线 < 24小时";
    //            } else {
    //                desc = "离线 " + parseInt(m / 60 / 24) + " 天";
    //            }
    //        } else {
    //            desc = "";
    //        }
    //    }
    return desc;
}

function getUniAlertDesc(uni_alert) {
    var desc = "";
    switch (uni_alert) {
        case ALERT_SOS: desc += "紧急报警"; break;
        case ALERT_OVERSPEED: desc += "超速报警"; break;
        case ALERT_VIRBRATE: desc += "震动报警"; break;
        case ALERT_MOVE: desc += "位移报警"; break;
        case ALERT_ALARM: desc += "防盗器报警"; break;
        case ALERT_INVALIDRUN: desc += "非法行驶报警"; break;
        case ALERT_ENTERGEO: desc += "进围栏报警"; break;
        case ALERT_EXITGEO: desc += "出围栏报警"; break;
        case ALERT_CUTPOWER: desc += "断电报警"; break;
        case ALERT_LOWPOWER: desc += "低电压报警"; break;
        case ALERT_GPSCUT: desc += "GPS断线报警"; break;
        case ALERT_OVERDRIVE: desc += "疲劳驾驶报警"; break;
        case ALERT_INVALIDACC: desc += "非法点火报警"; break;
        case ALERT_INVALIDDOOR: desc += "非法开门报警"; break;
    }
    return desc;
}

function format_number(pnumber, decimals) {
    if (isNaN(pnumber)) { return 0 };
    if (pnumber == '') { return 0 };
    var result = parseFloat(pnumber).toFixed(decimals)
    var dot = result.indexOf('.');
    while (result.length <= dot + decimals) { result += '0'; }
    //        result = dec;
    //    var snum = new String(pnumber);
    //    var sec = snum.split('.');
    //    var whole = parseFloat(sec[0]);
    //    var result = '';

    //    if (sec.length > 1) {
    //        var dec = new String(sec[1]);
    //        dec = String(parseFloat(sec[1]) / Math.pow(10, (dec.length - decimals)));
    //        dec = String(whole + Math.round(parseFloat(dec)) / Math.pow(10, decimals));
    //        var dot = dec.indexOf('.');
    //        if (dot == -1) {
    //            dec += '.';
    //            dot = dec.indexOf('.');
    //        }
    //        while (dec.length <= dot + decimals) { dec += '0'; }
    //        result = dec;
    //    } else {
    //        var dot;
    //        var dec = new String(whole);
    //        dec += '.';
    //        dot = dec.indexOf('.');
    //        while (dec.length <= dot + decimals) { dec += '0'; }
    //        result = dec;
    //    }
    return result;
}
