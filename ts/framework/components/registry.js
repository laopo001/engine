pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.ComponentSystemRegistry
     * @classdesc Store, access and delete instances of the various ComponentSystems
     * @description Create a new ComponentSystemRegistry
     */
    const ComponentSystemRegistry = () => {
    };

    ComponentSystemRegistry.prototype = {
        /**
         * @private
         * @function
         * @name pc.ComponentSystemRegistry#add
         * @description Add a new Component type
         * @param {Object} name The name of the Component
         * @param {Object} system The {pc.ComponentSystem} instance
         */
        add(name, system) {
            if (!this[name]) {
                this[name] = system;
                system.name = name;
            } else {
                throw new Error(pc.string.format("ComponentSystem name '{0}' already registered or not allowed", name));
            }
        },
        /**
         * @private
         * @function
         * @name pc.ComponentSystemRegistry#remove
         * @description Remove a Component type
         * @param {Object} name The name of the Component remove
         */
        remove(name) {
            if (!this[name]) {
                throw new Error(pc.string.format("No ComponentSystem named '{0}' registered", name));
            }

            delete this[name];
        },

        /**
         * @private
         * @function
         * @name pc.ComponentSystemRegistry#list
         * @description Return the contents of the registry as an array, this order of the array
         * is the order in which the ComponentSystems must be initialized.
         * @returns {pc.ComponentSystem[]} An array of component systems.
         */
        list() {
            const list = Object.keys(this);
            const defaultPriority = 1;
            const priorities = {
                'collisionrect': 0.5,
                'collisioncircle': 0.5
            };

            list.sort((a, b) => {
                const pa = priorities[a] || defaultPriority;
                const pb = priorities[b] || defaultPriority;

                if (pa < pb) {
                    return -1;
                } else if (pa > pb) {
                    return 1;
                }

                return 0;
            });

            return list.map(function (key) {
                return this[key];
            }, this);
        },

        getComponentSystemOrder() {
            let index;
            const names = Object.keys(this);

            index = names.indexOf('collisionrect');
            names.splice(index, 1);
            names.unshift('collisionrect');

            index = names.indexOf('collisioncircle');
            names.splice(index, 1);
            names.unshift('collisioncircle');

            return names;
        }
    };

    return {
        ComponentSystemRegistry
    };
})());
