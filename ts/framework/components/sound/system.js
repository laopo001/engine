pc.extend(pc, (() => {
    const _schema = [
        'enabled',
        'volume',
        'pitch',
        'positional',
        'refDistance',
        'maxDistance',
        'rollOffFactor',
        'distanceModel',
        'slots'
    ];

    /**
     * @constructor
     * @name pc.SoundComponentSystem
     * @classdesc Manages creation of {@link pc.SoundComponent}s.
     * @description Create a SoundComponentSystem
     * @param {pc.Application} app The Application
     * @param {pc.SoundManager} manager The sound manager
     * @property {Number} volume Sets / gets the volume for the entire Sound system. All sounds will have their volume
     * multiplied by this value. Valid between [0, 1].
     * @property {AudioContext} context Gets the AudioContext currently used by the sound manager. Requires Web Audio API support.
     * @property {pc.SoundManager} manager Gets / sets the sound manager
     * @extends pc.ComponentSystem
     */
    class SoundComponentSystem {
        constructor({systems}, manager) {
            this.id = "sound";
            this.description = "Allows an Entity to play sounds";
            systems.add(this.id, this);

            this.ComponentType = pc.SoundComponent;
            this.DataType = pc.SoundComponentData;

            this.schema = _schema;

            this.manager = manager;

            pc.ComponentSystem.on('update', this.onUpdate, this);

            this.on('beforeremove', this.onBeforeRemove, this);
        }

        get volume() {
            return this.manager.volume;
        }

        set volume(volume) {
            this.manager.volume = volume;
        }

        get context() {
            if (! pc.SoundManager.hasAudioContext()) {
                console.warn('WARNING: Audio context is not supported on this browser');
                return null;
            }

            return this.manager.context;
        }
    }

    SoundComponentSystem = pc.inherits(SoundComponentSystem, pc.ComponentSystem);

    pc.Component._buildAccessors(pc.SoundComponent.prototype, _schema);

    pc.extend(SoundComponentSystem.prototype, {
        initializeComponentData(component, data, properties) {
            properties = ['volume', 'pitch', 'positional', 'refDistance', 'maxDistance', 'rollOffFactor', 'distanceModel', 'slots', 'enabled'];
            SoundComponentSystem._super.initializeComponentData.call(this, component, data, properties);
        },

        cloneComponent({sound}, clone) {
            let key;
            const oldData = sound.data;
            const newData = {};

            // copy old data to new data
            for (key in oldData) {
                if (oldData.hasOwnProperty(key)) {
                    newData[key] = oldData[key];
                }
            }

            // convert 'slots' back to
            // simple option objects
            newData.slots = {};

            for (key in oldData.slots) {
                const oldSlot = oldData.slots[key];
                if (oldSlot instanceof pc.SoundSlot) {
                    newData.slots[key] = {
                        name: oldSlot.name,
                        volume: oldSlot.volume,
                        pitch: oldSlot.pitch,
                        loop: oldSlot.loop,
                        duration: oldSlot.duration,
                        startTime: oldSlot.startTime,
                        overlap: oldSlot.overlap,
                        autoPlay: oldSlot.autoPlay,
                        asset: oldSlot.asset
                    };
                } else {
                    newData.slots[key] = oldSlot;
                }
            }

            // reset playingBeforeDisable
            newData.playingBeforeDisable = {};

            // add component with new data
            return this.addComponent(clone, newData);
        },

        onUpdate(dt) {
            const store = this.store;

            for (const id in store) {
                if (store.hasOwnProperty(id)) {
                    const item = store[id];
                    const entity = item.entity;
                    const componentData = item.data;

                    // Update slot position if this is a 3d sound
                    if (componentData.enabled && entity.enabled && componentData.positional) {
                        const position = entity.getPosition();
                        const slots = componentData.slots;
                        for (const key in slots) {
                            slots[key].updatePosition(position);
                        }
                    }
                }
            }
        },

        onBeforeRemove(entity, component) {
            const slots = component.slots;
            // stop non overlapping sounds
            for (const key in slots) {
                if (! slots[key].overlap) {
                    slots[key].stop();
                }
            }
        }
    });

    return {
        SoundComponentSystem
    };
})());
