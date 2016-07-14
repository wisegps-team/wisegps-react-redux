import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {List , ListItem,MakeSelectable} from 'material-ui/List';
// import ContentInbox from 'material-ui/svg-icons/content/inbox';
import FontIcon from 'material-ui/FontIcon';
var __;
let SelectableList = MakeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends React.Component {
        constructor(props) {
            super(props);
            this.handleRequestChange=this.handleRequestChange.bind(this);
        }
        handleRequestChange(event, index){
            // console.log(event);
            this.props.carClick(index)
        };

        render() {
            return (
            <ComposedComponent
                value={this.props.active}
                onChange={this.handleRequestChange}
            >
                {this.props.children}
            </ComposedComponent>
            );
        }
    };
}

SelectableList = wrapState(SelectableList);

export class CarList extends React.Component {
    render(){
        __=this.props.__;
        let items=this.props.data.map(function (ele) {
            // return <CarItem value={ele.obj_id} data={ele} key={ele.obj_id} carClick={this.props.carClick}/>;
            return <ListItem
                primaryText={ele.obj_name}
                secondaryText={
                    <span style={{color: '#333'}}>{ele.active_gps_data.device_id}</span>
                }
                key={ele.obj_id}
                value={ele.obj_id}
                innerDivStyle={{paddingTop:'5px',paddingBottom:'5px'}}
            />
        });
        return React.createElement(SelectableList, Object.assign({}, this.props, { children:items}))
    }
}

// class CarItem extends React.Component {
//     render(){
//         return(
//             <ListItem
//                 primaryText={this.props.data.obj_name}
//                 secondaryText={
//                     <span style={{color: '#333'}}>{this.props.data.active_gps_data.device_id}</span>
//                 }
//             />
//         );
//     }
// }


export default CarList;