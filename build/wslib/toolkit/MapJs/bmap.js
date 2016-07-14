var select_vehicle = null;
var toolType = TOOL_TYPE_DEFAULT;
var current_marker = null;
var current_infowin = null;
var current_retangle = null;
var baidumap;

//document.write('<script src="http://api.map.baidu.com/api?v=1.4" type="text/javascript"></script>');

var EARTH_RADIUS = 6378.137; //地球半径，单位为公里
function rad(d) {   //计算弧度
    return d * Math.PI / 180.0;
}

function calDistance(lat1, lng1, lat2, lng2) {     //计算两个经纬度坐标之间的距离，返回单位为公里的数值
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lng1) - rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
}

var refreshLabel = function (map, vehicles) {
    return function () {
        //alert("hello");
        var v = null;
        for (var i = 0; i < vehicles.length; i++) {
            v = vehicles[i];
            v.marker_.setLabel(new BMap.Label(vehicles[i].nick_name, { offset: new BMap.Size(15, -20) }));
        }
    }
}

function bmap(div_map, center_point, zoom) {
    this.map = new BMap.Map(div_map);
    baidumap = this.map;
    this.map.centerAndZoom(center_point, zoom);
    this.map.enableScrollWheelZoom();
    this.map.addControl(new BMap.NavigationControl());
    this.map.addControl(new BMap.ScaleControl());
    this.map.addControl(new BMap.OverviewMapControl());
    this.map.addControl(new BMap.MapTypeControl());
    this.geocoder = new BMap.Geocoder();
    this.vehicles = [];
    this.pois = [];
    this.geos = [];
    this.markers = [];
    this.poi_markers = [];
    this.markerClusterer = null;
    this.showLocation = null;
    this.mapClick = null;
    //    fn = refreshLabel(this.map, this.vehicles);
    //    this.map.addEventListener("dragend", fn);
}

bmap.prototype.setCenter = function (lon, lat) {
    point = new BMap.Point(lon, lat);
    this.map.setCenter(point);
}

// 设置地图缩放比例
bmap.prototype.setZoom = function (level) {
    this.map.setZoom(level);
}

// 获取地址后的函数处理
bmap.prototype.setShowLocation = function (fun) {
    this.showLocation = fun;
}

function vehicleMarker(vehicle, if_track, if_show_line) {
    this.device_id = vehicle.device_id;
    this.nick_name = vehicle.nick_name;
    this.lon = vehicle.active_gps_data.lon;
    this.lat = vehicle.active_gps_data.lat;
    this.speed = vehicle.active_gps_data.speed;
    this.direct = vehicle.active_gps_data.direct;
    this.if_track = if_track;
    this.if_show_line = if_show_line;
    this.track_line = null;
    this.track_lines = [];
    this.content = "";
    this.marker_ = null;
    this.label_ = null;
    this.infowin_ = null;
}

function poiMarker(poi) {
    this.poi_id = poi.poi_id;
    this.poi_name = poi.poi_name;
    this.poi_type = poi.poi_type;
    this.lon = poi.lon;
    this.lat = poi.lat;
    this.remark = poi.remark;
    this.marker_ = null;
}

bmap.prototype.addVehicles = function (vehicles) {
    var v = null;
    var latLng = null;
    var icon = "";
    var title = "";
    for (var i = 0; i < vehicles.length; i++) {
        if(vehicles[i].active_gps_data == undefined)continue;
        var v = this.vehicles[vehicles[i].device_id];
        // 判断车辆是否存在，存在则更新数据，不存在则添加
        if (v != null) {
            this.updateVehicle(vehicles[i], false, false, false, '#FF0000', 3, false);
        } else {
            latLng = new BMap.Point(vehicles[i].active_gps_data.lon, vehicles[i].active_gps_data.lat);
            v = new vehicleMarker(vehicles[i], false, false);
            icon = getIcon(vehicles[i], MAP_TYPE_BAIDU);
            title = vehicles[i].nick_name + "（" + getStatusDesc(vehicles[i], 2) + "）";
            v.marker_ = new BMap.Marker(latLng, { icon: icon });
            v.marker_.setLabel(new BMap.Label(vehicles[i].nick_name, { offset: new BMap.Size(15, -20) }));
            v.marker_.getLabel().setStyle({ border: "1px solid blue" });
            v.marker_.setTitle = title;
            content = getMapContent(vehicles[i]);
            //打开该车辆的信息窗体
            var infowin = new BMap.InfoWindow(content);
            v.infowin_ = infowin;

            //var fn = markerClickFunction(v);
            v.marker_.addEventListener("click", function () {
                this.openInfoWindow(v.infowin_);
            });

            this.vehicles[vehicles[i].device_id] = v;
            this.markers.push(v.marker_);
            this.map.addOverlay(v.marker_);
        }
    }

    //    if (this.markerClusterer == null) {
    //        this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers: this.markers });
    //    } else {
    //        this.markerClusterer.addMarkers(this.markers);
    //    }

}

