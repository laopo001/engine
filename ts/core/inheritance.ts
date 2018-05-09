/**
 * @private
 * @deprecated
 * Implementation of inheritance for JavaScript objects
 * e.g. Class can access all of Base's function prototypes
 * <pre lang="javascript"><code>
 * Base = function () {}
 * Class = function () {}
 * Class = Class.extendsFrom(Base)
 * </code></pre>
 * @param {Object} Super
 */
(Function as any).prototype.extendsFrom = function (Super) {
    let Self, Func;
    const Temp = () => { };

    Self = this;
    Func = function (...args) {
        Super.apply(this, args);
        Self.apply(this, args);
        this.constructor = Self;
    };
    Func._super = Super.prototype;
    Temp.prototype = Super.prototype;
    Func.prototype = new Temp();
    return Func;
};


/**
 * @private
 * @function
 * @name pc.inherits
 * @description Implementation of inheritance for JavaScript objects
 * e.g. Class can access all of Base's function prototypes
 * The super classes prototype is available on the derived class as _super
 * @param {Function} Self Constructor of derived class
 * @param {Function} Super Constructor of base class
 * @returns {Function} New instance of Self which inherits from Super
 * @example
 * Base = function () {};
 * Base.prototype.fn = function () {
 *   console.log('base');
 * };
 * Class = function () {}
 * Class = pc.inherits(Class, Base);
 * Class.prototype.fn = function () {
 *   // Call overridden method
 *   Class._super.fn();
 *   console.log('class');
 * };
 *
 * var c = new Class();
 * c.fn(); // prints 'base' then 'class'
 */
export function inherits(Self, Super) {
    var Temp = function () { };
    var Func = function (arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        Super.call(this, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        Self.call(this, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
        // this.constructor = Self;
    };
    (Func as any)._super = Super.prototype;
    Temp.prototype = Super.prototype;
    Func.prototype = new Temp();

    return Func;
}

