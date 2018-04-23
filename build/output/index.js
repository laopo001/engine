/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PcComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__component__ = __webpack_require__(2);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var PcComponent = /** @class */ (function (_super) {
    __extends(PcComponent, _super);
    function PcComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PcComponent.prototype.isPcComponent = function () {
        return true;
    };
    PcComponent.addComponent = function (entity, node) {
        var keys = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            keys[_i - 2] = arguments[_i];
        }
        keys.push('children');
        var obj = {};
        for (var key in node.props) {
            !keys.includes(key) && (obj[key] = node.props[key]);
        }
        return entity.addComponent(node.type, obj);
    };
    PcComponent.asyncAssetsSet = function (entity, node) {
        var keys = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            keys[_i - 2] = arguments[_i];
        }
        keys.forEach(function (key) {
            var res = node.props[key];
            if (res) {
                if (res instanceof Promise) {
                    res.then(function (asset) {
                        entity[node.type][key] = asset.resource;
                    });
                }
                else {
                    entity[node.type][key] = res.resource;
                }
            }
        });
        // props[] && props.colorMap.then((asset) => {
        //     entity.particlesystem.colorMap = asset.resource;
        // })
    };
    Object.defineProperty(PcComponent, "basename", {
        get: function () {
            return this.name.toLowerCase();
        },
        enumerable: true,
        configurable: true
    });
    return PcComponent;
}(__WEBPACK_IMPORTED_MODULE_0__component__["a" /* Component */]));



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return updateQuene; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Application; });
/* harmony export (immutable) */ __webpack_exports__["a"] = getApplicationInstance;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__component__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(3);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var application;
var updateQuene = [];
var Application = /** @class */ (function (_super) {
    __extends(Application, _super);
    function Application(props, context, innerContext) {
        var _this = _super.call(this, props, context, innerContext) || this;
        innerContext.canvas.focus();
        var app = new pc.Application(innerContext.canvas, {
            mouse: innerContext.mouse,
            keyboard: innerContext.keyboard
        });
        application = app;
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);
        app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);
        app.start();
        app.on('update', function (dt) { updateQuene.forEach(function (cb) { cb(dt); }); });
        innerContext.app = app;
        _this.props.gravity && app.systems.rigidbody.setGravity(_this.props.gravity);
        _this.pc = app;
        _this.pc[__WEBPACK_IMPORTED_MODULE_1__config__["a" /* KEY */]] = _this;
        return _this;
        // console.log('application init',this);
    }
    Application.prototype.render = function () {
        return this.props.children;
    };
    Application.basename = 'application';
    return Application;
}(__WEBPACK_IMPORTED_MODULE_0__component__["a" /* Component */]));

function getApplicationInstance() {
    return application;
}
;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Component; });
var Component = /** @class */ (function () {
    // parent: null | Component;
    // children: Component[] = [];
    // parent: BABYLON.TransformNode;
    function Component(props, context, innerContext) {
        this.context = context;
        this.innerContext = innerContext;
        this.props = props;
    }
    return Component;
}());



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KEY; });
var KEY = '__hpc__';


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application_tag__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__script_commponent__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__entity_tag__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__h__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__render__ = __webpack_require__(24);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_4__render__["a"]; });
/* unused harmony reexport h */
/* unused harmony reexport Application */
/* unused harmony reexport Entity */
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__script_commponent__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__util__ = __webpack_require__(11);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_5__util__["b"]; });
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_5__util__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components__ = __webpack_require__(5);
/* unused harmony namespace reexport */



// import { loadAssetsFromUrl, createMaterial, randomRange, randomEnum, once } from './util';


var hpc = {
    h: __WEBPACK_IMPORTED_MODULE_3__h__["a" /* h */]
};
window['hpc'] = hpc;

/* harmony default export */ __webpack_exports__["a"] = (hpc);




