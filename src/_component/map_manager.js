import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {Tabs, Tab} from 'material-ui/Tabs';
// import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ContentCreate from 'material-ui/svg-icons/content/create';
import MapsDirectionsCar from 'material-ui/svg-icons/maps/directions-car';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

import WTable from './table';

const styles={
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

const xqd=[
    {
        name:'兴趣点1',
        remark:'备注1'
    },
    {
        name:'兴趣点2',
        remark:'备注2'
    },
    {
        name:'兴趣点3',
        remark:'备注3'
    }
];

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
    };
    render() {
        return (
            <Paper zDepth={2} style={this.props.style}>
                <Tabs
                    value={this.state.value}
                    onChange={this.handleChange}
                >
                    <Tab label="兴趣点" value="a" style={styles.tab}>
                        <div style={styles.div}>
                            <WTable 
                                data={xqd} 
                                keys={[{name:'名称',key:'name'},{name:'备注',key:'remark'},{name:'操作'}]} 
                                active={Active1}
                                columnProps={columnProps}
                                headerColumnProps={columnProps}
                                rowProps={rowProps}
                                headerProps={headerProps}
                            />
                        </div>
                    </Tab>
                    <Tab label="围栏" value="b" style={styles.tab}>
                        <div style={styles.div}>
                            <WTable 
                                data={xqd} 
                                keys={[{name:'名称',key:'name'},{name:'范围',key:'remark'},{name:'操作'}]} 
                                active={Active1}
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
        this.clickCreate = this.clickCreate.bind(this);
        this.delete = this.delete.bind(this);
    }
    
    clickCreate(){
        alert('编辑名称为'+this.props.data.name);
    }

    delete(){
        alert('删除名称为'+this.props.data.name);
    }

    render() {
        return (
            <div>
                <ContentCreate onClick={this.clickCreate} style={styles.icon}/>
                <NavigationClose onClick={this.delete} style={styles.icon}/>
            </div>
        );
    }
}

export default MapManager;