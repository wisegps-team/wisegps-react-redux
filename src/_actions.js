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
        ADD_HOBBY:'ADD_HOBBY',
        DELETE_HOBBY:'DELETE_HOBBY',
        UPDATE_HOBBY:'UPDATE_HOBBY',
        SELECT_HOBBY:'SELECT_HOBBY',

        GET_FENCES:'GET_FENCES',
        ADD_FENCE:'ADD_FENCE',
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
        addHobby:function(hobby){//添加一个兴趣点
            return {type:ACT.action.ADD_HOBBY,hobby};
        },
        deleteHobby:function(hobby){//删除一个兴趣点
            return {type:ACT.action.DELETE_HOBBY,hobby};
        },
        updateHobby:function(hobby){//更新一个兴趣点
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
            return {type:ACT.action.GET_FENCES,fences};
        },
        addFence:function(fence){//添加一个围栏
            return {type:ACT.action.ADD_FENCE,fence};
        },
        deleteFence:function(fence){//删除一个围栏
            return {type:ACT.action.DELETE_FENCE,fence};
        },
        updateFence:function(fence){//更新一个围栏
            return {type:ACT.action.UPDATE_FENCE,fence};
        },
        selectFence:function(fence){//设置当前已选择的围栏
            return {type:ACT.action.SELECT_FENCE,fence};
        }
        
    }
};






const AJAX=[
    {//获取子用户
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
    {//获取车辆
        "url":"http://web.wisegps.cn/app/customer/$user$/active_gps_data",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "update_time": "1700-01-01", 
            "mode": "multi"
        }
    },
    {//未读消息
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
    {//未读警告
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
    {//兴趣点
        "url":"http://web.wisegps.cn/app/customer/237/poi",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "is_geo":0,
            "rand":0.9083654713010103
        }
    },
    {//围栏
        "url":"http://web.wisegps.cn/app/customer/237/poi",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "is_geo":1,
            "rand":0.15131601312031773
        }
    }
]