//var markerClickFunction = function (v) {
//    return function (e) {
//        if (select_vehicle) {
//            select_vehicle.infowin_.close();
//        }
//        this.openInfoWindow(v.infowin_);
//        // 设置该车辆为选中车辆
//        select_vehicle = v;
//    };
//};

// 更新车辆显示
bmap.prototype.updateVehicle = function (vehicle, if_track, if_show_line, if_open_win, color, width, if_playback) {
    var v = this.vehicles[vehicle.device_id];
    var content = "";
    if (v != null && vehicle.active_gps_data != undefined) {
        var oldlatLng;
        oldlatLng = new BMap.Point(v.lon, v.lat);
        v.lon = vehicle.active_gps_data.lon;
        v.lat = vehicle.active_gps_data.lat;
        v.gps_time = vehicle.active_gps_data.gps_time;
        v.speed = vehicle.active_gps_data.speed;
        v.direct = vehicle.active_gps_data.direct;
        var icon = getIcon(vehicle, MAP_TYPE_BAIDU);
        var latLng;
        latLng = new BMap.Point(vehicle.active_gps_data.lon, vehicle.active_gps_data.lat);

        if (if_show_line) {
            distance = calDistance(oldlatLng.lat, oldlatLng.lng, latLng.lat, latLng.lng);
            if (distance < 10) {
                if (!v.track_line) {
                    var polyOptions = {
                        strokeColor: color,
                        strokeOpacity: 1.0,
                        strokeWeight: width
                    };
                    v.track_line = new BMap.Polyline([], polyOptions);
                    var path = v.track_line.getPath();
                    this.map.addOverlay(v.track_line);
                    path.push(oldlatLng);
                    v.track_lines.push(v.track_line);
                }
                var path = v.track_line.getPath();
                path.push(latLng);
                v.track_line.setPath(path);
            } else {
                v.track_line = null;
            }
        }

        v.marker_.getLabel().setContent(vehicle.nick_name);
        v.marker_.setPosition(latLng);
        v.marker_.setIcon(icon);

        content = getMapContent(vehicle, if_playback);
        v.infowin_.setContent(content);

        if (if_track) {
            // 加入视野判断，如果超过地图范围才进行置中操作
            var bounds = this.map.getBounds();
            if (v.lon < bounds.getSouthWest().lng || v.lon > bounds.getNorthEast().lng ||
                v.lat < bounds.getSouthWest().lat || v.lat > bounds.getNorthEast().lat) {
                this.map.setCenter(latLng);
            }
        }


        if (if_open_win) {
            this.map.openInfoWindow(v.infowin_, latLng);
        }
    }
}

bmap.prototype.findVehicle = function (device_id, if_track, if_open_win) {
    var v = this.vehicles[device_id];
    var content = "";
    if (v != null) {
        var latLng;
        latLng = new BMap.Point(v.lon, v.lat);

        if (if_track) {
            this.map.setZoom(15);
            this.map.setCenter(latLng);
        }
        if (if_open_win) {
            if (select_vehicle) {
                select_vehicle.marker_.closeInfoWindow();
            }
            v.marker_.openInfoWindow(v.infowin_);
            select_vehicle = v;
        }
        // 获取地址
//        this.geocoder.getLocation(latLng, function (rs) {
//            if (rs) {
//                var addComp = rs.addressComponents;
//                var addr = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
//                if (this.showLocation) {
//                    this.showLocation(addr);
//                }
//            }
        //        });
        this.geocoder.getLocation(latLng, function (rs) {
            var di = 2000;
            var shortpoint = -1;
            for (i = 0; i < rs.surroundingPois.length; i++) {
                var d = baidumap.getDistance(rs.surroundingPois[i].point, latLng);
                if (d < di) {
                    shortpoint = i;
                    di = d;
                }
            }

            if (shortpoint >= 0) {
                getAddAddress = rs.address + '，离' + rs.surroundingPois[shortpoint].title + di.toFixed(0) + '米';
            } else {
                getAddAddress = rs.address;
            }

            if (showLocation) {
                this.showLocation(getAddAddress);
            }
        }, { "poiRadius": "500", "numPois": "10" });
        return v;
    }

}

