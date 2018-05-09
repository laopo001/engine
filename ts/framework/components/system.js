pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.ComponentSystem
     * @classdesc Component Systems contain the logic and functionality to update all Components of a particular type.
     * @param {pc.Application} app The application managing this system.
     */
    class ComponentSystem {
        constructor(app) {
            this.app = app;
            this.dataStore = {};
            this.schema = [];

            pc.events.attach(this);
        }

        // Instance methods
        /**
         * @private
         * @field
         * @type Array
         * @name pc.ComponentSystem#store
         * @description The store where all {@link pc.ComponentData} objects are kept
         */
        store() {
            return this.dataStore;
        }

        /**
         * @private
         * @function
         * @name pc.ComponentSystem#addComponent
         * @description Create new {@link pc.Component} and {@link pc.ComponentData} instances and attach them to the entity
         * @param {pc.Entity} entity The Entity to attach this component to
         * @param {Object} data The source data with which to create the component
         * @returns {pc.Component} Returns a Component of type defined by the component system
         * @example
         *   var entity = new pc.Entity(app);
         *   app.systems.model.addComponent(entity, { type: 'box' });
         *   // entity.model is now set to a pc.ModelComponent
         */
        addComponent(entity, data) {
            const component = new this.ComponentType(this, entity);
            const componentData = new this.DataType();

            data = data || {};

            this.dataStore[entity._guid] = {
                entity,
                data: componentData
            };

            entity[this.id] = component;
            entity.c[this.id] = component;

            this.initializeComponentData(component, data, []);

            this.fire('add', entity, component);

            return component;
        }

        /**
         * @private
         * @function
         * @name pc.ComponentSystem#removeComponent
         * @description Remove the {@link pc.Component} from the entity and delete the associated {@link pc.ComponentData}
         * @param {pc.Entity} entity The entity to remove the component from
         * @example
         * app.systems.model.removeComponent(entity);
         * // entity.model === undefined
         */
        removeComponent(entity) {
            const record = this.dataStore[entity._guid];
            const component = entity.c[this.id];
            this.fire('beforeremove', entity, component);
            delete this.dataStore[entity._guid];
            delete entity[this.id];
            delete entity.c[this.id];
            this.fire('remove', entity, record.data);
        }

        /**
         * @private
         * @function
         * @name pc.ComponentSystem#cloneComponent
         * @description Create a clone of component. This creates a copy all ComponentData variables.
         * @param {pc.Entity} entity The entity to clone the component from
         * @param {pc.Entity} clone The entity to clone the component into
         */
        cloneComponent({_guid}, clone) {
            // default clone is just to add a new component with existing data
            const src = this.dataStore[_guid];
            return this.addComponent(clone, src.data);
        }

        /**
         * @private
         * @function
         * @name pc.ComponentSystem#initializeComponentData
         * @description Called during {@link pc.ComponentSystem#addComponent} to initialize the {@link pc.ComponentData} in the store
         * This can be overridden by derived Component Systems and either called by the derived System or replaced entirely
         */
        initializeComponentData(component, data, properties) {
            data = data || {};

            // initialize
            properties.forEach(value => {
                if (data[value] !== undefined) {
                    component[value] = data[value];
                } else {
                    component[value] = component.data[value];
                }

            }, this);

            // after component is initialized call onEnable
            if (component.enabled && component.entity.enabled) {
                component.onEnable();
            }
        }
    }

    // Class methods
    pc.extend(ComponentSystem, {
        initialize(root) {
            ComponentSystem.fire('initialize', root);
        },

        postInitialize(root) {
            ComponentSystem.fire('postInitialize', root);
        },

        // Update all ComponentSystems
        update(dt, inTools) {
            if (inTools) {
                ComponentSystem.fire('toolsUpdate', dt);
            } else {
                ComponentSystem.fire('update', dt);
            }
        },

        // Update all ComponentSystems
        fixedUpdate(dt, inTools) {
            ComponentSystem.fire('fixedUpdate', dt);
        },

        // Update all ComponentSystems
        postUpdate(dt, inTools) {
            ComponentSystem.fire('postUpdate', dt);
        }
    });

    // Add event support
    pc.events.attach(ComponentSystem);

    ComponentSystem.destroy = () => {
        ComponentSystem.off('initialize');
        ComponentSystem.off('postInitialize');
        ComponentSystem.off('toolsUpdate');
        ComponentSystem.off('update');
        ComponentSystem.off('fixedUpdate');
        ComponentSystem.off('postUpdate');
    };

    return {
        ComponentSystem
    };
})());
