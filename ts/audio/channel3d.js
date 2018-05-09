pc.extend(pc, (() => {
    // default maxDistance, same as Web Audio API
    const MAX_DISTANCE = 10000;

    let Channel3d;

    if (pc.AudioManager.hasAudioContext()) {
        Channel3d = function (manager, sound, options) {
            this.position = new pc.Vec3();
            this.velocity = new pc.Vec3();

            const context = manager.context;
            this.panner = context.createPanner();
        };
        Channel3d = pc.inherits(Channel3d, pc.Channel);

        Channel3d.prototype = pc.extend(Channel3d.prototype, {
            getPosition() {
                return this.position;
            },

            setPosition(position) {
                this.position.copy(position);
                this.panner.setPosition(position.x, position.y, position.z);
            },

            getVelocity() {
                return this.velocity;
            },

            setVelocity(velocity) {
                this.velocity.copy(velocity);
                this.panner.setVelocity(velocity.x, velocity.y, velocity.z);
            },

            getMaxDistance() {
                return this.panner.maxDistance;
            },

            setMaxDistance(max) {
                this.panner.maxDistance = max;
            },

            getMinDistance() {
                return this.panner.refDistance;
            },

            setMinDistance(min) {
                this.panner.refDistance = min;
            },

            getRollOffFactor() {
                return this.panner.rolloffFactor;
            },

            setRollOffFactor(factor) {
                this.panner.rolloffFactor = factor;
            },

            getDistanceModel() {
                return this.pannel.distanceModel;
            },

            setDistanceModel(distanceModel) {
                this.panner.distanceModel = distanceModel;
            },

            /**
            * @private
            * @function
            * @name pc.Channel3d#_createSource
            * @description Create the buffer source and connect it up to the correct audio nodes
            */
            _createSource() {
                const context = this.manager.context;

                this.source = context.createBufferSource();
                this.source.buffer = this.sound.buffer;

                // Connect up the nodes
                this.source.connect(this.panner);
                this.panner.connect(this.gain);
                this.gain.connect(context.destination);

                if (!this.loop) {
                    // mark source as paused when it ends
                    this.source.onended = this.pause.bind(this);
                }
            }
        });
    } else if (pc.AudioManager.hasAudio()) {
        // temp vector storage
        let offset = new pc.Vec3();


        // Fall off function which should be the same as the one in the Web Audio API
        // Taken from https://developer.mozilla.org/en-US/docs/Web/API/PannerNode/distanceModel
        const fallOff = (posOne, posTwo, refDistance, maxDistance, rolloffFactor, distanceModel) => {
            offset = offset.sub2(posOne, posTwo);
            const distance = offset.length();

            if (distance < refDistance) {
                return 1;
            } else if (distance > maxDistance) {
                return 0;
            } else {
                let result = 0;
                if (distanceModel === pc.DISTANCE_LINEAR) {
                    result = 1 - rolloffFactor * (distance - refDistance) / (maxDistance - refDistance);
                } else if (distanceModel === pc.DISTANCE_INVERSE) {
                    result = refDistance / (refDistance + rolloffFactor * (distance - refDistance));
                } else if (distanceModel === pc.DISTANCE_EXPONENTIAL) {
                    result = distance / refDistance ** -rolloffFactor;
                }

                return pc.math.clamp(result, 0, 1);
            }
        };

        Channel3d = function (manager, sound) {
            this.position = new pc.Vec3();
            this.velocity = new pc.Vec3();

            this.maxDistance = MAX_DISTANCE;
            this.minDistance = 1;
            this.rollOffFactor = 1;
            this.distanceModel = pc.DISTANCE_INVERSE;

        };
        Channel3d = pc.inherits(Channel3d, pc.Channel);

        Channel3d.prototype = pc.extend(Channel3d.prototype, {
            getPosition() {
                return this.position;
            },

            setPosition(position) {
                this.position.copy(position);

                if (this.source) {
                    const listener = this.manager.listener;

                    const lpos = listener.getPosition();

                    const factor = fallOff(lpos, this.position, this.minDistance, this.maxDistance, this.rollOffFactor, this.distanceModel);

                    const v = this.getVolume();
                    this.source.volume = v * factor;
                }
            },

            getVelocity() {
                return this.velocity;
            },

            setVelocity(velocity) {
                this.velocity.copy(velocity);
            },

            getMaxDistance() {
                return this.maxDistance;
            },

            setMaxDistance(max) {
                this.maxDistance = max;
            },

            getMinDistance() {
                return this.minDistance;
            },

            setMinDistance(min) {
                this.minDistance = min;
            },

            getRollOffFactor() {
                return this.rollOffFactor;
            },

            setRollOffFactor(factor) {
                this.rollOffFactor = factor;
            },

            getDistanceModel() {
                return this.distanceModel;
            },

            setDistanceModel(distanceModel) {
                this.distanceModel = distanceModel;
            }
        });
    } else {
        Channel3d = () => { };
    }

    return {
        Channel3d
    };
})());
