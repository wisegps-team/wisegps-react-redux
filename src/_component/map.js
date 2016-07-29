"use strict";
import React, {Component} from 'react';

import WMap from '../_modules/WMap';
import {getStatusDesc,getAllState} from '../_modules/car_state';

const cust_id=237
class Map extends Component {
    constructor(props){
        super(props);
        this.mapinit = this.mapinit.bind(this);
        this.state={
            hobby_views:[],
            selected_hobby:{},
            fence_views:[],
            selected_fence:{}
        }
    }

    componentDidMount() {
        if(WMap.ready){//已经加载好
            this.mapinit();
        }else{
            window.addEventListener('W.mapready',this.mapinit());
        }
    }

    componentWillReceiveProps(nextProps) {//收到新props
        //---------判断是否车辆数据的改变-------------
        if(nextProps.cars.length!=this.props.cars.length){
            let view=nextProps.cars.map(function (ele) {
                return new WMap.Point(ele.active_gps_data.b_lon, ele.active_gps_data.b_lat);
            });
            this.map.setViewport(view);//设置合适的层级大小
        }

        //-------以下是判断是否有兴趣点数据改变-----------

        //正在添加兴趣点
        if(nextProps.is_adding_hobby&&!this.props.is_adding_hobby){
            alert("请在地图上选择兴趣点的位置！");
            let _this=this;
            this.map.addEventListener('click',addHobby);
            
            function addHobby(e){
                let info_window=getHobbyWindow(0,{},_this.props.hobbyAct,funClose,e.point.lng,e.point.lat);
                var infoWindow = new WMap.InfoWindow(info_window);  // 创建信息窗口对象
                _this.map.openInfoWindow(infoWindow,e.point);
                
                infoWindow.addEventListener('close',function(){
                    _this.map.removeEventListener('click',addHobby);
                    _this.props.hobbyAct({},'add_cancel');
                });

                function funClose(){
                    _this.map.closeInfoWindow();
                }
            }
        }

        //兴趣点已增加或已删除
        if(this.props.hobbies.length!=nextProps.hobbies.length){
            if(this.props.hobbies.length!=0)this.state.hobby_views.map(ele=>{ele.view.hide();});
            let hobby_views=nextProps.hobbies.map(item=>{
                let obj={};
                obj.id=item._id;
                obj.view=this.addPoint(item.rev_lon,item.rev_lat,item.poi_name);
                item.visible?obj.view.show():obj.view.hide();
                return obj;
            });
            this.setState({
                hobby_views:hobby_views,
                selected_hobby:Object.assign({}, nextProps.selected_hobby)
            });
        }
        
        let old_hobby=this.state.selected_hobby;
        let new_hobby=Object.assign({}, nextProps.selected_hobby);
        let str_old_hobby=JSON.stringify(old_hobby);
        let str_new_hobby=JSON.stringify(new_hobby);

        //兴趣点已修改更新，名称备注的更新不需要在此处操作，此处操作显示和弹出框
        if(str_new_hobby!=str_old_hobby){
            let hobby_view=this.state.hobby_views.filter(ele=>ele.id==new_hobby._id)[0].view;//hobby_view是该兴趣点对应的state中的view
            if(new_hobby.visible){//兴趣点显示
                this.map.moveTo(new_hobby.rev_lon,new_hobby.rev_lat);
                hobby_view.show();
            }else if(!new_hobby.visible){
                hobby_view.hide();
            }
        
            if(new_hobby.show_info_window){//是否弹出编辑框,正在添加或修改兴趣点的时候弹出
                let div_hobby_window=getHobbyWindow(0,new_hobby,this.props.hobbyAct,funClose,new_hobby.lon,new_hobby.lat);
                let hobby_window=new WMap.InfoWindow(div_hobby_window);
                let hobby_window_point=new WMap.Point(new_hobby.rev_lon,new_hobby.rev_lat);

                hobby_view.openInfoWindow(hobby_window,hobby_window_point);

                let _this=this;
                hobby_window.addEventListener('close',(e)=>{
                    new_hobby.show_info_window=false;
                    this.props.hobbyAct(new_hobby,'update');
                });
                function funClose(){
                    _this.map.closeInfoWindow();
                }
            }else if(!new_hobby.show_info_window){
                this.map.closeInfoWindow();
            }

            this.setState({selected_hobby:Object.assign({}, new_hobby)});
        }

        //------以下是围栏数据是否改变------

        //正在添加围栏
        if(nextProps.is_adding_fence&&!this.props.is_adding_fence){
            alert("请在地图上选择围栏的位置！");
            let _this=this;
            this.map.addEventListener('click',addfence);
            
            function addfence(e){
                let info_window=getHobbyWindow(1,{},_this.props.fenceAct,funClose,e.point.lng,e.point.lat);
                var infoWindow = new WMap.InfoWindow(info_window);  // 创建信息窗口对象
                _this.map.openInfoWindow(infoWindow,e.point);
                
                infoWindow.addEventListener('close',function(){
                    _this.map.removeEventListener('click',addfence);
                    _this.props.fenceAct({},'add_cancel');
                });

                function funClose(){
                    _this.map.closeInfoWindow();
                }
            }
        }

        //围栏已添加或已删除
        if(this.props.fences.length!=nextProps.fences.length){
            if(this.props.hobbies.length!=0)this.state.fence_views.map(ele=>{ele.view.hide();});
            let fence_views=nextProps.fences.map(item=>{
                let obj={};
                obj.id=item._id;
                obj.view=this.addFencePolygon(item.rev_lon,item.rev_lat,item.width,item.poi_name);
                item.visible?obj.view.show():obj.view.hide();
                return obj;
            });
            this.setState({
                fence_views:fence_views,
                selected_fence:Object.assign({},nextProps.selected_fence)
            });
        }
        
        let old_fence=this.state.selected_fence;
        let new_fence=Object.assign({}, nextProps.selected_fence);
        let str_old_fence=JSON.stringify(old_fence);
        let str_new_fence=JSON.stringify(new_fence);

        //围栏已修改
        if(str_new_fence!=str_old_fence){
            let fence_view=this.state.fence_views.filter(ele=>ele.id==new_fence._id)[0].view;

            if(new_fence.visible){
                this.map.centerAndZoom(new WMap.Point( new_fence.rev_lon,new_fence.rev_lat),getZoom(new_fence.width));
                fence_view.show();
            }else if(!new_fence.visible){
                fence_view.hide();
            }
                if(new_fence.show_info_window){
                    let div_fence_window=getHobbyWindow(1,new_fence,this.props.fenceAct,funClose,new_fence.lon,new_fence.lat);
                    let fence_window=new WMap.InfoWindow(div_fence_window);
                    let fence_window_point=new WMap.Point(new_fence.rev_lon,new_fence.rev_lat);

                    this.map.openInfoWindow(fence_window,fence_window_point);

                    fence_window.addEventListener('close',funClose);
                    let _this=this;
                    function funClose(){
                        new_fence.show_info_window=false;
                        _this.props.fenceAct(new_fence,'update');
                    }
                }else if(!new_fence.show_info_window){
                    this.map.closeInfoWindow();
                }
            this.setState({selected_fence:Object.assign({}, new_fence)});
        }

    }
    mapinit(){
        this.map=new WMap(this.props.id);
        this.map.enableScrollWheelZoom();//启用滚轮放大缩小
        this.map.addControl(new WMap.NavigationControl());
        this.map.infoWindow=new WMap.InfoWindow('',{
            width : 350,     // 信息窗口宽度
            height: 200     // 信息窗口高度
        });
        let div=document.createElement('div');
        this.map.infoWindow.setContent(div);
        this.map.infoWindow._div=div;
        this.map.infoWindow._close=function(){};
        this.map.infoWindow.addEventListener('close',function(){
            if(this._close)
                this._close();
        })
        this.forceUpdate();
    }
    addPoint(lon,lat,str){
         let marker=this.map.addMarker({
            lon:lon,
            lat:lat,
            desc:str
        });
        return marker;
    }
    addFencePolygon(lon,lat,r,str){
        let poligon=this.map.addPolygon({
            lon:lon,
            lat:lat,
            r:r,
            desc:str
        });
        return poligon;
    }

