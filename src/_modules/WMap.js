/**
 * 百度地图封装类
 * 需要监听到window的W.mapready事件之后才能使用
 * 目的是封装百度地图，简化使用，目前非常不完善，只有几个基本方法
 */
W.include("http://api.map.baidu.com/api?v=2.0&ak=647127add68dd0a3ed1051fd68e78900&callback=__WMap_mapInit");

//类构造
function WMap(id,lat,lon,zoom){
	lat=lat||116.417854;
	lon=lon||39.921988;
	zoom=zoom||15;
	var map = new BMap.Map(id);//地图实例化
	map.centerAndZoom(new BMap.Point(lat,lon),zoom);
    //控件
    var zoomControl = new BMap.NavigationControl({type:BMAP_NAVIGATION_CONTROL_ZOOM,anchor:BMAP_ANCHOR_BOTTOM_RIGHT,offset: new BMap.Size(5, 20)});
    map.addControl(zoomControl);//添加缩放控件
    // map.addEventListener("tilesloaded", function(){W(".anchorBL").style.display="none";});//隐藏地图底部文字
    Object.assign(map,WMap.prototype);
    return map
}

//移动地图到中心点lon,lat
WMap.prototype.moveTo=function(lon,lat){
	this.panTo(new BMap.Point(lon,lat));
}

//添加一个标点,传递标点的构造信息，目前只需要lat,lon,img,desc
WMap.prototype.addMarker=function(data){
    if(!data){return;}
	var marker;
    if(data.img){
    	var icon = new BMap.Icon(data.img, new BMap.Size(data.w,data.h));
    	marker = new BMap.Marker(new BMap.Point(data.lon,data.lat),{icon:icon});
    }else
    	marker = new BMap.Marker(new BMap.Point(data.lon,data.lat));
	this.addOverlay(marker);
	if(data.desc){
		var label = new BMap.Label(data.desc,{offset:new BMap.Size(20,-10)});
		marker.setLabel(label);
	}
    return marker;
}

//添加一个矩形，需要传入矩形中心经纬度lon,lat,半径r,描述desc
WMap.prototype.addPolygon=function(data){
	if(!data){return;}
	var point = new BMap.Point(data.lon,data.lat);
	var rect = getRectangle(data.lon,data.lat, data.r);
	var polygon = new BMap.Polygon([
                    new BMap.Point(rect.x1, rect.y1),
                    new BMap.Point(rect.x2, rect.y1),
                    new BMap.Point(rect.x2, rect.y2),
                    new BMap.Point(rect.x1, rect.y2)
                ], {strokeColor: "#0000FF", strokeWeight: 2, strokeOpacity: 0.8});

	var opts = {
	  position : point,    // 指定文本标注所在的地理位置
	}
	var label = new BMap.Label(data.desc, opts);
	label.setStyle({border:'solid 1px #0000FF'});
	this.addOverlay(label); 
	this.addOverlay(polygon);
	
	return {
		polygon,
		label,
		show(){
			polygon.show();
			label.show();
		},
		hide(){
			polygon.hide();
			label.hide();
		}
	};
}

////lon,lat: 中心点经纬度
////meter: 半径，单位(米)
var getRectangle = function (lon, lat, meter) {
    var pi = 3.1415926535897932;
    var ranx, rany;
    var x, y;
    y = lat;
    x = 90 - y;
    x = Math.sin(x * pi / 180);
    x = 40075.38 * x;
    x = x / 360;
    x = x * 1000;
    ranx = meter / x;
    rany = meter / 110940;
    return {
        x1: lon - ranx,
        y1: lat - rany,
        x2: lon + ranx,
        y2: lat + rany
    };
}

//异步加载百度地图需要一个全局方法，以供类似jsonp方式的使用
window.__WMap_mapInit=function(){
	var evt = document.createEvent("HTMLEvents");
	evt.initEvent("W.mapready", false, false);
	window.dispatchEvent(evt);
	Object.assign(WMap,BMap);
	WMap.ready=200;
}


export default WMap;