/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camera_camera__ = __webpack_require__(17);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Camera", function() { return __WEBPACK_IMPORTED_MODULE_0__camera_camera__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pc_component__ = __webpack_require__(0);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "PcComponent", function() { return __WEBPACK_IMPORTED_MODULE_1__pc_component__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_model__ = __webpack_require__(20);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Model", function() { return __WEBPACK_IMPORTED_MODULE_2__model_model__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__light_light__ = __webpack_require__(19);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Light", function() { return __WEBPACK_IMPORTED_MODULE_3__light_light__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__particlesystem_particlesystem__ = __webpack_require__(21);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ParticleSystem", function() { return __WEBPACK_IMPORTED_MODULE_4__particlesystem_particlesystem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__rigidbody_rigidbody__ = __webpack_require__(22);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "RigidBody", function() { return __WEBPACK_IMPORTED_MODULE_5__rigidbody_rigidbody__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__collision_collision__ = __webpack_require__(18);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Collision", function() { return __WEBPACK_IMPORTED_MODULE_6__collision_collision__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__audio_index__ = __webpack_require__(15);
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Sound", function() { return __WEBPACK_IMPORTED_MODULE_7__audio_index__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "AudioListen", function() { return __WEBPACK_IMPORTED_MODULE_7__audio_index__["b"]; });










/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Entity; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__component__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__string_component__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__application_tag__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config__ = __webpack_require__(3);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




function getPcParent(parent) {
    while (parent) {
        if (parent instanceof Entity) {
            return parent.pc;
        }
        else {
            parent = parent.parent;
        }
    }
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__application_tag__["a" /* getApplicationInstance */])().root;
}
var Entity = /** @class */ (function (_super) {
    __extends(Entity, _super);
    function Entity(props, context, innerContext, parent) {
        var _this = _super.call(this, props, context, innerContext) || this;
        parent = getPcParent(parent);
        var entity = new pc.Entity();
        entity.name = props.name;
        props.tag && props.tag.split(' ').filter(function (x) { return x !== ''; }).forEach(function (x) {
            entity.tags.add(x);
        });
        _this.props.position && entity.setLocalPosition(_this.props.position);
        _this.props.rotation && entity.rotateLocal(_this.props.rotation);
        _this.props.scale && entity.setLocalScale(_this.props.scale);
        var children = props.children;
        var renderChildren = [];
        for (var i = 0; i < children.length; i++) {
            var node = children[i];
            if (node == null) {
                continue;
            }
            if (node.type === Entity.basename || node.type.isHpcComponent) {
                renderChildren.push(node);
                continue;
            }
            if (typeof node.type !== 'string') {
                node.type = node.type.basename;
            }
            // if(node.type==='light'){debugger;delete node.props.children}
            // entity.addComponent(node.type, node.props);
            __WEBPACK_IMPORTED_MODULE_1__string_component__["b" /* stringToComponent */][node.type].addComponent(entity, node);
        }
        if (renderChildren.length > 0) {
            // parent.addChild(entity);
            _this.render = function () { return renderChildren; };
        }
        // if (parent) {
        //     parent.pc.addChild(entity);
        // } else {
        //     innerContext.app.root.addChild(entity);
        // }
        parent.addChild(entity);
        _this.pc = entity;
        _this.pc[__WEBPACK_IMPORTED_MODULE_3__config__["a" /* KEY */]] = _this;
        return _this;
    }
    Entity.basename = 'entity';
    return Entity;
}(__WEBPACK_IMPORTED_MODULE_0__component__["a" /* Component */]));



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Node; });
var Node = /** @class */ (function () {
    function Node(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
        this.props = this.props == null ? {} : this.props;
        this.props.children = children;
    }
    return Node;
}());



/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = run;
/* harmony export (immutable) */ __webpack_exports__["a"] = runChildren;
/* unused harmony export addScriptComponent */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__string_component__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__application_tag__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__script_commponent__ = __webpack_require__(9);




var stringToComponent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__string_component__["a" /* getAllStringToComponent */])();
var i = 0;
function run(node, innerContext, context, parent, cb) {
    if (node instanceof __WEBPACK_IMPORTED_MODULE_0__node__["a" /* Node */]) {
        var Ctor = node.type;
        if (typeof Ctor === 'string') {
            Ctor = stringToComponent[Ctor];
        }
        var props = Object.assign({}, Ctor.defaultProps, node.props);
        var c;
        c = new Ctor(props, context, innerContext, parent);
        props.ref && props.ref(c);
        var children = void 0;
        if (c instanceof __WEBPACK_IMPORTED_MODULE_3__script_commponent__["a" /* HpcComponent */]) {
            c.initialize();
            if (props.ref) {
                props.ref(c);
            }
            var node_1 = c.render();
            if (Array.isArray(node_1)) {
                children = runChildren(node_1, innerContext, context, parent);
            }
            else {
                children = runChildren([node_1], innerContext, context, parent);
            }
            c._children = children;
            c.componentLoaded();
            __WEBPACK_IMPORTED_MODULE_2__application_tag__["b" /* updateQuene */].push(c.update.bind(c));
        }
        else {
            children = runChildren(c.render && c.render(), innerContext, context, c);
            c.children = children;
        }
        return c;
    }
    else {
        console.error('e');
    }
}
;
function runChildren(nodes, innerContext, context, parent, isAppend) {
    if (isAppend === void 0) { isAppend = false; }
    if (nodes == null) {
        return;
    }
    ;
    var arr = [];
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var c = run(node, innerContext, context, parent);
        c.parent = parent;
        arr.push(c);
        if (isAppend) {
            parent.children.push(c);
        }
    }
    return arr;
}
;
function addScriptComponent(entity, name, init, update) {
    var script = pc.createScript(name);
    script.prototype.initialize = function () {
        init();
    };
    script.prototype.update = function (dt) {
        update(dt);
    };
    entity.addComponent('script');
    entity.script.create(name);
}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HpcComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application_tag__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__component__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__run__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__util__ = __webpack_require__(11);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




var HpcComponent = /** @class */ (function (_super) {
    __extends(HpcComponent, _super);
    function HpcComponent(props, context, innerContext) {
        var _this = _super.call(this, props, context, innerContext) || this;
        _this._children = [];
        _this.app = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__application_tag__["a" /* getApplicationInstance */])();
        return _this;
    }
    HpcComponent.prototype.next = function (cb) {
    };
    HpcComponent.prototype.append = function (parent) {
        var children = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            children[_i - 1] = arguments[_i];
        }
        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__run__["a" /* runChildren */])(children, this.innerContext, this.context, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__util__["a" /* getHpc */])(parent), true);
        // res.forEach((x) => {
        //     parent.addChild(x.pc);
        // })
    };
    Object.defineProperty(HpcComponent.prototype, "children", {
        get: function () {
            if (this._children.length === 0) {
                return null;
            }
            else if (this._children.length === 1) {
                return this._children[0];
            }
            else if (this._children.length > 1) {
                return this._children;
            }
        },
        enumerable: true,
        configurable: true
    });
    HpcComponent.prototype.initialize = function () { };
    ;
    HpcComponent.prototype.componentLoaded = function () { };
    ;
    HpcComponent.prototype.applicationLoaded = function () { };
    ;
    HpcComponent.prototype.update = function (dt) { };
    ;
    HpcComponent.isHpcComponent = true;
    return HpcComponent;
}(__WEBPACK_IMPORTED_MODULE_1__component__["a" /* Component */]));



