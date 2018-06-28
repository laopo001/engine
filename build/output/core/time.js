var pc;
(function (pc) {
    /**
     * @private
     * @constructor
     * @name pc.Timer
     * @description Create a new Timer instance.
     * @classdesc A Timer counts milliseconds from when start() is called until when stop() is called.
     */
    var Timer = /** @class */ (function () {
        function Timer() {
            this._isRunning = false;
            this._a = 0;
            this._b = 0;
        }
        /**
         * @private
         * @function
         * @name pc.Timer#start
         * @description Start the timer
         */
        Timer.prototype.start = function () {
            this._isRunning = true;
            this._a = Timer.now();
        };
        /**
         * @private
         * @function
         * @name pc.Timer#stop
         * @description Stop the timer
         */
        Timer.prototype.stop = function () {
            this._isRunning = false;
            this._b = Timer.now();
        };
        /**
         * @private
         * @function
         * @name pc.Timer#getMilliseconds
         * @description Get the number of milliseconds that passed between start() and stop() being called
         * @returns {Number} The elapsed milliseconds.
         */
        Timer.prototype.getMilliseconds = function () {
            return this._b - this._a;
        };
        Timer.now = function () {
            return (!window.performance || !window.performance.now || !window.performance.timing) ? Date.now() : window.performance.now();
        };
        return Timer;
    }());
    pc.Timer = Timer;
    function now() {
        return (!window.performance || !window.performance.now || !window.performance.timing) ? Date.now() : window.performance.now();
    }
    pc.now = now;
})(pc || (pc = {}));
//# sourceMappingURL=time.js.map