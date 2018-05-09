pc.extend(pc, (() => {
    // default maxDistance, same as Web Audio API
    const MAX_DISTANCE = 10000;

    let SoundInstance3d;

    if (pc.SoundManager.hasAudioContext()) {
        /**
        * @constructor
        * @name pc.SoundInstance3d
        * @extends pc.SoundInstance
        * @classdesc A pc.SoundInstance3d plays a {@link pc.Sound} in 3D
        * @param {pc.SoundManager} manager The sound manager
        * @param {pc.Sound} sound The sound to play
        * @param {Object} options Options for the instance
        * @param {Number} [options.volume=1] The playback volume, between 0 and 1.
        * @param {Number} [options.pitch=1] The relative pitch, default of 1, plays at normal pitch.
        * @param {Boolean} [options.loop=false] Whether the sound should loop when it reaches the end or not.
        * @param {Number} [options.startTime=0] The time from which the playback will start. Default is 0 to start at the beginning.
        * @param {Number} [options.duration=null] The total time after the startTime when playback will stop or restart if loop is true.
        * @param {pc.Vec3} [options.position=null] The position of the sound in 3D space.
        * @param {pc.Vec3} [options.velocity=null] The velocity of the sound.
        * @param {String} [options.distanceModel=pc.DISTANCE_LINEAR] Determines which algorithm to use to reduce the volume of the audio as it moves away from the listener. Can be one of {@link pc.DISTANCE_LINEAR}, {@link pc.DISTANCE_INVERSE} or {@link pc.DISTANCE_EXPONENTIAL}. Default is {@link pc.DISTANCE_LINEAR}.
        * @param {Number} [options.refDistance=1] The reference distance for reducing volume as the sound source moves further from the listener.
        * @param {Number} [options.maxDistance=10000] The maximum distance from the listener at which audio falloff stops. Note the volume of the audio is not 0 after this distance, but just doesn't fall off anymore.
        * @param {Number} [options.rollOffFactor=1] The factor used in the falloff equation.
        * @property {pc.Vec3} position The position of the sound in 3D space.
        * @property {pc.Vec3} velocity The velocity of the sound.
        * @property {String} distanceModel Determines which algorithm to use to reduce the volume of the audio as it moves away from the listener. Can be one of {@link pc.DISTANCE_LINEAR}, {@link pc.DISTANCE_INVERSE} or {@link pc.DISTANCE_EXPONENTIAL}. Default is {@link pc.DISTANCE_LINEAR}.        * @property {Number} refDistance The reference distance for reducing volume as the sound source moves further from the listener.
        * @property {Number} maxDistance The maximum distance from the listener at which audio falloff stops. Note the volume of the audio is not 0 after this distance, but just doesn't fall off anymore.
        * @property {Number} rollOffFactor The factor used in the falloff equation.
        */
        SoundInstance3d = function (manager, sound, options) {
            options = options || {};

            this._position = new pc.Vec3();
            if (options.position)
                this.position = options.position;

            this._velocity = new pc.Vec3();
            if (options.velocity)
                this.velocity = options.velocity;

            this.maxDistance = options.maxDistance !== undefined ? Number(options.maxDistance) : MAX_DISTANCE;
            this.refDistance = options.refDistance !== undefined ? Number(options.refDistance) : 1;
            this.rollOffFactor = options.rollOffFactor !== undefined ? Number(options.rollOffFactor) : 1;
            this.distanceModel = options.distanceModel !== undefined ? options.distanceModel : pc.DISTANCE_LINEAR;
        };
        SoundInstance3d = pc.inherits(SoundInstance3d, pc.SoundInstance);

        SoundInstance3d.prototype = pc.extend(SoundInstance3d.prototype, {
            _initializeNodes() {
                this.gain = this._manager.context.createGain();
                this.panner = this._manager.context.createPanner();
                this.panner.connect(this.gain);
                this._inputNode = this.panner;
                this._connectorNode = this.gain;
                this._connectorNode.connect(this._manager.context.destination);
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'position', {
            get() {
                return this._position;
            },
            set(position) {
                this._position.copy(position);
                this.panner.setPosition(position.x, position.y, position.z);
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'velocity', {
            get() {
                return this._velocity;
            },
            set(velocity) {
                this._velocity.copy(velocity);
                this.panner.setVelocity(velocity.x, velocity.y, velocity.z);
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'maxDistance', {
            get() {
                return this.panner.maxDistance;
            },
            set(value) {
                this.panner.maxDistance = value;
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'refDistance', {
            get() {
                return this.panner.refDistance;
            },
            set(value) {
                this.panner.refDistance = value;
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'rollOffFactor', {
            get() {
                return this.panner.rolloffFactor;
            },
            set(value) {
                this.panner.rolloffFactor = value;
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'distanceModel', {
            get() {
                return this.panner.distanceModel;
            },
            set(value) {
                this.panner.distanceModel = value;
            }
        });

    } else if (pc.SoundManager.hasAudio()) {
        // temp vector storage
        let offset = new pc.Vec3();

        // Fall off function which should be the same as the one in the Web Audio API
        // Taken from https://developer.mozilla.org/en-US/docs/Web/API/PannerNode/distanceModel
        const fallOff = (posOne, posTwo, refDistance, maxDistance, rollOffFactor, distanceModel) => {
            offset = offset.sub2(posOne, posTwo);
            const distance = offset.length();

            if (distance < refDistance) {
                return 1;
            } else if (distance > maxDistance) {
                return 0;
            } else {
                let result = 0;
                if (distanceModel === pc.DISTANCE_LINEAR) {
                    result = 1 - rollOffFactor * (distance - refDistance) / (maxDistance - refDistance);
                } else if (distanceModel === pc.DISTANCE_INVERSE) {
                    result = refDistance / (refDistance + rollOffFactor * (distance - refDistance));
                } else if (distanceModel === pc.DISTANCE_EXPONENTIAL) {
                    result = distance / refDistance ** -rollOffFactor;
                }

                return pc.math.clamp(result, 0, 1);
            }
        };

        SoundInstance3d = function (manager, sound, options) {
            options = options || {};

            this._position = new pc.Vec3();
            if (options.position)
                this.position = options.position;

            this._velocity = new pc.Vec3();
            if (options.velocity)
                this.velocity = options.velocity;

            this._maxDistance = options.maxDistance !== undefined ? Number(options.maxDistance) : MAX_DISTANCE;
            this._refDistance = options.refDistance !== undefined ? Number(options.refDistance) : 1;
            this._rollOffFactor = options.rollOffFactor !== undefined ? Number(options.rollOffFactor) : 1;
            this._distanceModel = options.distanceModel !== undefined ? options.distanceModel : pc.DISTANCE_LINEAR;

        };
        SoundInstance3d = pc.inherits(SoundInstance3d, pc.SoundInstance);

        Object.defineProperty(SoundInstance3d.prototype, 'position', {
            get() {
                return this._position;
            },
            set(position) {
                this._position.copy(position);

                if (this.source) {
                    const listener = this._manager.listener;

                    const lpos = listener.getPosition();

                    const factor = fallOff(lpos, this._position, this.refDistance, this.maxDistance, this.rollOffFactor, this.distanceModel);

                    const v = this.volume;

                    this.source.volume = v * factor * this._manager.volume;
                }
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'velocity', {
            get() {
                return this._velocity;
            },
            set(velocity) {
                this._velocity.copy(velocity);
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'maxDistance', {
            get() {
                return this._maxDistance;
            },
            set(value) {
                this._maxDistance = value;
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'refDistance', {
            get() {
                return this._refDistance;
            },
            set(value) {
                this._refDistance = value;
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'rollOffFactor', {
            get() {
                return this._rollOffFactor;
            },
            set(value) {
                this._rollOffFactor = value;
            }
        });

        Object.defineProperty(SoundInstance3d.prototype, 'distanceModel', {
            get() {
                return this._distanceModel;
            },
            set(value) {
                this._distanceModel = value;
            }
        });
    } else {
        SoundInstance3d = () => { };
    }

    return {
        SoundInstance3d
    };
})());
