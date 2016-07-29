var code="b573bcc9b949e6c593d1fb6d206f6c69";

export const ACT ={
    action:{
        SELECT_CAR:'SELECT_CAR',
        SELECT_USERS:'SELECT_USERS',
        SELECT_USERS_ADD:'SELECT_USERS_ADD',
        SELECT_USERS_DELETE:'SELECT_USERS_DELETE',
        SHOW_CARS:'SHOW_CARS',
        GET_USERS:'GET_USERS',
        GET_CARS:'GET_CARS',
        GETED_USERS:'GETED_USERS',
        GETED_CARS:'GETED_CARS',

        GET_HOBBIES_START:'GET_HOBBIES_START',
        GET_HOBBIES_END:'GET_HOBBIES_END',
        ADD_HOBBY_START:'ADD_HOBBY_START',
        ADD_HOBBY_FAIL:'ADD_HOBBY_FAIL',
        DELETE_HOBBY:'DELETE_HOBBY',
        UPDATE_HOBBY:'UPDATE_HOBBY',
        SELECT_HOBBY:'SELECT_HOBBY',

        GET_FENCES_END:'GET_FENCES_END',
        ADD_FENCE_START:'ADD_FENCE_START',
        ADD_FENCE_FAIL:'ADD_FENCE_FAIL',
        DELETE_FENCE:'DELETE_FENCE',
        UPDATE_FENCE:'UPDATE_FENCE',
        SELECT_FENCE:'SELECT_FENCE'
    },
    'const':{
        all:'ALL'
    },
    fun:{
        addSelect:function (user_id) {
            return {type: ACT.action.ADD_SELECT,user_id};
        },
        selectCar:function (car) {
            return {type: ACT.action.SELECT_CAR,car};
        },
        selectUsers:function(user){
            return {type: ACT.action.SELECT_USERS,user};
        },
        selectUsersAdd:function(user){//添加select_users里的用户
            return {type: ACT.action.SELECT_USERS_ADD,user};
        },
        selectUsersDelete:function(user){//删除select_users里的用户
            return {type: ACT.action.SELECT_USERS_DELETE,user};
        },
        showCars:function(cars){
            return {type: ACT.action.SHOW_CARS,cars};
        },
        getUsers:function (getCar) {//异步获取用户资料,所以是返回一个方法而不是一个json
            return function(dispatch) {
                dispatch(ACT.fun.startGetUsers());
                W.get(AJAX[0].url,AJAX[0].data,function (res) {
                    dispatch(ACT.fun.getedUsers(res));
                    dispatch(ACT.fun.selectUsers(res.data));
                    if(getCar){
                        let users=res.data.map(ele=>ele.cust_id).join(',');
                        dispatch(ACT.fun.getCars(users));                        
                    }
                },AJAX[0].dataType);
            }
        },
        startGetUsers:function () {
            return {type: ACT.action.GET_USERS};
        },
        getCars:function (users) {//异步获取车辆资料,所以是返回一个方法而不是一个json
            return function(dispatch) {
                dispatch(ACT.fun.startGetCars());
                W.get(AJAX[1].url.replace('$user$',users),AJAX[1].data,function (res) {
                    dispatch(ACT.fun.getedCars(res));
                    setTimeout(()=>dispatch(ACT.fun.getCars(users)),10000);//10秒轮询
                },AJAX[1].dataType);
            }
        },
        startGetCars:function () {
            return {type: ACT.action.GET_CARS};
        },
        getedUsers:function (data) {//获取到所有用户数据
            return {type: ACT.action.GETED_USERS,data};
        },
        getedCars:function (data) {//获取到所有车辆数据
            return {type: ACT.action.GETED_CARS,data};
        },

        getHobbies:function(hobbies){//获取所有兴趣点
            return function(dispatch){
                dispatch(ACT.fun.getHobbiesStart());
                W.get(AJAX[4].url,AJAX[4].data,function(res){
                    dispatch(ACT.fun.getHobbiesEnd(res.data));
                },AJAX[4].dataType);
            }
        },
        getHobbiesStart:function(){//获取所有兴趣点，开始
            return{type:ACT.action.GET_HOBBIES_START};
        },
        getHobbiesEnd:function(hobbies){//获取所有兴趣点，结束
            return{type:ACT.action.GET_HOBBIES_END,hobbies};
        },
        addHobbyStart:function(){//添加一个兴趣点
            return {type:ACT.action.ADD_HOBBY_START};
        },
        addHobbySubmit:function(hobby){
            return function(dispatch){
                let url="http://web.wisegps.cn/app/poi/?auth_code="+code;
                let options={
                    data:hobby,
                    dataType:'json',
                    type:'post',
                    timeout:10000,
                    success:function(res){//添加完成之后重新从服务器获取兴趣点
                        dispatch(ACT.fun.getHobbies([]));
                    },
                    error:function(xhr,type,errorThrow){
                        alert('fail to add hobby');
                        console.log(type+'___url:'+url);
                        dispatch(ACT.fun.addHobbyFail());
                    }
                }
                W.ajax(url,options);
            }
        },
        addHobbyFail:function(){
            return {type:ACT.action.ADD_HOBBY_FAIL};
        },
        deleteHobby:function(hobby){//删除一个兴趣点
            return function(dispatch){
                let url="http://web.wisegps.cn/app/poi/"+hobby.poi_id+"?auth_code=" +code;
                let options={
                    data:null,
                    dataType:'json',
                    type:'DELETE',
                    timeout:10000,
                    success:function(res){
                        dispatch(ACT.fun.getHobbies([]));
                    },
                    error:function(xhr,type,errorThrow){
                        console.log(type+'___url:'+url);
                    }
                }
                W.ajax(url,options);
            }
        },
        updateHobby:function(hobby){//更新一个兴趣点
            return {type:ACT.action.UPDATE_HOBBY,hobby};
        },
        updateHobbySubmit:function(hobby){
            return function(dispatch){
                let url='http://web.wisegps.cn/app/poi/'+hobby.poi_id+'?auth_code='+code
                let data={
                    poi_name:hobby.poi_name,
                    cust_id:hobby.cust_id,
                    poi_type:hobby.poi_type,
                    remark:hobby.remark,
                    lon:hobby.lon, 
                    lat:hobby.lat,
                    is_geo:0, 
                    width:hobby.width
                }
                let options={
                    data:data,
                    dataType:'json',
                    type:"PUT",
                    timeout:10000,
                    success:function(res){
                        dispatch(ACT.fun.getHobbies([]));
                    },
                    error:function(xhr,type,errorThrow){
                        console.log(type+'___url:'+url);
                    }
                }
                W.ajax(url,options);
            }
        },
        updateHobbyEnd:function(hobby){
            return {type:ACT.action.UPDATE_HOBBY,hobby};
        },
        selectHobby:function(hobby){//设置当前已选择的兴趣点
            return {type:ACT.action.SELECT_HOBBY,hobby};
        },

        getFences:function(fences){//获取所有围栏数据
            return function(dispatch){
                W.get(AJAX[5].url,AJAX[5].data,function(res){
                    dispatch(ACT.fun.getFencesEnd(res.data));
                },AJAX[5].dataType);
            }
        },
        getFencesEnd(fences){//获取到所有围栏数据
            return {type:ACT.action.GET_FENCES_END,fences};
        },
        addFenceStart:function(fence){//添加一个围栏
            return {type:ACT.action.ADD_FENCE_START,fence};
        },
        addFenceSubmit:function(fence){
            return function(dispatch){
                let url="http://web.wisegps.cn/app/poi/?auth_code="+code;
                let options={
                    data:fence,
                    dataType:'json',
                    type:'post',
                    timeout:10000,
                    success:function(res){
                        dispatch(ACT.fun.getFences([]));
                    },
                    error:function(xhr,type,errorThrow){
                        console.log(type+'___url:'+url);
                        dispatch(ACT.fun.addFenceFail());
                    }
                }
                W.ajax(url,options);
            }
        },
        addFenceFail:function(){
            return {type:ACT.action.ADD_FENCE_FAIL};
        },
        deleteFence:function(fence){//删除一个围栏
            return function(dispatch){
                let url="http://web.wisegps.cn/app/poi/"+fence.poi_id+"?auth_code=" +code;
                let options={
                    data:null,
                    dataType:'json',
                    type:'DELETE',
                    timeout:10000,
                    success:function(res){
                        dispatch(ACT.fun.getFences([]));
                    },
                    error:function(xhr,type,errorThrow){
                        console.log(type+'___url:'+url);
                    }
                }
                W.ajax(url,options);
            }
        },
        updateFence:function(fence){//更新一个围栏
            return {type:ACT.action.UPDATE_FENCE,fence};
        },
        updateFenceSubmit:function(fence){
            return function(dispatch){
                let url='http://web.wisegps.cn/app/poi/'+fence.poi_id+'?auth_code='+code;
                let data={
                    poi_name:fence.poi_name,
                    cust_id:fence.cust_id,
                    poi_type:fence.poi_type,
                    remark:fence.remark,
                    lon:fence.lon, 
                    lat:fence.lat,
                    is_geo:1, 
                    width:fence.width
                }
                let options={
                    data:data,
                    dataType:'json',
                    type:"PUT",
                    timeout:10000,
                    success:function(res){
                        dispatch(ACT.fun.getFences([]));
                    },
                    error:function(xhr,type,errorThrow){
                        console.log(type+'___url:'+url);
                    }
                }
                W.ajax(url,options);
            }
        },
        selectFence:function(fence){//设置当前已选择的围栏
            return {type:ACT.action.SELECT_FENCE,fence};
        }
        
    }
};






