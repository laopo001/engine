pc.extend(pc, (function () {
    /**
     * @constructor
     * @name pc.Sound
     * @classdesc Represents the resource of an audio asset.
     * @param {Audio|AudioBuffer} resource If the Web Audio API is supported, pass an AudioBuffer object, otherwise
     * an Audio object.
     * @property {AudioBuffer} buffer If the Web Audio API is supported this contains the audio data
     * @property {Audio} audio If the Web Audio API is not supported this contains the audio data
     * @property {Number} duration Returns the duration of the sound. If the sound is not loaded it returns 0.
     */
    var Sound = /** @class */ (function () {
        function Sound(resource) {
            if (resource instanceof Audio) {
                this.audio = resource;
            }
            else {
                this.buffer = resource;
            }
        }
        Object.defineProperty(Sound.prototype, "duration", {
            get: function () {
                var duration = 0;
                if (this.buffer) {
                    duration = this.buffer.duration;
                }
                else if (this.audio) {
                    duration = this.audio.duration;
                }
                return duration || 0;
            },
            enumerable: true,
            configurable: true
        });
        return Sound;
    }());
    return {
        Sound: Sound
    };
})());
//# sourceMappingURL=sound.js.map