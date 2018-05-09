pc.extend(pc, (() => {
    const _schema = [ 'enabled' ];

    /**
     * @constructor
     * @name pc.AudioListenerComponentSystem
     * @classdesc Component System for adding and removing {@link pc.AudioComponent} objects to Entities.
     * @description Create a new AudioListenerComponentSystem
     * @param {pc.Application} app The application managing this system.
     * @param {pc.SoundManager} manager A sound manager instance.
     * @extends pc.ComponentSystem
     */
    let AudioListenerComponentSystem = function({systems}, manager) {
        this.id = "audiolistener";
        this.description = "Specifies the location of the listener for 3D audio playback.";
        systems.add(this.id, this);

        this.ComponentType = pc.AudioListenerComponent;
        this.DataType = pc.AudioListenerComponentData;

        this.schema = _schema;

        this.manager = manager;
        this.current = null;

        pc.ComponentSystem.on('update', this.onUpdate, this);
    };
    AudioListenerComponentSystem = pc.inherits(AudioListenerComponentSystem, pc.ComponentSystem);

    pc.Component._buildAccessors(pc.AudioListenerComponent.prototype, _schema);

    pc.extend(AudioListenerComponentSystem.prototype, {
        initializeComponentData(component, data, properties) {
            properties = ['enabled'];

            AudioListenerComponentSystem._super.initializeComponentData.call(this, component, data, properties);
        },

        onUpdate(dt) {
            if (this.current) {
                const position = this.current.getPosition();
                this.manager.listener.setPosition(position);

                const wtm = this.current.getWorldTransform();
                this.manager.listener.setOrientation(wtm);
            }
        }
    });

    return {
        AudioListenerComponentSystem
    };
})());