/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getAllStringToComponent;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return stringToComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application_tag__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__entity_tag__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components__ = __webpack_require__(5);



var stringToComponent = {};
for (var x in __WEBPACK_IMPORTED_MODULE_2__components__) {
    stringToComponent[__WEBPACK_IMPORTED_MODULE_2__components__[x].basename] = __WEBPACK_IMPORTED_MODULE_2__components__[x];
}
function getAllStringToComponent() {
    stringToComponent[__WEBPACK_IMPORTED_MODULE_0__application_tag__["c" /* Application */].basename] = __WEBPACK_IMPORTED_MODULE_0__application_tag__["c" /* Application */];
    stringToComponent[__WEBPACK_IMPORTED_MODULE_1__entity_tag__["a" /* Entity */].basename] = __WEBPACK_IMPORTED_MODULE_1__entity_tag__["a" /* Entity */];
    return stringToComponent;
}



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export loadAssetsFromUrl */
/* harmony export (immutable) */ __webpack_exports__["b"] = createMaterial;
/* unused harmony export addUpdateListen */
/* harmony export (immutable) */ __webpack_exports__["c"] = randomRange;
/* unused harmony export randomEnum */
/* unused harmony export once */
/* unused harmony export onceTime */
/* unused harmony export getVertexArr */
/* harmony export (immutable) */ __webpack_exports__["a"] = getHpc;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__application_tag__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__(3);



function loadAssetsFromUrl(url, type) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__application_tag__["a" /* getApplicationInstance */])().assets.loadFromUrl(url, type, function (err, asset) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(asset);
                }
            });
        });
    });
}
function createMaterial(colors) {
    var material = new pc.StandardMaterial();
    for (var param in colors) {
        material[param] = colors[param];
    }
    material.update();
    return material;
}
function addUpdateListen(cb) {
    __WEBPACK_IMPORTED_MODULE_0__application_tag__["b" /* updateQuene */].push(cb);
}
function randomRange(a, b) {
    var min = a, max = b;
    if (a > b) {
        max = a;
        min = b;
    }
    var subtraction = max - min;
    return min + subtraction * Math.random();
}
function randomEnum() {
    var arg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arg[_i] = arguments[_i];
    }
    var len = arg.length;
    var random = Math.random() * len;
    for (var i = 0; i < len; i++) {
        if (random >= i && random < i + 1) {
            return arg[i];
        }
    }
}
function once(target, key, descriptor) {
    var oldValue = descriptor.value;
    var cout = 0;
    var newValue = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var res;
        if (cout === 0) {
            res = oldValue.apply(this, args);
        }
        cout++;
        return res;
    };
    descriptor.value = newValue;
}
function onceTime(time) {
    return function (target, key, descriptor) {
        var oldValue = descriptor.value;
        var cout = 0;
        var newValue = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var res;
            if (cout === 0) {
                res = oldValue.apply(this, args);
            }
            setTimeout(function () { cout = 0; }, time);
            cout++;
            return res;
        };
        descriptor.value = newValue;
    };
}
function getVertexArr(mesh) {
    var buffer = mesh.vertexBuffer;
    var iterator = new pc.VertexIterator(buffer);
    var arr = [];
    // Iterate though all verticles 
    for (var i = 0; i < buffer.getNumVertices(); i++) {
        // Current vertex's position
        var posSem = iterator.element[pc.SEMANTIC_POSITION];
        // Get position
        var posX = posSem.array[posSem.index];
        var posY = posSem.array[posSem.index + 1];
        var posZ = posSem.array[posSem.index + 2];
        arr.push({ x: posX, y: posY, z: posZ });
        // Move to the next vertex
        iterator.next();
    }
    iterator.end();
    return arr;
}
function getHpc(pc) {
    return pc[__WEBPACK_IMPORTED_MODULE_1__config__["a" /* KEY */]];
}


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoadingScene; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__package_index__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_whatwg_fetch__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_whatwg_fetch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_whatwg_fetch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tweenjs_tween_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tweenjs_tween_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__tweenjs_tween_js__);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * @author dadigua
 */



