import { combineReducers } from 'redux';
import { ACT } from '../_actions';


const hobbies=[
    {
        name:'兴趣点1',
        remark:'备注1',
        lon:'107',
        lat:'26',
        visible:false
    },
    {
        name:'兴趣点2',
        remark:'备注2',
        lon:'107',
        lat:'27',
        visible:false
    },
    {
        name:'兴趣点3',
        remark:'备注3',
        lon:'107',
        lat:'28',
        visible:false
    }
];
const fences=[
    {
        name:'围栏1',
        remark:'fence1',
        center_lon:'106',
        center_lat:'27',
        r:'5000',
        visible:false
    },
    {
        name:'围栏2',
        remark:'fence2',
        center_lon:'107',
        center_lat:'27',
        r:'10000',
        visible:false
    },
    {
        name:'围栏3',
        remark:'fence3',
        center_lon:'108',
        center_lat:'27',
        r:'15000',
        visible:false
    }
];
const initialState = {
    user:{},
    cars:[],
    show_cars:ACT.const.all,
    select_users:ACT.const.all,
    select_car:0,
    hobbies:[],
    fences:[],
    selected_hobby:{},
    selected_fence:{}
};
var user_ids=[];//全部用户的id
var obj_ids=[];//全部车辆的id

export function monitorApp(state = initialState, action) {
    switch (action.type) {
        case ACT.action.SELECT_USERS_DELETE:{//从select_user里面删除user,及其对应的car
            let deleteUsers=findChildren(action.user);
            let oldUsers=(state.select_users=="ALL"?findChildren(state.user):state.select_users);
            let newUsers=oldUsers.filter(ele=>!deleteUsers.includes(ele));
            let newUserIds=newUsers.map(ele=>ele.cust_id);
            let oldCars=(state.show_cars=="ALL"?state.cars:state.show_cars);
            let newCars=oldCars.filter(ele=>newUserIds.includes(ele.cust_id));
            return Object.assign({},state,{
                select_users:newUsers,
                show_cars:newCars
            });
        }
        case ACT.action.SELECT_USERS_ADD:{//从select_user里面添加user,及其对应的car
            let addUsers=findChildren(action.user);
            let oldUsers=(state.select_users=="ALL"?findChildren(state.user):state.select_users);
            let newUsers=oldUsers.concat(addUsers);
            let newUserIds=newUsers.map(ele=>ele.cust_id);
            let oldCars=(state.show_cars=="ALL"?state.cars:state.show_cars);
            let newCars=state.cars.filter(ele=>newUserIds.includes(ele.cust_id));
            return Object.assign({},state,{
                select_users:newUsers,
                show_cars:newCars
            });
        }

    }
    return {
        user:userReducer(state.user,action),
        cars:carsReducer(state.cars,action),
        select_users:selectUsersReducer(state.select_users,action),
        show_cars:showCarsReducer(state.show_cars,action),
        select_car:selectCarReducer(state.select_car,action),
        hobbies:HobbiesReducer(state.hobbies,action),
        fences:fencesReducer(state.fences,action),
        selected_hobby:selectHobbyReducer(state.selected_hobby,action),
        selected_fence:selectFenceReducer(state.selected_fence,action)
    };
}

function userReducer(state = {}, action) {
    switch (action.type) {
        case ACT.action.GET_USERS://开始获取用户数据
            console.log('GET_USERS:开始获取用户数据');
            return state;
        case ACT.action.GETED_USERS://获取到用户数据
            console.log('GETED_USERS:获取到用户数据');
            let arr=action.data.data;
            let cust_id=237;
            let user=arr.find(ele=>(ele.cust_id==cust_id));
            arr.forEach(function (ele) {
                let _id=ele.cust_id;
                user_ids.push(_id);
                ele.children=arr.filter(ele=>(ele.parent_cust_id==_id));
            });
            return user;
        default:
            return state
    }
}
function carsReducer(state = [], action) {
    switch (action.type) {
        case ACT.action.GET_CARS://开始获取车辆数据
            console.log('GET_CARS:开始获取车辆数据');
            return state;
        case ACT.action.GETED_CARS://获取到车辆数据
            console.log('GETED_USERS:获取到车辆数据');
            let arr=action.data;
            arr.forEach((ele)=>{
                obj_ids.push(ele.obj_id);
            });
            return action.data;
        default:
            return state
    }
}
function selectUsersReducer(state = ACT.const.all, action) {
    switch (action.type) {
        case ACT.action.SELECT_USERS:{
            return action.user;
        }
        default:
            return state
    }
}
function showCarsReducer(state = ACT.const.all, action) {
    switch (action.type) {
        case ACT.action.SHOW_CARS:
            return state;
        default:
            return state;
    }
}
function selectCarReducer(state = {}, action) {
    switch (action.type) {
        case ACT.action.SELECT_CAR:
            return action.car;
        default:
            return state;
    }
}
function HobbiesReducer(state=[],action){
    switch(action.type){
        case ACT.action.GET_HOBBIES_START:
            console.log('开始获取兴趣点数据');
            return state;
        case ACT.action.GET_HOBBIES_END:
            console.log('已获取到兴趣点数据');
            if(!action.hobbies)return state;
            let arr=action.hobbies.map(ele=>{
                ele.visible=false;
                return ele;
            });
            return arr;
        case ACT.action.ADD_HOBBY:
            return state;
        case ACT.action.DELETE_HOBBY:
            return state;
        case ACT.action.UPDATE_HOBBY:
            let newState=state.map(ele=>{
                if(ele._id==action.hobby._id){
                    return action.hobby;
                }else{
                    return ele;
                }
            });
            return newState;
        default:
            return state;
    }
}
function selectHobbyReducer(state = {}, action) {
    switch (action.type) {
        case ACT.action.SELECT_HOBBY:
            return action.hobby;
        default:
            return state;
    }
}
function fencesReducer(state=[],action){
    switch(action.type){
        case ACT.action.GET_FENCES:{
            console.log('已获取到围栏数据');
            if(!action.fences)return state;
            let arr=action.fences.map(ele=>{
                ele.visible=false;
                return ele;
            });
            return arr;
        }
        case ACT.action.ADD_FENCE:
            return state;
        case ACT.action.DELETE_FENCE:
            return state;
        case ACT.action.UPDATE_FENCE:{
            let newState=state.map(ele=>{
                if(ele._id==action.fence._id){
                    return action.fence;
                }else{
                    return ele;
                }
            });
            return newState;
        }
        default:
            return state;
    }
}
function selectFenceReducer(state = {}, action) {
    switch (action.type) {
        case ACT.action.SELECT_FENCE:
            // return action.fence;
            return state;
        default:
            return state;
    }
}

//工具，传入一个user,递归获取它和它的所有children
function findChildren(par){
    let children=[];
    children.push(par);
    par.children.forEach((ele)=>{children=children.concat(findChildren(ele))});
    return children;
}

export default monitorApp;