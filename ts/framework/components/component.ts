pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.Component
     * @classdesc Components are used to attach functionality on a {@link pc.Entity}. Components
     * can receive update events each frame, and expose properties to the PlayCanvas Editor.
     * @description Base constructor for a Component
     * @param {pc.ComponentSystem} system The ComponentSystem used to create this Component
     * @param {pc.Entity} entity The Entity that this Component is attached to
     * @property {Boolean} enabled Enables or disables the component.
     */
    class Component {
        constructor(system, entity) {
            this.system = system;
            this.entity = entity;

            pc.events.attach(this);

            if (this.system.schema && !this._accessorsBuilt) {
                this.buildAccessors(this.system.schema);
            }

            this.on("set", function (name, oldValue, newValue) {
                this.fire(`set_${name}`, name, oldValue, newValue);
            });

            this.on('set_enabled', this.onSetEnabled, this);
        }

        /**
         * @private
         * @property {pc.ComponentData} data Access the {@link pc.ComponentData} directly.
         * Usually you should access the data properties via the individual properties as
         * modifying this data directly will not fire 'set' events.
         */
        data() {
            const record = this.system.store[this.entity._guid];
            if (record) {
                return record.data;
            } else {
                return null;
            }
        }

        buildAccessors(schema) {
            Component._buildAccessors(this, schema);
        }

        onSetEnabled(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (this.entity.enabled) {
                    if (newValue) {
                        this.onEnable();
                    } else {
                        this.onDisable();
                    }
                }
            }
        }

        onEnable() { }
        onDisable() { }
        onPostStateChange() { }
    }

    Component._buildAccessors = (obj, schema) => {
        // Create getter/setter pairs for each property defined in the schema
        schema.forEach(prop => {
            Object.defineProperty(obj, prop, {
                get() {
                    return this.data[prop];
                },
                set(value) {
                    const data = this.data;
                    const oldValue = data[prop];
                    data[prop] = value;
                    this.fire('set', prop, oldValue, value);
                },
                configurable: true
            });
        });

        obj._accessorsBuilt = true;
    };

    return {
        Component
    };
})());