var material = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__package_index__["d" /* createMaterial */])({
    diffuse: new pc.Color(.3, .9, .3)
});
function formatThreeJsonVertices(json) {
    if (json.data !== undefined) {
        json = json.data;
    }
    if (json.scale !== undefined) {
        json.scale = 1.0 / json.scale;
    }
    else {
        json.scale = 10.0;
    }
    var scale = json.scale;
    var vertices = json.vertices, offset = 0;
    var zLength = vertices.length;
    var positions = [];
    var i = 0;
    while (offset < zLength) {
        var vertex = { x: 0, y: 0, z: 0 };
        vertex.x = vertices[offset++] * scale;
        vertex.y = vertices[offset++] * scale;
        vertex.z = vertices[offset++] * scale;
        i++;
        if (i % 2 !== 0) {
            continue;
        }
        positions.push(vertex);
    }
    return positions;
}
// pc.calculateNormals()
function animate(time) {
    requestAnimationFrame(animate);
    __WEBPACK_IMPORTED_MODULE_2__tweenjs_tween_js__["update"](time);
}
requestAnimationFrame(animate);
// let assets = loadAssetsFromUrl<pc.Asset>('./assets/models/statue/Statue_1.json', 'model')
var LoadingScene = /** @class */ (function (_super) {
    __extends(LoadingScene, _super);
    function LoadingScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tweenArr = [];
        return _this;
    }
    LoadingScene.prototype.componentLoaded = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var modelVertices, modelVertices2, modelVertices3, modelVertices4, modelVertices5, modelVertices6, arr, maxCount, index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loadingScene = this.app.root.findByName('loadingScene');
                        return [4 /*yield*/, fetch('./assets/models/cpac5.json').then(function (rssponse) { return rssponse.json(); }).then(function (res) { return formatThreeJsonVertices(res); })];
                    case 1:
                        modelVertices = _a.sent();
                        return [4 /*yield*/, fetch('./assets/models/cpbook2.json').then(function (rssponse) { return rssponse.json(); }).then(function (res) { return formatThreeJsonVertices(res); })];
                    case 2:
                        modelVertices2 = _a.sent();
                        return [4 /*yield*/, fetch('./assets/models/cpgame3.json').then(function (rssponse) { return rssponse.json(); }).then(function (res) { return formatThreeJsonVertices(res); })];
                    case 3:
                        modelVertices3 = _a.sent();
                        return [4 /*yield*/, fetch('./assets/models/cpkv3.json').then(function (rssponse) { return rssponse.json(); }).then(function (res) { return formatThreeJsonVertices(res); })];
                    case 4:
                        modelVertices4 = _a.sent();
                        return [4 /*yield*/, fetch('./assets/models/cpmovie4.json').then(function (rssponse) { return rssponse.json(); }).then(function (res) { return formatThreeJsonVertices(res); })];
                    case 5:
                        modelVertices5 = _a.sent();
                        return [4 /*yield*/, fetch('./assets/models/qr.json').then(function (rssponse) { return rssponse.json(); }).then(function (res) { return formatThreeJsonVertices(res); })
                            // let maxCount = Math.max(modelVertices.length, modelVertices2.length, modelVertices3.length, modelVertices4.length, modelVertices5.length, modelVertices6.length)
                            // let a = this.app.root.findByName('A') as pc.Entity;
                            // let { x, y, z } = a.getLocalPosition();
                            // let position = { x, y, z };
                            // // a.setLocalPosition(new pc.Vec3(0, 1, 0));
                            // new TWEEN.Tween(position)
                            // .to({ x: 10, y: 10, z: 10 }, 2000)
                            // .easing(TWEEN.Easing.Exponential.InOut)
                            // .onUpdate(function () { // Called after tween.js updates 'coords'.
                            //     // Move 'box' to the position described by 'coords' with a CSS translation.
                            //     a.setLocalPosition(position.x, position.y, position.z)
                            // })
                            // .start();
                        ];
                    case 6:
                        modelVertices6 = _a.sent();
                        arr = [modelVertices, modelVertices3, modelVertices6];
                        maxCount = Math.max.apply(Math, arr.map(function (x) { return x.length; }));
                        // console.log(modelVertices);
                        this.generate(maxCount);
                        index = 0;
                        setInterval(function () {
                            console.log(index % 3);
                            _this.transform(arr[index % 3], 2000);
                            index++;
                        }, 5000);
                        return [2 /*return*/];
                }
            });
        });
    };
    LoadingScene.prototype.generate = function (maxCount) {
        var temp = [];
        for (var i = 0; i < maxCount; i++) {
            var position = new pc.Vec3(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__package_index__["e" /* randomRange */])(-10, 10), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__package_index__["e" /* randomRange */])(-10, 10), __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__package_index__["e" /* randomRange */])(-10, 10));
            temp.push(__WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h("entity", { position: position, scale: new pc.Vec3(.1, .1, .1) },
                __WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h("model", { type: 'sphere', material: material })));
            this.tweenArr.push(new __WEBPACK_IMPORTED_MODULE_2__tweenjs_tween_js__["Tween"](position).easing(__WEBPACK_IMPORTED_MODULE_2__tweenjs_tween_js__["Easing"].Exponential.InOut));
        }
        var res = this.append(this.loadingScene, __WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h("entity", { scale: new pc.Vec3(1, 1, 1) }, temp))[0].pc.children;
        this.vertices = res;
    };
    LoadingScene.prototype.transform = function (targets, duration) {
        __WEBPACK_IMPORTED_MODULE_2__tweenjs_tween_js__["removeAll"]();
        for (var i = 0; i < this.vertices.length; i++) {
            var object = this.vertices[i];
            object.enabled = true;
            var target = targets[i];
            if (!target) {
                object.enabled = false;
                continue;
            }
            // object.setLocalPosition(target.x, target.y, target.z)
            this.move(target, object, duration, i);
        }
    };
    LoadingScene.prototype.move = function (target, object, duration, index) {
        // let { x, y, z } = object.getLocalPosition();
        // let position = { x, y, z };
        this.tweenArr[index].to({ x: target.x, y: target.y, z: target.z }, Math.random() * duration + duration)
            .onUpdate(function (position) {
            // Move 'box' to the position described by 'coords' with a CSS translation.
            // console.log(arguments)
            object.setLocalPosition(position.x, position.y, position.z);
        })
            .start();
        // let t = new TWEEN.Tween(position)
        //     .to({ x: target.x, y: target.y, z: target.z }, Math.random() * duration + duration)
        //     .easing(TWEEN.Easing.Exponential.InOut)
        //     .onUpdate(function () { // Called after tween.js updates 'coords'.
        //         // Move 'box' to the position described by 'coords' with a CSS translation.
        //         object.setLocalPosition(position.x, position.y, position.z)
        //     })
        //     .start();0
    };
    LoadingScene.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h("entity", { name: 'loadingScene' },
            __WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h("entity", { name: 'camera', position: new pc.Vec3(0, 0, 50), rotation: new pc.Vec3(0, 0, 0) },
                __WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h("camera", null)));
    };
    return LoadingScene;
}(__WEBPACK_IMPORTED_MODULE_0__package_index__["b" /* HpcComponent */]));



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__package_index__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__loading_scene__ = __webpack_require__(12);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
/**
 * @author dadigua
 */


