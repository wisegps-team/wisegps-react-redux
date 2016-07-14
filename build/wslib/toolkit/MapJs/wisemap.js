var baidumap = new BMap.Map("container");

function wiseMap(map_type, div_map, center_point, zoom) {
    var map = null;
    switch (map_type) {
        case MAP_TYPE_GOOGLE:
            var latLng = new google.maps.LatLng(center_point.lat, center_point.lon);
            map = new gmap(div_map, latLng, zoom);
            break;
        case MAP_TYPE_BAIDU:
            var latLng = new BMap.Point(center_point.lon, center_point.lat);
            map = new bmap(div_map, latLng, zoom);
            break;
    }
    return map;
}


function setLocation(idx, rev_lon, rev_lat, obj, showLocation) {
    var pt = new BMap.Point(rev_lon, rev_lat);
    var gc = new BMap.Geocoder();
    gc.getLocation(pt, function (rs) {
        var di = 2000;
        var shortpoint = -1;
        for (i = 0; i < rs.surroundingPois.length; i++) {
            var d = baidumap.getDistance(rs.surroundingPois[i].point, pt);
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
            showLocation(obj, getAddAddress);
        }
    }, { "poiRadius": "500", "numPois": "10" });
}