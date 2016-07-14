import React, {Component} from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

class WTable extends Component {
    render() {
        let keys=[];
        let header=this.props.keys.map(function (ele) {
            if(ele.key)
                keys.push(ele.key);
            return ele.name;
        });
        let rows=this.props.data.map((ele,i)=>(
            <Row 
                keys={keys} 
                data={ele} 
                active={this.props.active} 
                key={i}
                columnProps={this.props.columnProps}
                rowProps={this.props.rowProps}
            />)
        );
        let hraders=header.map((ele,i)=>(
            <TableHeaderColumn {...this.props.headerColumnProps} key={i}>
                {ele}
            </TableHeaderColumn>)
        );
        return (
            <Table {...this.props.tableProps}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false} {...this.props.headerProps}>
                    <TableRow {...this.props.rowProps}>
                        {hraders}
                    </TableRow>
                </TableHeader>
                <TableBody>  
                    {rows}
                </TableBody>
            </Table>
        );
    }
}

class Row extends Component {
    render() {
        let columns;
        if(this.props.isArray)
            columns=this.props.data.map(function (ele,index,arr) {
                return (<TableRowColumn {...this.props.columnProps} key={index}>{ele}</TableRowColumn>);
            },this);
        else
            columns=this.props.keys.map(function (key,index,arr) {
                return (<TableRowColumn {...this.props.columnProps} key={index}>{this.props.data[key]}</TableRowColumn>);
            },this);
        if(this.props.active){
            let Active=this.props.active;
            columns.push(<TableRowColumn {...this.props.columnProps} key={columns.length}>
                <Active data={this.props.data}/>
            </TableRowColumn>);
        }
        return (
            <TableRow {...this.props.rowProps}>
                {columns}
            </TableRow>
        );
    }
}

export default WTable;