var canvas = document.getElementById("root");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    App.prototype.render = function () {
        return __WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h("application", { gravity: new pc.Vec3(0, -9.8, 0) },
            __WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h(__WEBPACK_IMPORTED_MODULE_1__loading_scene__["a" /* LoadingScene */], null),
            __WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h("entity", __assign({}, { rotation: new pc.Vec3(0, 0, 10) }),
                __WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h("light", __assign({}, {
                    type: "directional",
                    color: new pc.Color(1, 1, 1),
                    castShadows: true,
                    intensity: 1,
                    shadowBias: 0.2,
                    normalOffsetBias: 0.2,
                    shadowResolution: 1024,
                    shadowDistance: 16,
                    shadowType: pc.SHADOW_PCF3
                }))));
    };
    return App;
}(__WEBPACK_IMPORTED_MODULE_0__package_index__["b" /* HpcComponent */]));
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__package_index__["c" /* render */])(__WEBPACK_IMPORTED_MODULE_0__package_index__["a" /* default */].h(App, null), canvas, { debugger: true });


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AudioListen; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pc_component__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var AudioListen = /** @class */ (function (_super) {
    __extends(AudioListen, _super);
    function AudioListen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AudioListen;
}(__WEBPACK_IMPORTED_MODULE_0__pc_component__["a" /* PcComponent */]));



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sound__ = __webpack_require__(16);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__sound__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__audiolisten__ = __webpack_require__(14);
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__audiolisten__["a"]; });




/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Sound; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pc_component__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Sound = /** @class */ (function (_super) {
    __extends(Sound, _super);
    function Sound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Sound.addComponent = function (entity, node) {
        var component = _super.addComponent.call(this, entity, node);
        // entity.addComponent('sound');
        // add footsteps slot
        if (node.props.asset) {
            if (node.props.asset instanceof Promise) {
                node.props.asset.then(function (asset) {
                    entity.sound.addSlot('footsteps', {
                        asset: asset.resource,
                        pitch: 1.7,
                        loop: true,
                        autoPlay: true
                    });
                });
            }
            else {
                entity.sound.addSlot('footsteps', {
                    asset: node.props.asset.resource,
                    pitch: 1.7,
                    loop: true,
                    autoPlay: true
                });
            }
        }
        return component;
    };
    return Sound;
}(__WEBPACK_IMPORTED_MODULE_0__pc_component__["a" /* PcComponent */]));



/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Camera; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pc_component__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Camera;
}(__WEBPACK_IMPORTED_MODULE_0__pc_component__["a" /* PcComponent */]));



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Collision; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pc_component__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Collision = /** @class */ (function (_super) {
    __extends(Collision, _super);
    function Collision() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Collision.addComponent = function (entity, node) {
        var component = _super.addComponent.call(this, entity, node);
        var arr = ['collisionstart', 'collisionend', 'contact', 'triggerenter', 'triggerleave'];
        arr.forEach(function (key) {
            node.props[key] && component.on(key, function (arg) {
                node.props[key](arg, entity);
            }, entity);
        });
        return component;
    };
    return Collision;
}(__WEBPACK_IMPORTED_MODULE_0__pc_component__["a" /* PcComponent */]));



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Light; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pc_component__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Light = /** @class */ (function (_super) {
    __extends(Light, _super);
    function Light() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Light;
}(__WEBPACK_IMPORTED_MODULE_0__pc_component__["a" /* PcComponent */]));



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Model; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pc_component__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var Model = /** @class */ (function (_super) {
    __extends(Model, _super);
    function Model() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Model.addComponent = function (entity, node) {
        var component;
        if (node.props.type === 'model') {
            component = _super.addComponent.call(this, entity, node, 'model', 'type');
        }
        else {
            component = _super.addComponent.call(this, entity, node);
        }
        _super.asyncAssetsSet.call(this, entity, node, 'model');
        if (node.props.material) {
            if (node.props.material instanceof Promise) {
                node.props.material.then(function (res) {
                    entity.model.model.meshInstances.forEach(function (mesh) {
                        mesh.material = res;
                    });
                });
            }
            else {
                node.props.material && entity.model.model.meshInstances.forEach(function (mesh) {
                    mesh.material = node.props.material;
                });
            }
        }
        return component;
    };
    return Model;
}(__WEBPACK_IMPORTED_MODULE_0__pc_component__["a" /* PcComponent */]));



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ParticleSystem; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pc_component__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var ParticleSystem = /** @class */ (function (_super) {
    __extends(ParticleSystem, _super);
    function ParticleSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParticleSystem.addComponent = function (entity, node) {
        var component = _super.addComponent.call(this, entity, node, 'colorMap', 'normalMap');
        // props.colorMap && props.colorMap.then((asset) => {
        //     entity.particlesystem.colorMap = asset.resource;
        // })
        _super.asyncAssetsSet.call(this, entity, node, 'colorMap', 'normalMap');
        return component;
    };
    return ParticleSystem;
}(__WEBPACK_IMPORTED_MODULE_0__pc_component__["a" /* PcComponent */]));



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RigidBody; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pc_component__ = __webpack_require__(0);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var RigidBody = /** @class */ (function (_super) {
    __extends(RigidBody, _super);
    function RigidBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RigidBody;
}(__WEBPACK_IMPORTED_MODULE_0__pc_component__["a" /* PcComponent */]));



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = h;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node__ = __webpack_require__(7);

