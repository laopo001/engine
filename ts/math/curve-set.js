pc.extend(pc, ((() => {
    /**
     * @constructor
     * @name pc.CurveSet
     * @classdesc A curve set is a collection of curves.
     * @description Creates a new curve set.
     * @param {Array} [curveKeys] An array of arrays of keys (pairs of numbers with
     * the time first and value second).
     */
    class CurveSet {
        constructor(...args) {
            let i;

            this.curves = [];
            this._type = pc.CURVE_SMOOTHSTEP;

            if (args.length > 1) {
                for (i = 0; i < args.length; i++) {
                    this.curves.push(new pc.Curve(args[i]));
                }
            } else {
                if (args.length === 0) {
                    this.curves.push(new pc.Curve());
                } else {
                    const arg = args[0];
                    if (pc.type(arg) === 'number') {
                        for (i = 0; i < arg; i++) {
                            this.curves.push(new pc.Curve());
                        }
                    } else {
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
        get(index) {
            return this.curves[index];
        }

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
        value(time, result) {
            const length = this.curves.length;
            result = result || [];
            result.length = length;

            for (let i = 0; i < length; i++) {
                result[i] = this.curves[i].value(time);
            }

            return result;
        }

        /**
         * @function
         * @name pc.CurveSet#clone
         * @description Returns a clone of the specified curve set object.
         * @returns {pc.CurveSet} A clone of the specified curve set
         */
        clone() {
            const result = new pc.CurveSet();

            result.curves = [ ];
            for (let i = 0; i < this.curves.length; i++) {
                result.curves.push(this.curves[i].clone());
            }

            result._type = this._type;

            return result;
        }

        quantize(precision) {
            precision = Math.max(precision, 2);

            const numCurves = this.curves.length;
            const values = new Float32Array(precision * numCurves);
            const step = 1.0 / (precision - 1);
            const temp = [];

            for (let i = 0; i < precision; i++) { // quantize graph to table of interpolated values
                const value = this.value(step * i, temp);
                if (numCurves == 1) {
                    values[i] = value[0];
                } else {
                    for (let j = 0; j < numCurves; j++) {
                        values[i * numCurves + j] = value[j];
                    }
                }
            }

            return values;
        }

        /**
         * @readonly
         * @name pc.CurveSet#length
         * @type Number
         * @description The number of curves in the curve set.
         */
        get length() {
            return this.curves.length;
        }

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
        get type() {
            return this._type;
        }

        set type(value) {
            this._type = value;
            for (let i = 0; i < this.curves.length; i++) {
                this.curves[i].type = value;
            }
        }
    }

    return {
        CurveSet
    };
})()));
