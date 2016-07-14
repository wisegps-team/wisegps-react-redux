"use strict";
import React, {Component} from 'react';

import {getStatusDesc} from '../_modules/car_state';

import MapManager from './map_manager';

var map_ready=false;
var wmap,infoWindow; 


W.include(WiStorm.root+'/wslib/toolkit/WMap.js',function (e) {
    if(typeof e==='boolean'&&e){//已经包含
        if(WMap&&WMap.status==200){//百度地图js也已经加载完了
            map_ready=true;
        }else{
            window.addEventListener('W.mapready',function() {
                map_ready=true;
            });
        }
    }
});


const styles={
    manager:{
        position: 'absolute',
        zIndex: 1,
        width: '300px',
        right: 0,
        top:'50px',
        maxHeight: '100%'
    }
}


class Map extends Component {
    constructor(props){
        super(props);
        this.mapinit = this.mapinit.bind(this);
    }

    componentDidMount() {
        if(map_ready){
            this.mapinit();
        }else{
            window.addEventListener('W.mapready',this.mapinit());
        }
    }

    componentWillReceiveProps(nextProps) {//收到新props
        if(nextProps.cars.length!=this.props.cars.length){
            let view=nextProps.cars.map(function (ele) {
                return new BMap.Point(ele.active_gps_data.b_lon, ele.active_gps_data.b_lat);
            });
            wmap.setViewport(view);//设置合适的层级大小
        }
    }
    mapinit(){
        wmap=new WMap(this.props.id);
        wmap.enableScrollWheelZoom();//启用滚轮放大缩小
        wmap.addControl(new WMap.NavigationControl());
        infoWindow=new WMap.InfoWindow('',{
            width : 350,     // 信息窗口宽度
            height: 200     // 信息窗口高度
        });
        let div=document.createElement('div');
        infoWindow.setContent(div);
        infoWindow._div=div;
        infoWindow._close=function(){};
        infoWindow.addEventListener('close',function(){
            if(this._close)
                this._close();
        })
        this.forceUpdate();
    }

    render() {
        let children;
        if(wmap){
            let windowOpen=false;
            children=this.props.cars.length?this.props.cars.map(function (ele) {
                windowOpen=(this.props.active==ele.obj_id)
                return <Car data={ele} key={ele.obj_id} carClick={this.props.carClick} open={windowOpen}/>;
            },this):[];
            children.push(<MapManager style={styles.manager} key='MapManager' />);
        }
        return React.createElement('div',this.props,children);
    }
}

class Car extends Component{
    constructor(props){
        super(props);
        this.openWindow = this.openWindow.bind(this);
        this.state={
            tracking:false
        }
    }
    componentDidMount(){
        this.marker=wmap.addMarker({
            img:'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',
            w:28,
            h:28,
            lon:this.props.data.active_gps_data.b_lon,
            lat:this.props.data.active_gps_data.b_lat
        });
        this.marker.addEventListener("click",this.openWindow);
        this.setMarker();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.open){
            let win=this.getWindow();
            if(!this.props.open)
                this.marker.openInfoWindow(win);
        }
        if(this.props.data.active_gps_data.b_lon!=nextProps.data.active_gps_data.b_lon||this.props.data.active_gps_data.b_lat!=nextProps.data.active_gps_data.b_lat){
            let pos=new BMap.Point(nextProps.data.active_gps_data.b_lon,nextProps.data.active_gps_data.b_lat);
            this.marker.setPosition(pos);
            if(this.state.tracking){
                //跟踪当中
                let tracking_line=this.state.tracking_line.concat(pos);
                this.setState(Object.assign({},this.state,{tracking_line}));
            }
        }
        this.setMarker();
    }
    componentWillUpdate(nextProps, nextState){
        if(nextState.tracking){//跟踪状态
            if(!this.state.tracking||nextState.tracking_line.length!=this.state.tracking_line.length){//开始跟踪
                let polyline = new WMap.Polyline(
                    nextState.tracking_line,
                    {
                        strokeColor:"blue", 
                        strokeWeight:5, 
                        strokeOpacity:0.5
                    }
                );
                if(this.polyline)wmap.removeOverlay(this.polyline);
                wmap.addOverlay(polyline); 
                this.polyline=polyline;
            }
        }else if(this.polyline){
            wmap.removeOverlay(this.polyline); 
            this.polyline=undefined;
        }
    }
    componentDidUpdate(){
        console.log('已经更新');
    }
    componentWillUnmount() {//移除
        wmap.removeOverlay(this.marker);
        delete this.marker;
    }

    openWindow(){
        this.props.carClick(this.props.data.obj_id);
    }
    getWindow(){
        var div=infoWindow._div;
        let new_div=info(this.props.data,this);
        if(div._content)
            div.replaceChild(new_div,div._content);
        else
            div.appendChild(new_div);
        div._content=new_div;
        infoWindow._close=null;
        setTimeout(()=>infoWindow._close=()=>this.props.carClick(0),500);//避免从一个车点到另一个车会触发这个方法

        return infoWindow;
    }
    setMarker(){
        let imgs=[
            'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',//停止
            'http://web.wisegps.cn/stylesheets/objects/normal_run_0.gif',//行驶
            'http://web.wisegps.cn/stylesheets/objects/normal_offline_0.gif'//离线
        ];
        let state=getStatusDesc(this.props.data,2);
        let icon=this.marker.getIcon();
        icon.setImageUrl(imgs[state.state]);
        this.marker.setIcon(icon);
        if(this.props.data.active_gps_data.direct)
            this.marker.setRotation(this.props.data.active_gps_data.direct);
    }
    track(start){//开始跟踪或者取消
        if(start){
            let pos=new BMap.Point(this.props.data.active_gps_data.b_lon,this.props.data.active_gps_data.b_lat);
            this.setState({
                tracking:true,
                tracking_line:[pos]
            });
        }else if(this.state.tracking){           
            this.setState({
                tracking:false,
                tracking_line:[]
            });
        }
    }
    render(){
        return null;
    }
}