function h(type, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var newChildren = [];
    for (var i = 0; i < children.length; i++) {
        var item = children[i];
        if (typeof item === 'boolean') {
            newChildren.push(null);
        }
        else if (Array.isArray(item)) {
            addChild(newChildren, item);
        }
        else {
            newChildren.push(item);
        }
    }
    return new __WEBPACK_IMPORTED_MODULE_0__node__["a" /* Node */](type, props, newChildren);
}
function addChild(newChildren, item) {
    var x;
    while (item.length !== 0) {
        x = item.pop();
        if (Array.isArray(x)) {
            addChild(newChildren, x);
        }
        else {
            newChildren.push(x);
        }
    }
}


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = render;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__run__ = __webpack_require__(8);

function render(root, canvas, options) {
    // var app = new pc.Application(canvas, {
    //     mouse: new pc.Mouse(canvas),
    //     keyboard: new pc.Keyboard(window)
    // });
    // app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    // app.setCanvasResolution(pc.RESOLUTION_AUTO);
    // app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);
    var app = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__run__["b" /* run */])(root, {
        mouse: new pc.Mouse(canvas),
        keyboard: new pc.Keyboard(window),
        canvas: canvas,
        app: null
    }, {}, null);
    console.log('application init');
}
;


/***/ }),
/* 25 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */


var _Group = function () {
	this._tweens = {};
	this._tweensAddedDuringUpdate = {};
};

_Group.prototype = {
	getAll: function () {

		return Object.keys(this._tweens).map(function (tweenId) {
			return this._tweens[tweenId];
		}.bind(this));

	},

	removeAll: function () {

		this._tweens = {};

	},

	add: function (tween) {

		this._tweens[tween.getId()] = tween;
		this._tweensAddedDuringUpdate[tween.getId()] = tween;

	},

	remove: function (tween) {

		delete this._tweens[tween.getId()];
		delete this._tweensAddedDuringUpdate[tween.getId()];

	},

	update: function (time, preserve) {

		var tweenIds = Object.keys(this._tweens);

		if (tweenIds.length === 0) {
			return false;
		}

		time = time !== undefined ? time : TWEEN.now();

		// Tweens are updated in "batches". If you add a new tween during an update, then the
		// new tween will be updated in the next batch.
		// If you remove a tween during an update, it may or may not be updated. However,
		// if the removed tween was added during the current batch, then it will not be updated.
		while (tweenIds.length > 0) {
			this._tweensAddedDuringUpdate = {};

			for (var i = 0; i < tweenIds.length; i++) {

				var tween = this._tweens[tweenIds[i]];

				if (tween && tween.update(time) === false) {
					tween._isPlaying = false;

					if (!preserve) {
						delete this._tweens[tweenIds[i]];
					}
				}
			}

			tweenIds = Object.keys(this._tweensAddedDuringUpdate);
		}

		return true;

	}
};

var TWEEN = new _Group();

TWEEN.Group = _Group;
TWEEN._nextId = 0;
TWEEN.nextId = function () {
	return TWEEN._nextId++;
};


// Include a performance.now polyfill.
// In node.js, use process.hrtime.
if (typeof (window) === 'undefined' && typeof (process) !== 'undefined') {
	TWEEN.now = function () {
		var time = process.hrtime();

		// Convert [seconds, nanoseconds] to milliseconds.
		return time[0] * 1000 + time[1] / 1000000;
	};
}
// In a browser, use window.performance.now if it is available.
else if (typeof (window) !== 'undefined' &&
         window.performance !== undefined &&
		 window.performance.now !== undefined) {
	// This must be bound, because directly assigning this function
	// leads to an invocation exception in Chrome.
	TWEEN.now = window.performance.now.bind(window.performance);
}
// Use Date.now if it is available.
else if (Date.now !== undefined) {
	TWEEN.now = Date.now;
}
// Otherwise, use 'new Date().getTime()'.
else {
	TWEEN.now = function () {
		return new Date().getTime();
	};
}


