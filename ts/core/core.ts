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
namespace pc {

    export const version = "__CURRENT_SDK_VERSION__";
    export const revision = "__REVISION__";
    export const config = {}
    export const common = {}
    export const apps = {} // Storage for the applications using the PlayCanvas Engine
    export const data = {} // Storage for exported entity data
    export const _matTex2D = undefined;

    export let _benchmarked: boolean;

    export let extTextureFloatHighPrecision;
    export let extTextureHalfFloatRenderable;
    export let extTextureFloatRenderable;

    /**
     * @private
     * @function
     * @name pc.unpack
     * @description Copy a set of common PlayCanvas functions/classes/namespaces into the global namespace
     */
    export function unpack() {
        console.warn("pc.unpack has been deprecated and will be removed shortly. Please update your code.");
    }

    /**
    * @function
    * @private
    * @name pc.makeArray
    * @description Convert an array-like object into a normal array.
    * For example, this is useful for converting the arguments object into an array.
    * @param {Object} arr The array to convert
    * @returns {Array} An array
    */
    export function makeArray(arr) {
        let i;
        const ret = [];
        const length = arr.length;

        for (i = 0; i < length; ++i) {
            ret.push(arr[i]);
        }

        return ret;
    }
    /**
    * @private
    * @function
    * @name pc.type
    * @description Extended typeof() function, returns the type of the object.
    * @param {Object} obj The object to get the type of
    * @returns {String} The type string: "null", "undefined", "number", "string", "boolean", "array", "object", "function", "date", "regexp" or "float32array"
    */
    export function type(obj) {
        if (obj === null) {
            return "null";
        }

        const type = typeof (obj);

        if (type == "undefined" || type == "number" || type == "string" || type == "boolean") {
            return type;
        }

        return _typeLookup[Object.prototype.toString.call(obj)];
    }

    /**
     * @private
     * @function
     * @name pc.isDefined
     * @description Return true if the Object is not undefined
     * @param {Object} o The Object to test
     * @returns {Boolean} True if the Object is not undefined
     */
    export function isDefined(o) {
        let a;
        return (o !== a);
    }

    export function extend(target, ex) {
        var prop,
            copy;

        for (prop in ex) {
            copy = ex[prop];
            if (pc.type(copy) == "object") {
                target[prop] = pc.extend({}, copy);
            } else if (pc.type(copy) == "array") {
                target[prop] = pc.extend([], copy);
            } else {
                target[prop] = copy;
            }
        }

        return target;
    }

    /**
     * @private
     * @name pc._typeLookup
     * @function
     * @description Create look up table for types
     */
    var _typeLookup = (() => {
        const result = {};
        const names = ["Array", "Object", "Function", "Date", "RegExp", "Float32Array"];

        for (let i = 0; i < names.length; i++)
            result[`[object ${names[i]}]`] = names[i].toLowerCase();

        return result;
    })();

}