import { combineReducers } from 'redux';
import { ACT } from '../_actions';

const initialState = {
    user:{},
    cars:[],
    show_cars:ACT.const.all,
    select_users:ACT.const.all,
    select_car:0,
    hobbies:[],
    fences:[],
    selected_hobby:{},
    selected_fence:{},
    is_adding_hobby:false,
    is_adding_fence:false
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
        selected_fence:selectFenceReducer(state.selected_fence,action),
        is_adding_hobby:isAddingHobbyReducer(state.is_adding_hobby,action),
        is_adding_fence:isAddingFenceReducer(state.is_adding_fence,action)
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
        case ACT.action.GET_HOBBIES_END:{
            console.log('已获取到兴趣点数据');
            console.log(state);
            if(!action.hobbies)return state;
            let arr=action.hobbies.map(ele=>{
                ele.visible=false;
                ele.show_info_window=false;
                let old_ele=state.filter(item=>item._id==ele._id);
                if(old_ele.length!=0)ele.visible=old_ele[0].visible;
                return ele;
            });
            return arr;
        }
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
        case ACT.action.GET_FENCES_END:{
            console.log('已获取到围栏数据');
            if(!action.fences)return state;
            let arr=action.fences.map(ele=>{//给每个围栏添加两个属性
                ele.visible=false;//是否在地图上显示
                ele.show_info_window=false;//是否在地图中弹出编辑对话框
                let old_ele=state.filter(item=>item._id==ele._id);
                if(old_ele.length!=0)ele.visible=old_ele[0].visible;//如果该围栏已存在，则其visible不变
                return ele;
            });
            return arr;
        }
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
            return action.fence;
        default:
            return state;
    }
}
function isAddingHobbyReducer(state=false,action){
    switch(action.type){
        case ACT.action.ADD_HOBBY_START:
            return true;
        case ACT.action.ADD_HOBBY_FAIL:
            return false;
        default:
            return state;
    }
}
function isAddingFenceReducer(state=false,action){
    switch(action.type){
        case ACT.action.ADD_FENCE_START:
            return true;
        case ACT.action.ADD_FENCE_FAIL:
            return false;
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