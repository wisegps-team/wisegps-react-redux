webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

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

	var _Drawer = __webpack_require__(425);

	var _Drawer2 = _interopRequireDefault(_Drawer);

	var _monitor = __webpack_require__(243);

	var _monitor2 = _interopRequireDefault(_monitor);

	var _actions = __webpack_require__(244);

	var _default = __webpack_require__(245);

	var _car_list = __webpack_require__(406);

	var _user_tree = __webpack_require__(417);

	var _map = __webpack_require__(429);

	var _map2 = _interopRequireDefault(_map);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	__webpack_require__(450);

	var __; //语言资源
	var STORE = (0, _redux.createStore)(_monitor2.default, (0, _redux.applyMiddleware)( //应用中间件，为了可以使用异步action
	_reduxThunk2.default //为了可以使用异步action
	));

	(0, _reactTapEventPlugin2.default)(); //启用react触摸屏

	// 打印初始状态
	console.log(STORE.getState());

	// 每次 state 更新时，打印日志
	// 注意 subscribe() 返回一个函数用来注销监听器
	var unsubscribe = STORE.subscribe(function () {
	    return console.log(STORE.getState());
	});

	var styles = {
	    container: {
	        textAlign: 'center',
	        paddingLeft: '256px'
	    },
	    userTreeBox: {
	        display: 'block',
	        height: '240px',
	        overflow: 'scroll'
	    },
	    carListBox: {
	        display: 'block',
	        height: '360px',
	        overflow: 'scroll'
	    }
	};

	W.viewLoaded('monitor', window, function (res) {
	    __ = res;
	    _reactDom2.default.render(_react2.default.createElement(
	        _reactRedux.Provider,
	        { store: STORE },
	        _react2.default.createElement(APP, null)
	    ), W('#APP'));
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
	            STORE.dispatch(_actions.ACT.fun.getUsers(true)); //异步的action
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
	                        title: '',
	                        iconClassNameRight: 'muidocs-icon-navigation-expand-more',
	                        onLeftIconButtonTouchTap: function onLeftIconButtonTouchTap() {
	                            return _this2.setState({ drawer: true });
	                        },
	                        className: 'appbar'
	                    }),
	                    _react2.default.createElement(
	                        _Drawer2.default,
	                        { open: this.state.drawer },
	                        _react2.default.createElement(_AppBar2.default, {
	                            title: __.title,
	                            onLeftIconButtonTouchTap: function onLeftIconButtonTouchTap() {
	                                return _this2.setState({ drawer: false });
	                            }
	                        }),
	                        _react2.default.createElement(
	                            'div',
	                            { style: styles.userTreeBox },
	                            _react2.default.createElement(_user_tree.UserTree, { data: this.props.user, userClick: userClick, select_users: this.props.select_users })
	                        ),
	                        _react2.default.createElement(
	                            'div',
	                            { style: styles.carListBox },
	                            _react2.default.createElement(_car_list.CarList, {
	                                data: this.props.show_cars,
	                                __: __,
	                                carClick: carClick,
	                                active: this.props.select_car
	                            })
	                        )
	                    ),
	                    _react2.default.createElement(
	                        'div',
	                        { className: 'container' },
	                        _react2.default.createElement(_map2.default, { id: 'monitor_map', cars: this.props.show_cars, active: this.props.select_car, carClick: carClick })
	                    )
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
	}

	function userClick(data, intent) {
	    if (intent == "delete") {
	        STORE.dispatch(_actions.ACT.fun.selectUsersDelete(data));
	    } else if (intent == "add") {
	        STORE.dispatch(_actions.ACT.fun.selectUsersAdd(data));
	    }
	}

/***/ },

