/**
 * 用于组件通用的一些mixins
 */



export var  P={
    rebuild:function (com) {
        com._setState=com.setState;
        com.setState=this.setS;
    },
    setS:function (obj){
        this._setState(Object.assign({},this.state,obj));
    }
}


export default P;