bmap.prototype.deleteVehicle = function (device_id) {
    var v = this.vehicles[device_id];
    if (v != null) {
        // 从数组中删除对象
        this.vehicles[device_id] = null;
        this.markers.pop(v.marker_);
        //this.markerClusterer.removeMarker(v.marker_);
        if (v.marker_) {
            this.map.removeOverlay(v.marker_);
        }
        if (v.track_lines) {
            for (var i = 0; i < v.track_lines.length; i++) {
                this.map.removeOverlay(v.track_lines[i]);
            }
        }
    }
}

bmap.prototype.clearVehicle = function () {
    for (var i = this.markers.length - 1; i >= 0 ; i--) {
        var m = this.markers[i];
        if (m) {
            this.map.removeOverlay(m);
        }
    }
    this.vehicles = [];
    this.markers = [];
};


bmap.prototype.addTrackLine = function (vehicle, gps_datas, color, width) {
    var v = this.vehicles[vehicle.device_id];
    var content = "";
    if (v == null) {
        v = new vehicleMarker(vehicle, false, false);
        this.vehicles[vehicle.device_id] = v;
    }
    var points = [];
    var latLng;
    for (var i = 0; i < gps_datas.length; i++) {
        latLng = new BMap.Point(gps_datas[i].lon, gps_datas[i].lat);
        points.push(latLng);
    }

    var polyOptions = {
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: width
    }
    if (v.track_line) {
        this.map.removeOverlay(v.track_line);
    };
    v.track_line = new BMap.Polyline(points, polyOptions);
    this.map.addOverlay(v.track_line);
}

bmap.prototype.removeTrackLine = function (vehicle) {
    var v = this.vehicles[vehicle.device_id];
    var content = "";
    if (v != null && v.track_line != null) {
        for (var i = 0; i < v.track_lines.length; i++) {
            this.map.removeOverlay(v.track_lines[i]);
        }
        v.track_line = null;
    }
}

bmap.prototype.moveTrackPoint = function (vehicle, gps_data, if_open_win) {
    var v = vehicle;
    v.active_gps_data.lon = gps_data.lon;
    v.active_gps_data.lat = gps_data.lat;
    v.active_gps_data.speed = gps_data.speed;
    v.active_gps_data.direct = gps_data.direct;
    v.active_gps_data.gps_time = gps_data.gps_time;
    v.active_gps_data.uni_status = gps_data.uni_status;
    v.active_gps_data.uni_alerts = gps_data.uni_alerts;
    this.updateVehicle(v, true, true, if_open_win, 'green', 3, true);
}

//function strPad(hex) {
//    var zero = '00000000';
//    var tmp = 8 - hex.length;
//    return zero.substr(0, tmp) + hex;
//}

//bmap.prototype.openAddGeoTool = function () {
//    google.maps.event.addListener(this.map, 'click', function (event) {
//        //alert(event.latLng);
//        var lon = parseInt(event.latLng.lat() * 600000);
//        var lat = parseInt(event.latLng.lng() * 600000);
//        lon = strPad(lon.toString(16).toUpperCase());
//        lat = strPad(lat.toString(16).toUpperCase());
//        alert(lat + "," + lon);
//    });
//}

//var onMapClick = function (map, title, div_content) {
//    return function (event) {
//        switch (toolType) {
//            case TOOL_TYPE_POI:
//                //alert("兴趣点：" + event.latLng);
//                if (current_infowin) {
//                    current_infowin.close();
//                }
//                current_infowin = new google.maps.InfoWindow({
//                    content: div_content,
//                    disableAutoPan: true
//                });
//                if (current_marker) {
//                    current_marker.setMap(null);
//                }
//                current_marker = new google.maps.Marker({
//                    position: event.latLng,
//                    map: map,
//                    title: title
//                });
//                current_infowin.open(map, current_marker);
//                break;
//            case TOOL_TYPE_GEO:
//                //alert("矩形围栏：" + event.latLng);
//                if (current_infowin) {
//                    current_infowin.close();
//                }
//                current_infowin = new google.maps.InfoWindow({
//                    content: div_content,
//                    disableAutoPan: true,
//                    position: event.latLng
//                });
//                if (current_retangle) {
//                    current_retangle.setMap(null);
//                }
//                current_retangle = new google.maps.Rectangle({
//                    strokeColor: "#FF0000",
//                    strokeOpacity: 0.8,
//                    strokeWeight: 2,
//                    fillColor: "#FF0000",
//                    fillOpacity: 0.35,
//                    map: map,
//                    bounds: getRectangle(event.latLng.lng(), event.latLng.lat(), 100)
//                });
//                current_infowin.open(map);
//                break;
//            case TOOL_TYPE_POLY:
//                alert("多边形围栏：" + event.latLng);
//                break;
//            case TOOL_TYPE_ROUTE:
//                alert("线路：" + event.latLng);
//                break;
//        }
//    }
//}