const AJAX=[
    {//获取子用户 AJAX[0]
        "url":"http://web.wisegps.cn/app/customer/237/customer",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "tree_path":",1,237,",
            "page_no":1,
            "page_count":1000
        },
        "timeout":10000
    },
    {//获取车辆 AJAX[1]
        "url":"http://web.wisegps.cn/app/customer/$user$/active_gps_data",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "update_time": "1700-01-01", 
            "mode": "multi"
        }
    },
    {//未读消息 AJAX[2]
        "url":"http://web.wisegps.cn/app/customer/237/noti_unread2",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "tree_path":",1,237,",
            "t":1467702757914
        },
        "timeout":10000
    },
    {//未读警告 AJAX[3]
        "url":"http://web.wisegps.cn/app/customer/237/alert_unread",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "tree_path":",1,237,",
            "update_time":"1700-01-01",
            "t":1467702765610
        },
        "timeout":10000
    },
    {//获取兴趣点 AJAX[4]
        "url":"http://web.wisegps.cn/app/customer/237/poi",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "is_geo":0,
            "rand":0.9083654713010103
        }
    },
    {//获取围栏 AJAX[5]
        "url":"http://web.wisegps.cn/app/customer/237/poi",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "is_geo":1,
            "rand":0.15131601312031773
        }
    },
    {//更新兴趣点 AJAX[6]
        "url":"http://web.wisegps.cn/app/poi/?auth_code="+code,
        "type":"POST",
        "dataType":"json",
        "data":{
            "is_geo":0,
        }
    }
]