/***/ 417:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UserTree = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(38);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _reactTapEventPlugin = __webpack_require__(168);

	var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

	var _List = __webpack_require__(407);

	var _Checkbox = __webpack_require__(418);

	var _Checkbox2 = _interopRequireDefault(_Checkbox);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var UserTree = exports.UserTree = function (_React$Component) {
	    _inherits(UserTree, _React$Component);

	    function UserTree(props) {
	        _classCallCheck(this, UserTree);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(UserTree).call(this, props));

	        _this.handleTouch = _this.handleTouch.bind(_this);
	        return _this;
	    }

	    _createClass(UserTree, [{
	        key: 'handleTouch',
	        value: function handleTouch(e) {
	            var users = this.props.select_users;
	            if (users.includes(this.props.data)) {
	                this.props.userClick(this.props.data, "delete");
	            } else if (!users.includes(this.props.data)) {
	                this.props.userClick(this.props.data, "add");
	            }
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var users = this.props.select_users;
	            var fun = this.props.userClick;
	            var children = [];
	            if (this.props.data.children) children = this.props.data.children.map(function (ele) {
	                return _react2.default.createElement(UserTree, { key: ele.cust_id, data: ele, userClick: fun, select_users: users });
	            });
	            return _react2.default.createElement(_List.ListItem, {
	                primaryText: this.props.data.cust_name,
	                initiallyOpen: true,
	                primaryTogglesNestedList: true,
	                innerDivStyle: { fontSize: '14px', borderBottom: 'solid 1px #ccc' },
	                nestedItems: children,
	                nestedListStyle: { paddingLeft: '15px', paddingTop: '0', paddingBottom: '0' },
	                leftCheckbox: _react2.default.createElement(_Checkbox2.default, { defaultChecked: users.includes(this.props.data), onClick: this.handleTouch })
	            });
	        }
	    }]);

	    return UserTree;
	}(_react2.default.Component);

	exports.default = UserTree;

/***/ },

