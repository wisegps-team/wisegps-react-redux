import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
// import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ContentCreate from 'material-ui/svg-icons/content/create';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionVisibility from 'material-ui/svg-icons/action/visibility';
import ActionVisibilityOff from 'material-ui/svg-icons/action/visibility-off';

import WTable from './table';

const styles={
    a:{
        display:'block',
        width:'100%',
        textAlign:'right',
        fontSize:'10px'
    },
    div:{
        padding:'10px'
    },
    tab:{
        height:'40px'
    },
    td:{
        padding:'0 5px',
        textAlign:'center',
        height:'40px'
    },
    icon:{
        width:'20px',
        height:'20px'
    }
}

// const hobbies=[
//     {
//         name:'兴趣点1',
//         remark:'备注1',
//         lon:'107',
//         lat:'26',
//         visible:false
//     },
//     {
//         name:'兴趣点2',
//         remark:'备注2',
//         lon:'107',
//         lat:'27',
//         visible:false
//     },
//     {
//         name:'兴趣点3',
//         remark:'备注3',
//         lon:'107',
//         lat:'28',
//         visible:false
//     }
// ]
// const fences=[
//     {
//         poi_name:'围栏1',
//         remark:'fence1',
//         center_lon:'106',
//         center_lat:'27',
//         r:'5000',
//         visible:false
//     },
//     {
//         poi_name:'围栏2',
//         remark:'fence2',
//         center_lon:'107',
//         center_lat:'27',
//         r:'10000',
//         visible:false
//     },
//     {
//         poi_name:'围栏3',
//         remark:'fence3',
//         center_lon:'108',
//         center_lat:'27',
//         r:'15000',
//         visible:false
//     }
// ]

const columnProps={
    style:styles.td
}
const rowProps={
    style:{
        height:'40px'
    }
}
const headerProps={
    displaySelectAll:false,
    adjustForCheckbox:false
}

class MapManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 'a',
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value){
        this.setState({
            value: value
        });
    }
    addHobby(){
        this.props.hobbyAct({},'add_start');
    }
    addFence(){
        this.props.fenceAct({},'add_start');
    }
    pageChange(value){
        alert('切到第'+value+'页');
    }
    render() {
        return (
            <Paper zDepth={2} style={this.props.style}>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                >
                    <Tab label={___.poi} value="a" style={styles.tab}>
                        <div style={styles.div}>
                        <a onClick={this.addHobby.bind(this)} style={styles.a}><span>{___.add_hobby}</span></a>
                            <WTable 
                                data={this.props.hobbies} 
                                keys={[{name:___.name,key:'poi_name'},{name:___.remark,key:'remark'},{name:___.operation}]} 
                                active={Active1}
                                page={30}
                                pageVlaue={0}
                                pageChange={this.pageChange}

                                columnProps={columnProps}
                                headerColumnProps={columnProps}
                                rowProps={rowProps}
                                headerProps={headerProps}
                                
                                rowFun={this.props.hobbyAct}
                            />
                        </div>
                    </Tab>
                    <Tab label={___.geo} value="b" style={styles.tab}>
                        <div style={styles.div}>
                        <a style={styles.a} onClick={this.addFence.bind(this)} ><span>{___.add_fence}</span></a>
                            <WTable 
                                data={this.props.fences} 
                                keys={[{name:___.name,key:'poi_name'},{name:___.range,key:'width'},{name:___.operation}]} 
                                active={Active1}

                                rowFun={this.props.fenceAct}
                            />
                        </div>
                    </Tab>
                </Tabs>
            </Paper>
        );
    }
}

class Active1 extends Component{
    constructor(props) {
        super(props);
    }
    edit(){
        let obj=this.props.data;
        obj.visible=true;
        obj.show_info_window=true;
        this.props.fun(obj,'update');
    }
    delete(){
        if(confirm('确定删除['+this.props.data.poi_name+']?')){
            this.props.fun(this.props.data,'delete');
        }
    }
    show(){
        let obj=this.props.data;
        obj.visible=true;
        this.props.fun(obj,'update');
    }
    hide(){
        let obj=this.props.data;
        obj.visible=false;
        this.props.fun(obj,'update');
    }
    render() {
        let showOrHide=this.props.data.visible?(<ActionVisibility onClick={this.hide.bind(this)} style={styles.icon}/>):(<ActionVisibilityOff onClick={this.show.bind(this)} style={styles.icon}/>);
        return (
            <div>
                {showOrHide}
                <ContentCreate onClick={this.edit.bind(this)} style={styles.icon}/>
                <NavigationClose onClick={this.delete.bind(this)} style={styles.icon}/>
            </div>
        );
    }
}


export default MapManager;