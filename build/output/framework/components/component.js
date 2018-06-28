pc.extend(pc, (function () {
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
    var Component = /** @class */ (function () {
        function Component(system, entity) {
            this.system = system;
            this.entity = entity;
            pc.events.attach(this);
            if (this.system.schema && !this._accessorsBuilt) {
                this.buildAccessors(this.system.schema);
            }
            this.on("set", function (name, oldValue, newValue) {
                this.fire("set_" + name, name, oldValue, newValue);
            });
            this.on('set_enabled', this.onSetEnabled, this);
        }
        /**
         * @private
         * @property {pc.ComponentData} data Access the {@link pc.ComponentData} directly.
         * Usually you should access the data properties via the individual properties as
         * modifying this data directly will not fire 'set' events.
         */
        Component.prototype.data = function () {
            var record = this.system.store[this.entity._guid];
            if (record) {
                return record.data;
            }
            else {
                return null;
            }
        };
        Component.prototype.buildAccessors = function (schema) {
            Component._buildAccessors(this, schema);
        };
        Component.prototype.onSetEnabled = function (name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (this.entity.enabled) {
                    if (newValue) {
                        this.onEnable();
                    }
                    else {
                        this.onDisable();
                    }
                }
            }
        };
        Component.prototype.onEnable = function () { };
        Component.prototype.onDisable = function () { };
        Component.prototype.onPostStateChange = function () { };
        return Component;
    }());
    Component._buildAccessors = function (obj, schema) {
        // Create getter/setter pairs for each property defined in the schema
        schema.forEach(function (prop) {
            Object.defineProperty(obj, prop, {
                get: function () {
                    return this.data[prop];
                },
                set: function (value) {
                    var data = this.data;
                    var oldValue = data[prop];
                    data[prop] = value;
                    this.fire('set', prop, oldValue, value);
                },
                configurable: true
            });
        });
        obj._accessorsBuilt = true;
    };
    return {
        Component: Component
    };
})());
//# sourceMappingURL=component.js.map