    render() {
        let children;
        if(this.map){
            let windowOpen=false;
            children=this.props.cars.length?this.props.cars.map(function (ele) {
                windowOpen=(this.props.active==ele.obj_id)
                return (<Car 
                    key={ele.obj_id}
                    map={this.map}
                    data={ele} 
                    carClick={this.props.carClick} 
                    open={windowOpen}
                />);
            },this):[];
        }
        return (<div {...this.props}>
            {children}
            {this.props.children}
        </div>);
    }
}

class Car extends Component{
    constructor(props){
        super(props);
        this.openWindow = this.openWindow.bind(this);
        this.state={
            tracking:false
        };
    }
    componentDidMount(){
        this.marker=this.props.map.addMarker({
            img:'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',
            w:28,
            h:28,
            lon:this.props.data.active_gps_data.b_lon,
            lat:this.props.data.active_gps_data.b_lat
        });
        this.marker.addEventListener("click",this.openWindow);
        
        if(this.props.open){//打开infowindow
            this.marker.openInfoWindow(this.getWindow());
        }
        this.setMarker();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.open){
            let win=this.getWindow();
            if(!this.props.open)
                this.marker.openInfoWindow(win);
        }
        if(this.props.data.active_gps_data.b_lon!=nextProps.data.active_gps_data.b_lon||this.props.data.active_gps_data.b_lat!=nextProps.data.active_gps_data.b_lat){
            let pos=new WMap.Point(nextProps.data.active_gps_data.b_lon,nextProps.data.active_gps_data.b_lat);
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
                if(this.polyline)this.props.map.removeOverlay(this.polyline);
                this.props.map.addOverlay(polyline); 
                this.polyline=polyline;
            }
        }else if(this.polyline){
            this.props.map.removeOverlay(this.polyline); 
            this.polyline=undefined;
        }
    }
    componentDidUpdate(){
        console.log('已经更新');
    }
    componentWillUnmount() {//移除
        if(this.props.open){
            this.props.map.infoWindow._close=null;
        }
        this.props.map.removeOverlay(this.marker);
        this.marker=undefined;
        if(this.polyline){
            this.props.map.removeOverlay(this.polyline);
            this.polyline=undefined;
        }
    }

    openWindow(){
        this.props.carClick(this.props.data.obj_id);
    }
    getWindow(){
        var div=this.props.map.infoWindow._div;
        let new_div=info(this.props.data,this);
        if(div._content)
            div.replaceChild(new_div,div._content);
        else
            div.appendChild(new_div);
        div._content=new_div;
        this.props.map.infoWindow._close=null;
        setTimeout(()=>this.props.map.infoWindow._close=()=>this.props.carClick(0),500);//避免从一个车点到另一个车会触发这个方法

        return this.props.map.infoWindow;
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
            let pos=new WMap.Point(this.props.data.active_gps_data.b_lon,this.props.data.active_gps_data.b_lat);
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
    let g,gt;
    if(data.active_gps_data.gps_flag==2){
        g='_g',gt=___.gps_location;
    }else{
        g='',gt=___.no_gps_location;
    }
    let model=(data.call_phones.length&&data.call_phones[0].obj_model)?'('+data.call_phones[0].obj_model+')':'';
    let desc=getAllState(data);

    let div=document.createElement('div');
    div.style.fontSize='14px';
    div.innerHTML=W.replace('<p><span><font style="font-size: 15px; font-weight:bold; font-family:微软雅黑;">'+data.obj_name+model+'</font></span><img src="http://web.wisegps.cn/images/wifi'+desc.signal_l+'.png" title="___.signal'+desc.singal_desc+'"/><img src="http://web.wisegps.cn/images/gps'+g+'.png" title="'+gt+'"/></p><table style="width: 100%;"><tbody><tr><td><font color="#244FAF">___.car_state：</font>'+desc.desc+'</td><td><font color="#244FAF">___.state：</font>'+desc.status_desc+'</td></tr><tr><td colspan="2"><font color="#244FAF">___.gps_time：'+desc.gps_time+'</font></td></tr><tr><td colspan="2"><font color="#244FAF">___.position_description：</font><span class="location">___.getting_position</span></td></tr><tr><td width="50%"><font color="#244FAF">___.management：</font>'+data.call_phones[0].manager+'</td><td><font color="#244FAF">___.cellphone：</font>'+data.call_phones[0].phone1+'</td></tr><tr><td width="50%"><font color="#244FAF">___.driver：</font>'+data.call_phones[0].driver+'</td><td><font color="#244FAF">___.cellphone：</font>'+data.call_phones[0].phone+'</td></tr></tbody></table>');
    
    let b=document.createElement('button');
    b.innerText=thisCar.state.tracking?___.untrack:___.track;
    b.addEventListener('click',function(){
        thisCar.track(!thisCar.state.tracking);
        this.innerText=thisCar.state.tracking?___.untrack:___.track;
    });
    div.appendChild(b);

    let geo=new WMap.Geocoder();
    geo.getLocation(new WMap.Point(data.active_gps_data.b_lon,data.active_gps_data.b_lat),function(res){
        if(res)
            div.querySelector('.location').innerText=res.address;
    });
    return div;
}