/***/ 429:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _car_state = __webpack_require__(430);

	var _map_manager = __webpack_require__(431);

	var _map_manager2 = _interopRequireDefault(_map_manager);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var map_ready = false;
	var wmap, infoWindow;

	W.include(WiStorm.root + '/wslib/toolkit/WMap.js', function (e) {
	    if (typeof e === 'boolean' && e) {
	        //已经包含
	        if (WMap && WMap.status == 200) {
	            //百度地图js也已经加载完了
	            map_ready = true;
	        } else {
	            window.addEventListener('W.mapready', function () {
	                map_ready = true;
	            });
	        }
	    }
	});

	var styles = {
	    manager: {
	        position: 'absolute',
	        zIndex: 1,
	        width: '300px',
	        right: 0,
	        top: '50px',
	        maxHeight: '100%'
	    }
	};

	var Map = function (_Component) {
	    _inherits(Map, _Component);

	    function Map(props) {
	        _classCallCheck(this, Map);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Map).call(this, props));

	        _this.mapinit = _this.mapinit.bind(_this);
	        return _this;
	    }

	    _createClass(Map, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            if (map_ready) {
	                this.mapinit();
	            } else {
	                window.addEventListener('W.mapready', this.mapinit());
	            }
	        }
	    }, {
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(nextProps) {
	            //收到新props
	            if (nextProps.cars.length != this.props.cars.length) {
	                var view = nextProps.cars.map(function (ele) {
	                    return new BMap.Point(ele.active_gps_data.b_lon, ele.active_gps_data.b_lat);
	                });
	                wmap.setViewport(view); //设置合适的层级大小
	            }
	        }
	    }, {
	        key: 'mapinit',
	        value: function mapinit() {
	            wmap = new WMap(this.props.id);
	            wmap.enableScrollWheelZoom(); //启用滚轮放大缩小
	            wmap.addControl(new WMap.NavigationControl());
	            infoWindow = new WMap.InfoWindow('', {
	                width: 350, // 信息窗口宽度
	                height: 200 // 信息窗口高度
	            });
	            var div = document.createElement('div');
	            infoWindow.setContent(div);
	            infoWindow._div = div;
	            infoWindow._close = function () {};
	            infoWindow.addEventListener('close', function () {
	                if (this._close) this._close();
	            });
	            this.forceUpdate();
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            var children = void 0;
	            if (wmap) {
	                (function () {
	                    var windowOpen = false;
	                    children = _this2.props.cars.length ? _this2.props.cars.map(function (ele) {
	                        windowOpen = this.props.active == ele.obj_id;
	                        return _react2.default.createElement(Car, { data: ele, key: ele.obj_id, carClick: this.props.carClick, open: windowOpen });
	                    }, _this2) : [];
	                    children.push(_react2.default.createElement(_map_manager2.default, { style: styles.manager, key: 'MapManager' }));
	                })();
	            }
	            return _react2.default.createElement('div', this.props, children);
	        }
	    }]);

	    return Map;
	}(_react.Component);

	var Car = function (_Component2) {
	    _inherits(Car, _Component2);

	    function Car(props) {
	        _classCallCheck(this, Car);

	        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Car).call(this, props));

	        _this3.openWindow = _this3.openWindow.bind(_this3);
	        _this3.state = {
	            tracking: false
	        };
	        return _this3;
	    }

	    _createClass(Car, [{
	        key: 'componentDidMount',
	        value: function componentDidMount() {
	            this.marker = wmap.addMarker({
	                img: 'http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif',
	                w: 28,
	                h: 28,
	                lon: this.props.data.active_gps_data.b_lon,
	                lat: this.props.data.active_gps_data.b_lat
	            });
	            this.marker.addEventListener("click", this.openWindow);
	            this.setMarker();
	        }
	    }, {
	        key: 'componentWillReceiveProps',
	        value: function componentWillReceiveProps(nextProps) {
	            if (nextProps.open) {
	                var win = this.getWindow();
	                if (!this.props.open) this.marker.openInfoWindow(win);
	            }
	            if (this.props.data.active_gps_data.b_lon != nextProps.data.active_gps_data.b_lon || this.props.data.active_gps_data.b_lat != nextProps.data.active_gps_data.b_lat) {
	                var pos = new BMap.Point(nextProps.data.active_gps_data.b_lon, nextProps.data.active_gps_data.b_lat);
	                this.marker.setPosition(pos);
	                if (this.state.tracking) {
	                    //跟踪当中
	                    var tracking_line = this.state.tracking_line.concat(pos);
	                    this.setState(Object.assign({}, this.state, { tracking_line: tracking_line }));
	                }
	            }
	            this.setMarker();
	        }
	    }, {
	        key: 'componentWillUpdate',
	        value: function componentWillUpdate(nextProps, nextState) {
	            if (nextState.tracking) {
	                //跟踪状态
	                if (!this.state.tracking || nextState.tracking_line.length != this.state.tracking_line.length) {
	                    //开始跟踪
	                    var polyline = new WMap.Polyline(nextState.tracking_line, {
	                        strokeColor: "blue",
	                        strokeWeight: 5,
	                        strokeOpacity: 0.5
	                    });
	                    if (this.polyline) wmap.removeOverlay(this.polyline);
	                    wmap.addOverlay(polyline);
	                    this.polyline = polyline;
	                }
	            } else if (this.polyline) {
	                wmap.removeOverlay(this.polyline);
	                this.polyline = undefined;
	            }
	        }
	    }, {
	        key: 'componentDidUpdate',
	        value: function componentDidUpdate() {
	            console.log('已经更新');
	        }
	    }, {
	        key: 'componentWillUnmount',
	        value: function componentWillUnmount() {
	            //移除
	            wmap.removeOverlay(this.marker);
	            delete this.marker;
	        }
	    }, {
	        key: 'openWindow',
	        value: function openWindow() {
	            this.props.carClick(this.props.data.obj_id);
	        }
	    }, {
	        key: 'getWindow',
	        value: function getWindow() {
	            var _this4 = this;

	            var div = infoWindow._div;
	            var new_div = info(this.props.data, this);
	            if (div._content) div.replaceChild(new_div, div._content);else div.appendChild(new_div);
	            div._content = new_div;
	            infoWindow._close = null;
	            setTimeout(function () {
	                return infoWindow._close = function () {
	                    return _this4.props.carClick(0);
	                };
	            }, 500); //避免从一个车点到另一个车会触发这个方法

	            return infoWindow;
	        }
	    }, {
	        key: 'setMarker',
	        value: function setMarker() {
	            var imgs = ['http://web.wisegps.cn/stylesheets/objects/normal_stop_0.gif', //停止
	            'http://web.wisegps.cn/stylesheets/objects/normal_run_0.gif', //行驶
	            'http://web.wisegps.cn/stylesheets/objects/normal_offline_0.gif' //离线
	            ];
	            var state = (0, _car_state.getStatusDesc)(this.props.data, 2);
	            var icon = this.marker.getIcon();
	            icon.setImageUrl(imgs[state.state]);
	            this.marker.setIcon(icon);
	            if (this.props.data.active_gps_data.direct) this.marker.setRotation(this.props.data.active_gps_data.direct);
	        }
	    }, {
	        key: 'track',
	        value: function track(start) {
	            //开始跟踪或者取消
	            if (start) {
	                var pos = new BMap.Point(this.props.data.active_gps_data.b_lon, this.props.data.active_gps_data.b_lat);
	                this.setState({
	                    tracking: true,
	                    tracking_line: [pos]
	                });
	            } else if (this.state.tracking) {
	                this.setState({
	                    tracking: false,
	                    tracking_line: []
	                });
	            }
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return null;
	        }
	    }]);

	    return Car;
	}(_react.Component);

	function info(data, thisCar) {
	    var f = parseInt(data.active_gps_data.signal / 5);
	    f = f > 4 ? 4 : f;
	    f = f < 1 ? 1 : f;
	    var ft = '差差弱良强';
	    var uni_status = data.active_gps_data.uni_status.indexOf(8196) != -1 ? '启动' : '熄火';
	    var g = void 0,
	        gt = void 0;
	    if (data.active_gps_data.gps_flag == 2) {
	        g = '_g', gt = '定位';
	    } else {
	        g = '', gt = '无定位';
	    }
	    var model = data.call_phones.length && data.call_phones[0].obj_model ? '(' + data.call_phones[0].obj_model + ')' : '';
	    var gps_time = W.dateToString(W.date(data.active_gps_data.gps_time));
	    var desc = (0, _car_state.getStatusDesc)(data, 2).desc;
	    var div = document.createElement('div');
	    div.style.fontSize = '14px';
	    div.innerHTML = '<p><span><font style="font-size: 15px; font-weight:bold; font-family:微软雅黑;">' + data.obj_name + model + '</font></span><img src="http://web.wisegps.cn/images/wifi' + f + '.png" title="信号' + ft[f] + '"/><img src="http://web.wisegps.cn/images/gps' + g + '.png" title="' + gt + '"/></p><table style="width: 100%;"><tbody><tr><td><font color="#244FAF">车辆状态：</font>' + desc + '</td><td><font color="#244FAF">启动状态：</font>' + uni_status + '</td></tr><tr><td colspan="2"><font color="#244FAF">定位时间：' + gps_time + '</font></td></tr><tr><td colspan="2"><font color="#244FAF">位置描述：</font><span class="location">获取地址中……</span></td></tr><tr><td width="50%"><font color="#244FAF">管理人员：</font>' + data.call_phones[0].manager + '</td><td><font color="#244FAF">联系电话：</font>' + data.call_phones[0].phone1 + '</td></tr><tr><td width="50%"><font color="#244FAF">司机姓名：</font>' + data.call_phones[0].driver + '</td><td><font color="#244FAF">联系电话：</font>' + data.call_phones[0].phone + '</td></tr></tbody></table>';
	    var geo = new WMap.Geocoder();
	    geo.getLocation(new WMap.Point(data.active_gps_data.b_lon, data.active_gps_data.b_lat), function (res) {
	        if (res) div.querySelector('.location').innerText = res.address;
	    });
	    var b = document.createElement('button');
	    b.innerText = thisCar.state.tracking ? '取消跟踪' : '跟踪';
	    b.addEventListener('click', function () {
	        thisCar.track(!thisCar.state.tracking);
	        this.innerText = thisCar.state.tracking ? '取消跟踪' : '跟踪';
	    });
	    div.appendChild(b);
	    return div;
	}

	exports.default = Map;

