pc.extend(pc, (function () {
    /**
     * @private
     * @constructor
     * @name pc.Listener
     * @classdesc Represents an audio listener - used internally.
     * @param {pc.SoundManager} manager The sound manager
     */
    var Listener = /** @class */ (function () {
        function Listener(_a) {
            var context = _a.context;
            this.position = new pc.Vec3();
            this.velocity = new pc.Vec3();
            this.orientation = new pc.Mat4();
            if (pc.AudioManager.hasAudioContext()) {
                this.listener = context.listener;
            }
        }
        Listener.prototype.getPosition = function () {
            return this.position;
        };
        Listener.prototype.setPosition = function (position) {
            this.position.copy(position);
            if (this.listener) {
                this.listener.setPosition(position.x, position.y, position.z);
            }
        };
        Listener.prototype.getVelocity = function () {
            return this.velocity;
        };
        Listener.prototype.setVelocity = function (velocity) {
            this.velocity.copy(velocity);
            if (this.listener) {
                this.listener.setPosition(velocity.x, velocity.y, velocity.z);
            }
        };
        Listener.prototype.setOrientation = function (orientation) {
            this.orientation.copy(orientation);
            if (this.listener) {
                this.listener.setOrientation(-orientation.data[8], -orientation.data[9], -orientation.data[10], orientation.data[4], orientation.data[5], orientation.data[6]);
            }
        };
        Listener.prototype.getOrientation = function () {
            return this.orientation;
        };
        return Listener;
    }());
    return {
        Listener: Listener
    };
})());
//# sourceMappingURL=listener.js.map