//bmap.prototype.setTool = function (tool_type, title, div_content, callback) {
//    toolType = tool_type;
//    switch (tool_type) {
//        case TOOL_TYPE_DEFAULT:
//            google.maps.event.removeListener(this.mapClick);
//            if (current_infowin) {
//                current_infowin.close();
//            }
//            if(current_marker) {
//                current_marker.setMap(null);
//            }
//            break;
//        case TOOL_TYPE_POI:
//        case TOOL_TYPE_GEO:
//        case TOOL_TYPE_POLY:
//        case TOOL_TYPE_ROUTE:
//            fn = onMapClick(this.map, title, div_content);
//            this.mapClick = google.maps.event.addListener(this.map, 'click', fn);
//            break;
//    }
//}

bmap.prototype.addPois = function (pois) {
    var p = null;
    var latLng = null;
    var icon = "";
    var title = "";
    for (var i = 0; i < pois.length; i++) {
        this.addPoi(pois[i]);
    }
}

bmap.prototype.addPoi = function (poi) {
    var p = null;
    var latLng = null;
    var icon = "";
    var title = "";
    var p = this.pois[poi.poi_id];
    // 判断兴趣点是否存在，存在则更新数据，不存在则添加
    if (p != null) {
        this.updatePoi(poi);
    } else {
        latLng = new BMap.Point(poi.lon, poi.lon);
        p = new poiMarker(poi);
        icon = getPoiIcon(poi, MAP_TYPE_BAIDU);
        title = poi.poi_name;
        p.marker_ = new BMap.Marker(latLng, { icon: icon });
        this.map.addOverlay(p.marker_);
        this.pois[poi.poi_id] = p;
        this.poi_markers.push(p.marker_);
    }

}

//bmap.prototype.findPoi = function (poi_id) {
//    var p = this.pois[poi_id];
//    var content = "";
//    if (p != null) {
//        var latLng;
//        if (this.map.getMapTypeId() == google.maps.MapTypeId.SATELLITE || this.map.getMapTypeId() == google.maps.MapTypeId.HYBRID) {
//            latLng = new google.maps.LatLng(p.lat, p.lon);
//        } else {
//            latLng = new google.maps.LatLng(p.rev_lat, p.rev_lon);
//        }
//        this.map.setZoom(10);
//        this.map.setCenter(latLng);
//        return p;
//    }

//}

//bmap.prototype.editPoi = function (div_content, poi_id, callback) {
//    //找到对应的poi
//    var p = this.pois[poi_id];
//    if (p) {
//        var latLng;
//        if (this.map.getMapTypeId() == google.maps.MapTypeId.SATELLITE || this.map.getMapTypeId() == google.maps.MapTypeId.HYBRID) {
//            latLng = new google.maps.LatLng(p.lat, p.lon);
//        } else {
//            latLng = new google.maps.LatLng(p.rev_lat, p.rev_lon);
//        }
//        this.map.setZoom(10);
//        this.map.setCenter(latLng);
//        current_infowin = new google.maps.InfoWindow({
//            content: div_content,
//            disableAutoPan: true
//        });
//        if (current_marker) {
//            current_marker.setMap(null);
//        }
//        current_marker = new google.maps.Marker({
//            position: p.marker_.position,
//            map: this.map,
//            title: p.poi_name
//        });
//        current_infowin.open(this.map, current_marker);
//        //current_marker = p.marker_;
//        this.setTool(TOOL_TYPE_POI, p.poi_name, div_content, callback);
//    }
//}

//bmap.prototype.updatePoi = function (poi) {
//    var p = this.pois[poi.poi_id];
//    var content = "";
//    if (p != null) {
//        if (this.map.getMapTypeId() == google.maps.MapTypeId.SATELLITE || this.map.getMapTypeId() == google.maps.MapTypeId.HYBRID) {
//            latLng = new google.maps.LatLng(poi.lat, poi.lon);
//        } else {
//            latLng = new google.maps.LatLng(poi.rev_lat, poi.rev_lon);
//        }
//        p.poi_name = poi.poi_name;
//        p.poi_type = poi.poi_type;
//        p.lon = poi.lon;
//        p.lat = poi.lat;
//        p.rev_lon = poi.rev_lon;
//        p.rev_lat = poi.rev_lat;
//        p.remark = poi.remark;
//        var icon = getPoiIcon(poi, MAP_TYPE_BAIDU);
//        p.marker_.setIcon(icon);
//        var latLng;
//        if (this.map.getMapTypeId() == google.maps.MapTypeId.SATELLITE || this.map.getMapTypeId() == google.maps.MapTypeId.HYBRID) {
//            latLng = new google.maps.LatLng(poi.lat, poi.lon);
//        } else {
//            latLng = new google.maps.LatLng(poi.rev_lat, poi.rev_lon);
//        }
//        p.marker_.setPosition(latLng);
//        p.marker_.label.marker_.labelContent = poi.poi_name;
//        p.marker_.label.setContent();
//        p.marker_.label.marker_.labelAnchor = new google.maps.Point(50, -10),
//        p.marker_.label.setAnchor();
//    }
//}