TWEEN.Tween = function (object, group) {
	this._object = object;
	this._valuesStart = {};
	this._valuesEnd = {};
	this._valuesStartRepeat = {};
	this._duration = 1000;
	this._repeat = 0;
	this._repeatDelayTime = undefined;
	this._yoyo = false;
	this._isPlaying = false;
	this._reversed = false;
	this._delayTime = 0;
	this._startTime = null;
	this._easingFunction = TWEEN.Easing.Linear.None;
	this._interpolationFunction = TWEEN.Interpolation.Linear;
	this._chainedTweens = [];
	this._onStartCallback = null;
	this._onStartCallbackFired = false;
	this._onUpdateCallback = null;
	this._onCompleteCallback = null;
	this._onStopCallback = null;
	this._group = group || TWEEN;
	this._id = TWEEN.nextId();

};

TWEEN.Tween.prototype = {
	getId: function getId() {
		return this._id;
	},

	isPlaying: function isPlaying() {
		return this._isPlaying;
	},

	to: function to(properties, duration) {

		this._valuesEnd = properties;

		if (duration !== undefined) {
			this._duration = duration;
		}

		return this;

	},

	start: function start(time) {

		this._group.add(this);

		this._isPlaying = true;

		this._onStartCallbackFired = false;

		this._startTime = time !== undefined ? typeof time === 'string' ? TWEEN.now() + parseFloat(time) : time : TWEEN.now();
		this._startTime += this._delayTime;

		for (var property in this._valuesEnd) {

			// Check if an Array was provided as property value
			if (this._valuesEnd[property] instanceof Array) {

				if (this._valuesEnd[property].length === 0) {
					continue;
				}

				// Create a local copy of the Array with the start value at the front
				this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);

			}

			// If `to()` specifies a property that doesn't exist in the source object,
			// we should not set that property in the object
			if (this._object[property] === undefined) {
				continue;
			}

			// Save the starting value.
			this._valuesStart[property] = this._object[property];

			if ((this._valuesStart[property] instanceof Array) === false) {
				this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
			}

			this._valuesStartRepeat[property] = this._valuesStart[property] || 0;

		}

		return this;

	},

	stop: function stop() {

		if (!this._isPlaying) {
			return this;
		}

		this._group.remove(this);
		this._isPlaying = false;

		if (this._onStopCallback !== null) {
			this._onStopCallback(this._object);
		}

		this.stopChainedTweens();
		return this;

	},

	end: function end() {

		this.update(this._startTime + this._duration);
		return this;

	},

	stopChainedTweens: function stopChainedTweens() {

		for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
			this._chainedTweens[i].stop();
		}

	},

	group: function group(group) {
		this._group = group;
		return this;
	},

	delay: function delay(amount) {

		this._delayTime = amount;
		return this;

	},

	repeat: function repeat(times) {

		this._repeat = times;
		return this;

	},

	repeatDelay: function repeatDelay(amount) {

		this._repeatDelayTime = amount;
		return this;

	},

	yoyo: function yoyo(yy) {

		this._yoyo = yy;
		return this;

	},

	easing: function easing(eas) {

		this._easingFunction = eas;
		return this;

	},

	interpolation: function interpolation(inter) {

		this._interpolationFunction = inter;
		return this;

	},

	chain: function chain() {

		this._chainedTweens = arguments;
		return this;

	},

	onStart: function onStart(callback) {

		this._onStartCallback = callback;
		return this;

	},

	onUpdate: function onUpdate(callback) {

		this._onUpdateCallback = callback;
		return this;

	},

	onComplete: function onComplete(callback) {

		this._onCompleteCallback = callback;
		return this;

	},

	onStop: function onStop(callback) {

		this._onStopCallback = callback;
		return this;

	},

	update: function update(time) {

		var property;
		var elapsed;
		var value;

		if (time < this._startTime) {
			return true;
		}

		if (this._onStartCallbackFired === false) {

			if (this._onStartCallback !== null) {
				this._onStartCallback(this._object);
			}

			this._onStartCallbackFired = true;
		}

		elapsed = (time - this._startTime) / this._duration;
		elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;

		value = this._easingFunction(elapsed);

		for (property in this._valuesEnd) {

			// Don't update properties that do not exist in the source object
			if (this._valuesStart[property] === undefined) {
				continue;
			}

			var start = this._valuesStart[property] || 0;
			var end = this._valuesEnd[property];

			if (end instanceof Array) {

				this._object[property] = this._interpolationFunction(end, value);

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof (end) === 'string') {

					if (end.charAt(0) === '+' || end.charAt(0) === '-') {
						end = start + parseFloat(end);
					} else {
						end = parseFloat(end);
					}
				}

				// Protect against non numeric properties.
				if (typeof (end) === 'number') {
					this._object[property] = start + (end - start) * value;
				}

			}

		}

		if (this._onUpdateCallback !== null) {
			this._onUpdateCallback(this._object);
		}

		if (elapsed === 1) {

			if (this._repeat > 0) {

				if (isFinite(this._repeat)) {
					this._repeat--;
				}

				// Reassign starting values, restart by making startTime = now
				for (property in this._valuesStartRepeat) {

					if (typeof (this._valuesEnd[property]) === 'string') {
						this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
					}

					if (this._yoyo) {
						var tmp = this._valuesStartRepeat[property];

						this._valuesStartRepeat[property] = this._valuesEnd[property];
						this._valuesEnd[property] = tmp;
					}

					this._valuesStart[property] = this._valuesStartRepeat[property];

				}

				if (this._yoyo) {
					this._reversed = !this._reversed;
				}

				if (this._repeatDelayTime !== undefined) {
					this._startTime = time + this._repeatDelayTime;
				} else {
					this._startTime = time + this._delayTime;
				}

				return true;

			} else {

				if (this._onCompleteCallback !== null) {

					this._onCompleteCallback(this._object);
				}

				for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the `update()` method was called way past the duration of the tween
					this._chainedTweens[i].start(this._startTime + this._duration);
				}

				return false;

			}

		}

		return true;

	}
};


