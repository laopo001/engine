
/**
 * @private
 * @constructor
 * @name pc.Timer
 * @description Create a new Timer instance.
 * @classdesc A Timer counts milliseconds from when start() is called until when stop() is called.
 */
export class Timer {
    _isRunning: boolean;
    _a: number;
    _b: number;
    constructor() {
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
    start() {
        this._isRunning = true;
        this._a = pc.now();
    }

    /**
     * @private
     * @function
     * @name pc.Timer#stop
     * @description Stop the timer
     */
    stop() {
        this._isRunning = false;
        this._b = pc.now();
    }

    /**
     * @private
     * @function
     * @name pc.Timer#getMilliseconds
     * @description Get the number of milliseconds that passed between start() and stop() being called
     * @returns {Number} The elapsed milliseconds.
     */
    getMilliseconds() {
        return this._b - this._a;
    }
    static now() {
        return (!window.performance || !window.performance.now || !window.performance.timing) ? Date.now() : window.performance.now()
    }
}