/***/ },

/***/ 430:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getStatusDesc = getStatusDesc;
	exports.getUniAlertsDesc = getUniAlertsDesc;
	var ALERT_SOS = 0x3001; //紧急报警
	var ALERT_OVERSPEED = 0x3002; //超速报警
	var ALERT_VIRBRATE = 0x3003; //震动报警      
	var ALERT_MOVE = 0x3004; //位移报警      
	var ALERT_ALARM = 0x3005; //防盗器报警    
	var ALERT_INVALIDRUN = 0x3006; //非法行驶报警  
	var ALERT_ENTERGEO = 0x3007; //进围栏报警    
	var ALERT_EXITGEO = 0x3008; //出围栏报警    
	var ALERT_CUTPOWER = 0x3009; //断电报警      
	var ALERT_LOWPOWER = 0x300A; //低电压报警    
	var ALERT_GPSCUT = 0x300B; //GPS天线断路报警
	var ALERT_OVERDRIVE = 0x300C; //疲劳驾驶报警  
	var ALERT_INVALIDACC = 0x300D; //非法启动      
	var ALERT_INVALIDDOOR = 0x300E; //非法开车门 

	// show_mode
	// 1: 车辆列表中
	// 2: 实时监控中
	// 3: 轨迹回放中
	function getStatusDesc(vehicle, show_mode) {
	    /*
	    离线，1--显示SIM卡号, 2--离线1个小时内小时显示“离线 <1小时“，超过1个小时，显示离线“离线 xx个小时”
	    在线，有效定位，速度超过10公里，显示：行驶，其他状态 xx公里/小时，速度低于等于10公里，显示：静止，其他状态
	    在线，无效定位，如果信号小于指定值，速度超过10公里，显示：盲区，速度低于等于10公里，显示：静止
	    */
	    var res = {
	        state: 0, //0停止，1行驶，2离线，3装卸，4断电
	        desc: '',
	        speed: 0,
	        delay: 0
	    };
	    var alerts = vehicle.active_gps_data.uni_alerts;
	    // 如果数据接收时间在10分钟以内，认为在线，否则为离线
	    var now = new Date();
	    var rcv_time = W.date(vehicle.active_gps_data.rcv_time);
	    res.delay = parseInt(Math.abs(now - rcv_time) / 1000 / 60); //把相差的毫秒数转换为分钟
	    if (show_mode == 3 || res.delay < 1440) {
	        if (alerts.indexOf(ALERT_CUTPOWER) > -1) {
	            res.desc = "断电";
	            res.state = 4;
	        } else if (alerts.indexOf(ALERT_SOS) > -1) {
	            res.desc = "装卸";
	            res.state = 3;
	        } else if (vehicle.active_gps_data.speed > 5) {
	            res.state = 1;
	            if (show_mode == 2) {
	                res.speed = vehicle.active_gps_data.speed.toFixed(0);
	                res.desc = "行驶 " + res.speed + "km/h";
	            } else {
	                res.desc = "行驶";
	            }
	        } else {
	            res.desc = "停止";
	        }
	    } else {
	        res.desc = "离线" + parseInt(res.delay / 60 / 24) + "天";
	        res.state = 2;
	    }
	    return res;
	}

	function getUniAlertsDesc(uni_alerts) {
	    var desc = "";
	    for (var i = 0; i < uni_alerts.length; i++) {
	        switch (uni_alerts[i]) {
	            case ALERT_SOS:
	                desc += ",装卸";break;
	            case ALERT_OVERSPEED:
	                desc += ",超速报警";break;
	            case ALERT_VIRBRATE:
	                desc += ",震动报警";break;
	            case ALERT_MOVE:
	                desc += ",位移报警";break;
	            case ALERT_ALARM:
	                desc += ",防盗器报警";break;
	            case ALERT_INVALIDRUN:
	                desc += ",非法行驶报警";break;
	            case ALERT_ENTERGEO:
	                desc += ",进围栏报警";break;
	            case ALERT_EXITGEO:
	                desc += ",出围栏报警";break;
	            case ALERT_CUTPOWER:
	                desc += ",断电报警";break;
	            case ALERT_LOWPOWER:
	                desc += ",低电压报警";break;
	            case ALERT_GPSCUT:
	                desc += ",GPS断线报警";break;
	            case ALERT_OVERDRIVE:
	                desc += ",疲劳驾驶报警";break;
	            case ALERT_INVALIDACC:
	                desc += ",非法点火报警";break;
	            case ALERT_INVALIDDOOR:
	                desc += ",非法开门报警";break;
	        }
	    }
	    return desc;
	}

