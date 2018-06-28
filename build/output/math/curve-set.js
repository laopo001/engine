var pc;
(function (pc) {
    /**
     * @constructor
     * @name pc.CurveSet
     * @classdesc A curve set is a collection of curves.
     * @description Creates a new curve set.
     * @param {Array} [curveKeys] An array of arrays of keys (pairs of numbers with
     * the time first and value second).
     */
    var CurveSet = /** @class */ (function () {
        function CurveSet() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var i;
            this.curves = [];
            this._type = pc.CURVE_SMOOTHSTEP;
            if (args.length > 1) {
                for (i = 0; i < args.length; i++) {
                    this.curves.push(new pc.Curve(args[i]));
                }
            }
            else {
                if (args.length === 0) {
                    this.curves.push(new pc.Curve());
                }
                else {
                    var arg = args[0];
                    if (pc.type(arg) === 'number') {
                        for (i = 0; i < arg; i++) {
                            this.curves.push(new pc.Curve());
                        }
                    }
                    else {
                        for (i = 0; i < arg.length; i++) {
                            this.curves.push(new pc.Curve(arg[i]));
                        }
                    }
                }
            }
        }
        /**
         * @function
         * @name pc.CurveSet#get
         * @description Return a specific curve in the curve set.
         * @param {Number} index The index of the curve to return
         * @returns {pc.Curve} The curve at the specified index
         */
        CurveSet.prototype.get = function (index) {
            return this.curves[index];
        };
        /**
         * @function
         * @name pc.CurveSet#value
         * @description Returns the interpolated value of all curves in the curve
         * set at the specified time.
         * @param {Number} time The time at which to calculate the value
         * @param {Array} [result] The interpolated curve values at the specified time.
         * If this parameter is not supplied, the function allocates a new array internally
         * to return the result.
         * @returns {Array} The interpolated curve values at the specified time
         */
        CurveSet.prototype.value = function (time, result) {
            var length = this.curves.length;
            result = result || [];
            result.length = length;
            for (var i = 0; i < length; i++) {
                result[i] = this.curves[i].value(time);
            }
            return result;
        };
        /**
         * @function
         * @name pc.CurveSet#clone
         * @description Returns a clone of the specified curve set object.
         * @returns {pc.CurveSet} A clone of the specified curve set
         */
        CurveSet.prototype.clone = function () {
            var result = new pc.CurveSet();
            result.curves = [];
            for (var i = 0; i < this.curves.length; i++) {
                result.curves.push(this.curves[i].clone());
            }
            result._type = this._type;
            return result;
        };
        CurveSet.prototype.quantize = function (precision) {
            precision = Math.max(precision, 2);
            var numCurves = this.curves.length;
            var values = new Float32Array(precision * numCurves);
            var step = 1.0 / (precision - 1);
            var temp = [];
            for (var i = 0; i < precision; i++) { // quantize graph to table of interpolated values
                var value = this.value(step * i, temp);
                if (numCurves == 1) {
                    values[i] = value[0];
                }
                else {
                    for (var j = 0; j < numCurves; j++) {
                        values[i * numCurves + j] = value[j];
                    }
                }
            }
            return values;
        };
        Object.defineProperty(CurveSet.prototype, "length", {
            /**
             * @readonly
             * @name pc.CurveSet#length
             * @type Number
             * @description The number of curves in the curve set.
             */
            get: function () {
                return this.curves.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CurveSet.prototype, "type", {
            /**
             * @name pc.CurveSet#type
             * @type Number
             * @description The interpolation scheme applied to all curves in the curve set. Can be:
             * <ul>
             *     <li>pc.CURVE_LINEAR</li>
             *     <li>pc.CURVE_SMOOTHSTEP</li>
             *     <li>pc.CURVE_CATMULL</li>
             *     <li>pc.CURVE_CARDINAL</li>
             * </ul>
             */
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
                for (var i = 0; i < this.curves.length; i++) {
                    this.curves[i].type = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return CurveSet;
    }());
    pc.CurveSet = CurveSet;
})(pc || (pc = {}));
//# sourceMappingURL=curve-set.js.map