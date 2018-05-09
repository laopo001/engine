pc.extend(pc, (() => {
    /**
     * @component
     * @constructor
     * @name pc.AudioListenerComponent
     * @classdesc Represents the audio listener in the 3D world, so that 3D positioned audio sources are heard correctly.
     * @description Create new AudioListenerComponent
     * @param {pc.AudioListenerComponentSystem} system The ComponentSystem that created this Component
     * @param {pc.Entity} entity The Entity that this Component is attached to.
     * @extends pc.Component
     */
    let AudioListenerComponent = (system, entity) => {
    };

    AudioListenerComponent = pc.inherits(AudioListenerComponent, pc.Component);

    pc.extend(AudioListenerComponent.prototype, {
        setCurrentListener() {
            if (this.enabled && this.entity.audiolistener && this.entity.enabled) {
                this.system.current = this.entity;
                const position = this.system.current.getPosition();
                this.system.manager.listener.setPosition(position);
            }
        },

        onEnable() {
            AudioListenerComponent._super.onEnable.call(this);
            this.setCurrentListener();
        },

        onDisable() {
            AudioListenerComponent._super.onDisable.call(this);
            if (this.system.current === this.entity) {
                this.system.current = null;
            }
        }

    });

    return {
        AudioListenerComponent
    };
})());
