pc.extend(pc, (() => {
    /**
     * @private
     * @constructor
     * @name pc.Listener
     * @classdesc Represents an audio listener - used internally.
     * @param {pc.SoundManager} manager The sound manager
     */
    class Listener {
        constructor({context}) {
            this.position = new pc.Vec3();
            this.velocity = new pc.Vec3();
            this.orientation = new pc.Mat4();

            if (pc.AudioManager.hasAudioContext()) {
                this.listener = context.listener;
            }
        }

        getPosition() {
            return this.position;
        }

        setPosition(position) {
            this.position.copy(position);
            if (this.listener) {
                this.listener.setPosition(position.x, position.y, position.z);
            }
        }

        getVelocity() {
            return this.velocity;
        }

        setVelocity(velocity) {
            this.velocity.copy(velocity);
            if (this.listener) {
                this.listener.setPosition(velocity.x, velocity.y, velocity.z);
            }
        }

        setOrientation(orientation) {
            this.orientation.copy(orientation);
            if (this.listener) {
                this.listener.setOrientation(-orientation.data[8], -orientation.data[9], -orientation.data[10],
                                             orientation.data[4], orientation.data[5], orientation.data[6]);
            }
        }

        getOrientation() {
            return this.orientation;
        }
    }

    return {
        Listener
    };
})());