/***/ },

/***/ 431:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Paper = __webpack_require__(240);

	var _Paper2 = _interopRequireDefault(_Paper);

	var _Tabs = __webpack_require__(432);

	var _create = __webpack_require__(437);

	var _create2 = _interopRequireDefault(_create);

	var _directionsCar = __webpack_require__(438);

	var _directionsCar2 = _interopRequireDefault(_directionsCar);

	var _close = __webpack_require__(439);

	var _close2 = _interopRequireDefault(_close);

	var _table = __webpack_require__(440);

	var _table2 = _interopRequireDefault(_table);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	// import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


	var styles = {
	    div: {
	        padding: '10px'
	    },
	    tab: {
	        height: '40px'
	    },
	    td: {
	        padding: '0 5px',
	        textAlign: 'center',
	        height: '40px'
	    },
	    icon: {
	        width: '20px',
	        height: '20px'
	    }
	};

	var xqd = [{
	    name: '兴趣点1',
	    remark: '备注1'
	}, {
	    name: '兴趣点2',
	    remark: '备注2'
	}, {
	    name: '兴趣点3',
	    remark: '备注3'
	}];

	var columnProps = {
	    style: styles.td
	};
	var rowProps = {
	    style: {
	        height: '40px'
	    }
	};
	var headerProps = {
	    displaySelectAll: false,
	    adjustForCheckbox: false
	};

	var MapManager = function (_Component) {
	    _inherits(MapManager, _Component);

	    function MapManager(props) {
	        _classCallCheck(this, MapManager);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapManager).call(this, props));

	        _this.state = {
	            value: 'a'
	        };
	        _this.handleChange = _this.handleChange.bind(_this);
	        return _this;
	    }

	    _createClass(MapManager, [{
	        key: 'handleChange',
	        value: function handleChange(value) {
	            this.setState({
	                value: value
	            });
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                _Paper2.default,
	                { zDepth: 2, style: this.props.style },
	                _react2.default.createElement(
	                    _Tabs.Tabs,
	                    {
	                        value: this.state.value,
	                        onChange: this.handleChange
	                    },
	                    _react2.default.createElement(
	                        _Tabs.Tab,
	                        { label: '兴趣点', value: 'a', style: styles.tab },
	                        _react2.default.createElement(
	                            'div',
	                            { style: styles.div },
	                            _react2.default.createElement(_table2.default, {
	                                data: xqd,
	                                keys: [{ name: '名称', key: 'name' }, { name: '备注', key: 'remark' }, { name: '操作' }],
	                                active: Active1,
	                                columnProps: columnProps,
	                                headerColumnProps: columnProps,
	                                rowProps: rowProps,
	                                headerProps: headerProps
	                            })
	                        )
	                    ),
	                    _react2.default.createElement(
	                        _Tabs.Tab,
	                        { label: '围栏', value: 'b', style: styles.tab },
	                        _react2.default.createElement(
	                            'div',
	                            { style: styles.div },
	                            _react2.default.createElement(_table2.default, {
	                                data: xqd,
	                                keys: [{ name: '名称', key: 'name' }, { name: '范围', key: 'remark' }, { name: '操作' }],
	                                active: Active1
	                            })
	                        )
	                    )
	                )
	            );
	        }
	    }]);

	    return MapManager;
	}(_react.Component);

	var Active1 = function (_Component2) {
	    _inherits(Active1, _Component2);

	    function Active1(props) {
	        _classCallCheck(this, Active1);

	        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(Active1).call(this, props));

	        _this2.clickCreate = _this2.clickCreate.bind(_this2);
	        _this2.delete = _this2.delete.bind(_this2);
	        return _this2;
	    }

	    _createClass(Active1, [{
	        key: 'clickCreate',
	        value: function clickCreate() {
	            alert('编辑名称为' + this.props.data.name);
	        }
	    }, {
	        key: 'delete',
	        value: function _delete() {
	            alert('删除名称为' + this.props.data.name);
	        }
	    }, {
	        key: 'render',
	        value: function render() {
	            return _react2.default.createElement(
	                'div',
	                null,
	                _react2.default.createElement(_create2.default, { onClick: this.clickCreate, style: styles.icon }),
	                _react2.default.createElement(_close2.default, { onClick: this.delete, style: styles.icon })
	            );
	        }
	    }]);

	    return Active1;
	}(_react.Component);

	exports.default = MapManager;