//bmap.prototype.deletePoi = function (poi_id) {
//    var p = this.pois[poi_id];
//    if (p != null) {
//        // 从数组中删除对象
//        this.pois[poi_id] = null;
//        if (p.marker_) {
//            p.marker_.setMap(null);
//        }
//    }
//}

bmap.prototype.clearPoi = function () {
    for (var i = 0; i < this.poi_markers.length; i++) {
        var m = this.poi_markers[i];
        if (m) {
            this.map.removeOverlay(m);
        }
    }
    this.poi_markers = [];
    this.pois = [];
}

////lon,lat: 中心点经纬度
////meter: 半径，单位(米)
//var getRectangle = function(lon, lat, meter){
//    var pi = 3.1415926535897932;
//    var ranx,rany;
//    var x,y;
//    y = lat;
//    x = 90- y;
//    x = Math.sin(x * pi / 180);
//    x = 40075.38 * x;
//    x = x / 360;
//    x = x * 1000;
//    ranx = meter / x;
//    rany = meter / 110940; 
//    return new google.maps.LatLngBounds(
//        new google.maps.LatLng(lat - rany, lon - ranx),
//        new google.maps.LatLng(lat + rany, lon + ranx)
//        );
//}

//bmap.prototype.showGeo = function (poi) {
//    var latLng;
//    if (this.map.getMapTypeId() == google.maps.MapTypeId.SATELLITE || this.map.getMapTypeId() == google.maps.MapTypeId.HYBRID) {
//        latLng = new google.maps.LatLng(poi.lat, poi.lon);
//    } else {
//        latLng = new google.maps.LatLng(poi.rev_lat, poi.rev_lon);
//    }
//    this.map.setZoom(15);
//    this.map.setCenter(latLng);
//    if (current_retangle) {
//        current_retangle.setMap(null);
//    }
//    current_retangle = new google.maps.Rectangle({
//        strokeColor: "#FF0000",
//        strokeOpacity: 0.8,
//        strokeWeight: 2,
//        fillColor: "#FF0000",
//        fillOpacity: 0.35,
//        map: this.map,
//        bounds: getRectangle(latLng.lng(), latLng.lat(), poi.width)
//    });
//}

//bmap.prototype.deleteGeo = function () {
//    if (current_retangle) {
//        current_retangle.setMap(null);
//    }
//}

////更改电子围栏宽度
//bmap.prototype.changeGeoWidth = function (width) {
//    if (current_retangle) {
//        var bounds = getRectangle(current_retangle.getBounds().getCenter().lng(), current_retangle.getBounds().getCenter().lat(), width);
//        current_retangle.setBounds(bounds);
//    }
//}

//bmap.prototype.editGeo = function (div_content, poi, callback) {
//    //找到对应的poi
//    var p = poi;
//    if (poi) {
//        var latLng;
//        if (this.map.getMapTypeId() == google.maps.MapTypeId.SATELLITE || this.map.getMapTypeId() == google.maps.MapTypeId.HYBRID) {
//            latLng = new google.maps.LatLng(p.lat, p.lon);
//        } else {
//            latLng = new google.maps.LatLng(p.rev_lat, p.rev_lon);
//        }
//        this.map.setZoom(15);
//        this.map.setCenter(latLng);
//        current_infowin = new google.maps.InfoWindow({
//            content: div_content,
//            disableAutoPan: true,
//            position: latLng
//        });
//        if (current_retangle) {
//            current_retangle.setMap(null);
//        }
//        current_retangle = new google.maps.Rectangle({
//            strokeColor: "#FF0000",
//            strokeOpacity: 0.8,
//            strokeWeight: 2,
//            fillColor: "#FF0000",
//            fillOpacity: 0.35,
//            map: this.map,
//            bounds: getRectangle(latLng.lng(), latLng.lat(), p.width)
//        });
//        current_infowin.open(this.map);

//        this.setTool(TOOL_TYPE_GEO, p.poi_name, div_content, callback);
//    }
//}