function getHobbyWindow(is_geo,hobby,funSubmit,funClose,lon,lat){
    let div=document.createElement('div');
    div.style='font-size:14px; width: auto; height: auto;';
    //div.innerHTML='<div style="height:150px;overflow:hidden;"><div><div>编辑兴趣点</div><table cellpadding="0" cellspacing="0" border="0"><tbody><tr><td style="height:35px;" align="right">名称: </td><td align="left"><input style="width:140px;" id="poi_name" type="text" value="'+ hobby.poi_name+'"/></td></tr><tr><td style="height:35px;" align="right">备注: </td><td align="left"><input style="width:140px;" id="remark" type="text" value="'+ hobby.remark +'"/></td></tr></tbody></table></div><div style="text-align: center"><button>保存</button><button>取消</button></div></div>';

    let title=document.createElement('div');
    if(hobby._id){
        title.innerHTML=is_geo?"编辑围栏":"编辑兴趣点";
    }else{
        title.innerHTML=is_geo?"添加围栏":"添加兴趣点";
    }

    let str_name=document.createElement('span');
    str_name.innerHTML="名称：";
    
    let input_name=document.createElement('input');
    input_name.style='width:140px';
    input_name.value=hobby.poi_name||"";

    let name_box=document.createElement('div');
    name_box.style='margin-top:10px';
    name_box.appendChild(str_name);
    name_box.appendChild(input_name);

    let str_type=document.createElement('span');
    str_type.innerHTML="类别：";

    let input_type=document.createElement('select');
    input_type.style='width:144px';
    input_type.innerHTML='<option value="1">一般建筑</option><option value="2">金融机构</option><option value="3">休闲娱乐</option><option value="4">加油站</option><option value="5">医疗机构</option><option value="6">科研教育</option><option value="7">企事业单位</option><option value="8">收费站</option>';

    let type_box=document.createElement('div');
    type_box.style='margin-top:10px';
    type_box.appendChild(str_type);
    type_box.appendChild(input_type);

    let str_remark=document.createElement('span');
    str_remark.innerHTML="备注：";

    let input_remark=document.createElement('input');
    input_remark.style='width:140px';
    input_remark.value=hobby.remark||"";

    let remark_box=document.createElement('div');
    remark_box.style='margin-top:10px';
    remark_box.appendChild(str_remark);
    remark_box.appendChild(input_remark);

    let str_width=document.createElement('span');
    str_width.innerHTML="宽度：";

    let input_width=document.createElement('input');
    input_width.style='width:140px';
    input_width.value=hobby.width||0;

    let width_box=document.createElement('div');
    width_box.style='margin-top:10px';
    width_box.appendChild(str_width);
    width_box.appendChild(input_width);

    let submit_btn=document.createElement('button');
    submit_btn.innerHTML="保存";
    submit_btn.onclick=function(){
        hobby.poi_name=input_name.value;
        hobby.remark=input_remark.value;
        hobby.poi_type=Number(input_type.value);
        hobby.width=Number(input_width.value);

        if(hobby._id){//_id 存在，说明是对已存在的hobby进行修改
            funSubmit(hobby,'update_submit');
            funClose();
        }else{//_id 不存在，说明是新增一个hobby
            hobby.cust_id=cust_id;
            hobby.lon=lon;
            hobby.lat=lat;
            hobby.is_geo=is_geo;

            funSubmit(hobby,'add_submit');
            funClose();
        }
    }

    let cancel_btn=document.createElement('button');
    cancel_btn.innerHTML="取消";
    cancel_btn.style='margin-left:10px';
    cancel_btn.onclick=function(){
        hobby.show_info_window=false;
        if(hobby._id){//_id存在的时候取消，取消对hobby的修改
            funSubmit(hobby,'update');//即使取消修改，也有提交，不过是提交到state，取消其显示弹窗，不提交到服务器
            funClose();
        }else{// _id不存在，取消新增hobby
            funSubmit('add_cancel');
            funClose();
        }
    }

    let btn_box=document.createElement('div');
    btn_box.style="text-align:center; display:block; width:100%; margin-top:10px";
    btn_box.appendChild(submit_btn);
    btn_box.appendChild(cancel_btn);

    div.appendChild(title);
    div.appendChild(name_box);
    is_geo?div.appendChild(width_box):div.appendChild(type_box);
    div.appendChild(remark_box);
    div.appendChild(btn_box);
    return div;
}

class HobbyWindow extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div style={{fontSize:"14px",width:"auto",height:"auto"}}>
                <div style={{height:"150px",overflow:"hidden"}}>
                    <div>
                        <div>编辑兴趣点</div>
                        <table cellpadding="0" cellspacing="0" border="0">
                            <tbody>
                                <tr>
                                    <td style={{height:"35px"}} align="right">名称: </td>
                                    <td align="left">
                                        <input style={{width:"140px"}} type="text"/>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{height:"35px"}} align="right">备注: </td>
                                    <td align="left">
                                        <input style={{width:"140px"}} type="text"/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <button>保存</button>
                        <button>取消</button>
                    </div>
                </div>
            </div>
        )
    }
}

function getZoom(width){
    var zooms = ["20","50","100","200","500","1000","2000","5000","10000","20000","25000","50000","100000","200000","500000","1000000","2000000"]
    let zoom=15;
    for(let i=0;i<=16;i++){
        zoom=19-i;
        if(width<=zooms[i])break;
    }
    return zoom;
}














export default Map;