/***/ },

/***/ 437:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _pure = __webpack_require__(230);

	var _pure2 = _interopRequireDefault(_pure);

	var _SvgIcon = __webpack_require__(238);

	var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var ContentCreate = function ContentCreate(props) {
	  return _react2.default.createElement(_SvgIcon2.default, props, _react2.default.createElement('path', { d: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' }));
	};
	ContentCreate = (0, _pure2.default)(ContentCreate);
	ContentCreate.displayName = 'ContentCreate';
	ContentCreate.muiName = 'SvgIcon';

	exports.default = ContentCreate;

/***/ },

/***/ 438:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _pure = __webpack_require__(230);

	var _pure2 = _interopRequireDefault(_pure);

	var _SvgIcon = __webpack_require__(238);

	var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var MapsDirectionsCar = function MapsDirectionsCar(props) {
	  return _react2.default.createElement(_SvgIcon2.default, props, _react2.default.createElement('path', { d: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z' }));
	};
	MapsDirectionsCar = (0, _pure2.default)(MapsDirectionsCar);
	MapsDirectionsCar.displayName = 'MapsDirectionsCar';
	MapsDirectionsCar.muiName = 'SvgIcon';

	exports.default = MapsDirectionsCar;

/***/ },

/***/ 439:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _pure = __webpack_require__(230);

	var _pure2 = _interopRequireDefault(_pure);

	var _SvgIcon = __webpack_require__(238);

	var _SvgIcon2 = _interopRequireDefault(_SvgIcon);

	function _interopRequireDefault(obj) {
	  return obj && obj.__esModule ? obj : { default: obj };
	}

	var NavigationClose = function NavigationClose(props) {
	  return _react2.default.createElement(_SvgIcon2.default, props, _react2.default.createElement('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' }));
	};
	NavigationClose = (0, _pure2.default)(NavigationClose);
	NavigationClose.displayName = 'NavigationClose';
	NavigationClose.muiName = 'SvgIcon';

	exports.default = NavigationClose;

/***/ },

/***/ 440:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _Table = __webpack_require__(441);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var WTable = function (_Component) {
	    _inherits(WTable, _Component);

	    function WTable() {
	        _classCallCheck(this, WTable);

	        return _possibleConstructorReturn(this, Object.getPrototypeOf(WTable).apply(this, arguments));
	    }

	    _createClass(WTable, [{
	        key: 'render',
	        value: function render() {
	            var _this2 = this;

	            var keys = [];
	            var header = this.props.keys.map(function (ele) {
	                if (ele.key) keys.push(ele.key);
	                return ele.name;
	            });
	            var rows = this.props.data.map(function (ele, i) {
	                return _react2.default.createElement(Row, {
	                    keys: keys,
	                    data: ele,
	                    active: _this2.props.active,
	                    key: i,
	                    columnProps: _this2.props.columnProps,
	                    rowProps: _this2.props.rowProps
	                });
	            });
	            var hraders = header.map(function (ele, i) {
	                return _react2.default.createElement(
	                    _Table.TableHeaderColumn,
	                    _extends({}, _this2.props.headerColumnProps, { key: i }),
	                    ele
	                );
	            });
	            return _react2.default.createElement(
	                _Table.Table,
	                this.props.tableProps,
	                _react2.default.createElement(
	                    _Table.TableHeader,
	                    _extends({ displaySelectAll: false, adjustForCheckbox: false }, this.props.headerProps),
	                    _react2.default.createElement(
	                        _Table.TableRow,
	                        this.props.rowProps,
	                        hraders
	                    )
	                ),
	                _react2.default.createElement(
	                    _Table.TableBody,
	                    null,
	                    rows
	                )
	            );
	        }
	    }]);

	    return WTable;
	}(_react.Component);

	var Row = function (_Component2) {
	    _inherits(Row, _Component2);

	    function Row() {
	        _classCallCheck(this, Row);

	        return _possibleConstructorReturn(this, Object.getPrototypeOf(Row).apply(this, arguments));
	    }

	    _createClass(Row, [{
	        key: 'render',
	        value: function render() {
	            var columns = void 0;
	            if (this.props.isArray) columns = this.props.data.map(function (ele, index, arr) {
	                return _react2.default.createElement(
	                    _Table.TableRowColumn,
	                    _extends({}, this.props.columnProps, { key: index }),
	                    ele
	                );
	            }, this);else columns = this.props.keys.map(function (key, index, arr) {
	                return _react2.default.createElement(
	                    _Table.TableRowColumn,
	                    _extends({}, this.props.columnProps, { key: index }),
	                    this.props.data[key]
	                );
	            }, this);
	            if (this.props.active) {
	                var Active = this.props.active;
	                columns.push(_react2.default.createElement(
	                    _Table.TableRowColumn,
	                    _extends({}, this.props.columnProps, { key: columns.length }),
	                    _react2.default.createElement(Active, { data: this.props.data })
	                ));
	            }
	            return _react2.default.createElement(
	                _Table.TableRow,
	                this.props.rowProps,
	                columns
	            );
	        }
	    }]);

	    return Row;
	}(_react.Component);

	exports.default = WTable;

/***/ },

/***/ 450:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(451);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(453)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js?sourceMap!./monitor.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js?sourceMap!./monitor.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 451:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(452)();
	// imports


	// module
	exports.push([module.id, ".container {\n  display: flex;\n  text-align: center;\n  padding-left: 256px;\n  padding-top: 50px;\n  height: 100vh;\n  box-sizing: border-box; }\n\n#monitor_map {\n  width: 100%; }\n\n.appbar {\n  position: fixed !important;\n  top: 0 !important;\n  width: 100% !important; }\n", ""]);

	// exports


/***/ },

/***/ 452:
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ },

/***/ 453:
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }

});