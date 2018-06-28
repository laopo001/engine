/**
 * @name pc
 * @namespace
 * @description Root namespace for the PlayCanvas Engine
 * @preserve PlayCanvas Engine v__CURRENT_SDK_VERSION__ revision __REVISION__
 * http://playcanvas.com
 * Copyright 2011-2017 PlayCanvas Ltd. All rights reserved.
// #ifdef DEBUG
 * DEBUG BUILD
// #endif
// #ifdef PROFILER
 * PROFILER BUILD
// #endif
 */
var pc;
(function (pc) {
    pc.version = "__CURRENT_SDK_VERSION__";
    pc.revision = "__REVISION__";
    pc.config = {};
    pc.common = {};
    pc.apps = {}; // Storage for the applications using the PlayCanvas Engine
    pc.data = {}; // Storage for exported entity data
    pc._matTex2D = undefined;
    /**
     * @private
     * @function
     * @name pc.unpack
     * @description Copy a set of common PlayCanvas functions/classes/namespaces into the global namespace
     */
    function unpack() {
        console.warn("pc.unpack has been deprecated and will be removed shortly. Please update your code.");
    }
    pc.unpack = unpack;
    /**
    * @function
    * @private
    * @name pc.makeArray
    * @description Convert an array-like object into a normal array.
    * For example, this is useful for converting the arguments object into an array.
    * @param {Object} arr The array to convert
    * @returns {Array} An array
    */
    function makeArray(arr) {
        var i;
        var ret = [];
        var length = arr.length;
        for (i = 0; i < length; ++i) {
            ret.push(arr[i]);
        }
        return ret;
    }
    pc.makeArray = makeArray;
    /**
    * @private
    * @function
    * @name pc.type
    * @description Extended typeof() function, returns the type of the object.
    * @param {Object} obj The object to get the type of
    * @returns {String} The type string: "null", "undefined", "number", "string", "boolean", "array", "object", "function", "date", "regexp" or "float32array"
    */
    function type(obj) {
        if (obj === null) {
            return "null";
        }
        var type = typeof (obj);
        if (type == "undefined" || type == "number" || type == "string" || type == "boolean") {
            return type;
        }
        return _typeLookup[Object.prototype.toString.call(obj)];
    }
    pc.type = type;
    /**
     * @private
     * @function
     * @name pc.isDefined
     * @description Return true if the Object is not undefined
     * @param {Object} o The Object to test
     * @returns {Boolean} True if the Object is not undefined
     */
    function isDefined(o) {
        var a;
        return (o !== a);
    }
    pc.isDefined = isDefined;
    function extend(target, ex) {
        var prop, copy;
        for (prop in ex) {
            copy = ex[prop];
            if (pc.type(copy) == "object") {
                target[prop] = pc.extend({}, copy);
            }
            else if (pc.type(copy) == "array") {
                target[prop] = pc.extend([], copy);
            }
            else {
                target[prop] = copy;
            }
        }
        return target;
    }
    pc.extend = extend;
    /**
     * @private
     * @name pc._typeLookup
     * @function
     * @description Create look up table for types
     */
    var _typeLookup = (function () {
        var result = {};
        var names = ["Array", "Object", "Function", "Date", "RegExp", "Float32Array"];
        for (var i = 0; i < names.length; i++)
            result["[object " + names[i] + "]"] = names[i].toLowerCase();
        return result;
    })();
})(pc || (pc = {}));
//# sourceMappingURL=core.js.map