function info(data,thisCar) {
    let f=parseInt(data.active_gps_data.signal/5);
    f=(f>4)?4:f;
    f=(f<1)?1:f;
    let ft='差差弱良强';
    let uni_status=(data.active_gps_data.uni_status.indexOf(8196)!=-1)?'启动':'熄火';
    let g,gt;
    if(data.active_gps_data.gps_flag==2){
        g='_g',gt='定位';
    }else{
        g='',gt='无定位';
    }
    let model=(data.call_phones.length&&data.call_phones[0].obj_model)?'('+data.call_phones[0].obj_model+')':'';
    let gps_time=W.dateToString(W.date(data.active_gps_data.gps_time));
    let desc=getStatusDesc(data,2).desc;
    let div=document.createElement('div');
    div.style.fontSize='14px';
    div.innerHTML='<p><span><font style="font-size: 15px; font-weight:bold; font-family:微软雅黑;">'+data.obj_name+model+'</font></span><img src="http://web.wisegps.cn/images/wifi'+f+'.png" title="信号'+ft[f]+'"/><img src="http://web.wisegps.cn/images/gps'+g+'.png" title="'+gt+'"/></p><table style="width: 100%;"><tbody><tr><td><font color="#244FAF">车辆状态：</font>'+desc+'</td><td><font color="#244FAF">启动状态：</font>'+uni_status+'</td></tr><tr><td colspan="2"><font color="#244FAF">定位时间：'+gps_time+'</font></td></tr><tr><td colspan="2"><font color="#244FAF">位置描述：</font><span class="location">获取地址中……</span></td></tr><tr><td width="50%"><font color="#244FAF">管理人员：</font>'+data.call_phones[0].manager+'</td><td><font color="#244FAF">联系电话：</font>'+data.call_phones[0].phone1+'</td></tr><tr><td width="50%"><font color="#244FAF">司机姓名：</font>'+data.call_phones[0].driver+'</td><td><font color="#244FAF">联系电话：</font>'+data.call_phones[0].phone+'</td></tr></tbody></table>';
    let geo=new WMap.Geocoder();
    geo.getLocation(new WMap.Point(data.active_gps_data.b_lon,data.active_gps_data.b_lat),function(res){
        if(res)
            div.querySelector('.location').innerText=res.address;
    });
    let b=document.createElement('button');
    b.innerText=thisCar.state.tracking?'取消跟踪':'跟踪';
    b.addEventListener('click',function(){
        thisCar.track(!thisCar.state.tracking);
        this.innerText=thisCar.state.tracking?'取消跟踪':'跟踪';
    });
    div.appendChild(b);
    return div;
}




















export default Map;