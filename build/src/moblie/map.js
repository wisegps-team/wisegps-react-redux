webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(38);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactTapEventPlugin = __webpack_require__(168);

	var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

	var _redux = __webpack_require__(174);

	var _reactRedux = __webpack_require__(187);

	var _reduxThunk = __webpack_require__(200);

	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

	var _AppBar = __webpack_require__(201);

	var _AppBar2 = _interopRequireDefault(_AppBar);

	var _monitor = __webpack_require__(243);

	var _monitor2 = _interopRequireDefault(_monitor);

	var _actions = __webpack_require__(244);

	var _default = __webpack_require__(245);

	var _car_list = __webpack_require__(406);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	console.log('map加载了');
	var thisView = window.LAUNCHER.getView(); //第一句必然是获取view

	var __; //语言资源
	if (!window.STORE) {
	    window.STORE = (0, _redux.createStore)(_monitor2.default, (0, _redux.applyMiddleware)( //应用中间件，为了可以使用异步action
	    _reduxThunk2.default //为了可以使用异步action
	    ));
	    (0, _reactTapEventPlugin2.default)(); //启用react触摸屏
	}

	// 每次 state 更新时，打印日志
	// 注意 subscribe() 返回一个函数用来注销监听器
	var unsubscribe = STORE.subscribe(function () {
	    return console.log(STORE.getState());
	});

	W.viewLoaded('monitor', thisView, function (res) {
	    __ = res;
	    _reactDom2.default.render(_react2.default.createElement(
	        _reactRedux.Provider,
	        { store: STORE },
	        _react2.default.createElement(APP, null)
	    ), thisView);
	});

	var App = function (_React$Component) {
	    _inherits(App, _React$Component);

	    function App(props, context) {
	        _classCallCheck(this, App);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props, context));

	        _this.state = {
	            drawer: true
	        };
	        return _this;
	    }

	    _createClass(App, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            // STORE.dispatch(ACT.fun.getUsers(true));//异步的action
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            return _react2.default.createElement(
	                _default.ThemeProvider,
	                null,
	                _react2.default.createElement(
	                    'div',
	                    null,
	                    _react2.default.createElement(_AppBar2.default, {
	                        title: __.title,
	                        iconClassNameRight: 'muidocs-icon-navigation-expand-more',
	                        onLeftIconButtonTouchTap: function onLeftIconButtonTouchTap() {
	                            return _this2.setState({ drawer: true });
	                        }
	                    }),
	                    _react2.default.createElement(_car_list.CarList, {
	                        data: this.props.show_cars,
	                        __: __,
	                        carClick: carClick,
	                        active: this.props.select_car
	                    })
	                )
	            );
	        }
	    }]);

	    return App;
	}(_react2.default.Component);

	var APP = (0, _reactRedux.connect)(function select(state) {
	    var sta = {};
	    Object.assign(sta, state);
	    sta.show_cars = sta.show_cars == _actions.ACT.const.all ? sta.cars : sta.show_cars;
	    return sta;
	})(App);

	function carClick(data) {
	    STORE.dispatch(_actions.ACT.fun.selectCar(data));
	    late(function () {
	        return thisView.goTo('monitor.js');
	    });
	}

	function late(fun) {
	    setTimeout(fun, 1000);
	}

/***/ }
]);