TWEEN.Easing = {

	Linear: {

		None: function (k) {

			return k;

		}

	},

	Quadratic: {

		In: function (k) {

			return k * k;

		},

		Out: function (k) {

			return k * (2 - k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}

			return - 0.5 * (--k * (k - 2) - 1);

		}

	},

	Cubic: {

		In: function (k) {

			return k * k * k;

		},

		Out: function (k) {

			return --k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k + 2);

		}

	},

	Quartic: {

		In: function (k) {

			return k * k * k * k;

		},

		Out: function (k) {

			return 1 - (--k * k * k * k);

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}

			return - 0.5 * ((k -= 2) * k * k * k - 2);

		}

	},

	Quintic: {

		In: function (k) {

			return k * k * k * k * k;

		},

		Out: function (k) {

			return --k * k * k * k * k + 1;

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}

			return 0.5 * ((k -= 2) * k * k * k * k + 2);

		}

	},

	Sinusoidal: {

		In: function (k) {

			return 1 - Math.cos(k * Math.PI / 2);

		},

		Out: function (k) {

			return Math.sin(k * Math.PI / 2);

		},

		InOut: function (k) {

			return 0.5 * (1 - Math.cos(Math.PI * k));

		}

	},

	Exponential: {

		In: function (k) {

			return k === 0 ? 0 : Math.pow(1024, k - 1);

		},

		Out: function (k) {

			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}

			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

		}

	},

	Circular: {

		In: function (k) {

			return 1 - Math.sqrt(1 - k * k);

		},

		Out: function (k) {

			return Math.sqrt(1 - (--k * k));

		},

		InOut: function (k) {

			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}

			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

		},

		Out: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

		},

		InOut: function (k) {

			if (k === 0) {
				return 0;
			}

			if (k === 1) {
				return 1;
			}

			k *= 2;

			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}

			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

		}

	},

	Back: {

		In: function (k) {

			var s = 1.70158;

			return k * k * ((s + 1) * k - s);

		},

		Out: function (k) {

			var s = 1.70158;

			return --k * k * ((s + 1) * k + s) + 1;

		},

		InOut: function (k) {

			var s = 1.70158 * 1.525;

			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}

			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

		}

	},

	Bounce: {

		In: function (k) {

			return 1 - TWEEN.Easing.Bounce.Out(1 - k);

		},

		Out: function (k) {

			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}

		},

		InOut: function (k) {

			if (k < 0.5) {
				return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
			}

			return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.Linear;

		if (k < 0) {
			return fn(v[0], v[1], f);
		}

		if (k > 1) {
			return fn(v[m], v[m - 1], m - f);
		}

		return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

	},

	Bezier: function (v, k) {

		var b = 0;
		var n = v.length - 1;
		var pw = Math.pow;
		var bn = TWEEN.Interpolation.Utils.Bernstein;

		for (var i = 0; i <= n; i++) {
			b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
		}

		return b;

	},

	CatmullRom: function (v, k) {

		var m = v.length - 1;
		var f = m * k;
		var i = Math.floor(f);
		var fn = TWEEN.Interpolation.Utils.CatmullRom;

		if (v[0] === v[m]) {

			if (k < 0) {
				i = Math.floor(f = m * (1 + k));
			}

			return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

		} else {

			if (k < 0) {
				return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
			}

			if (k > 1) {
				return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
			}

			return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

		}

	},

	Utils: {

		Linear: function (p0, p1, t) {

			return (p1 - p0) * t + p0;

		},

		Bernstein: function (n, i) {

			var fc = TWEEN.Interpolation.Utils.Factorial;

			return fc(n) / fc(i) / fc(n - i);

		},

		Factorial: (function () {

			var a = [1];

			return function (n) {

				var s = 1;

				if (a[n]) {
					return a[n];
				}

				for (var i = n; i > 1; i--) {
					s *= i;
				}

				a[n] = s;
				return s;

			};

		})(),

		CatmullRom: function (p0, p1, p2, p3, t) {

			var v0 = (p2 - p0) * 0.5;
			var v1 = (p3 - p1) * 0.5;
			var t2 = t * t;
			var t3 = t * t2;

			return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
(function (root) {

	if (true) {

		// AMD
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return TWEEN;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

	} else if (typeof module !== 'undefined' && typeof exports === 'object') {

		// Node.js
		module.exports = TWEEN;

	} else if (root !== undefined) {

		// Global variable
		root.TWEEN = TWEEN;

	}

})(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(27)))

/***/ }),
/* 27 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map