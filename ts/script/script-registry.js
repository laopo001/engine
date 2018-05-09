pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.ScriptRegistry
     * @classdesc Container for all Script Types that are available to this application
     * @description Create an instance of a pc.ScriptRegistry.
     * Note: PlayCanvas scripts can access the Script Registry from inside the application with {@link pc.Application#scripts} {@link pc.ADDRESS_REPEAT}.
     * @param {pc.Application} app Application to attach registry to.
     */
    class ScriptRegistry {
        constructor(app) {
            pc.events.attach(this);

            this.app = app;
            this._scripts = { };
            this._list = [ ];
        }

        /**
         * @function
         * @name pc.ScriptRegistry#add
         * @description Add {@link ScriptType} to registry.
         * Note: when {@link pc.createScript} is called, it will add the {@link ScriptType} to the registry automatically.
         * If a script already exists in registry, and the new script has a `swap` method defined,
         * it will perform code hot swapping automatically in async manner.
         * @param {ScriptType} script Script Type that is created using {@link pc.createScript}
         * @returns {Boolean} True if added for the first time or false if script already exists
         * @example
         * var PlayerController = pc.createScript('playerController');
         * // playerController Script Type will be added to pc.ScriptRegistry automatically
         * app.scripts.has('playerController') === true; // true
         */
        add(script) {
            const self = this;

            if (this._scripts.hasOwnProperty(script.__name)) {
                setTimeout(() => {
                    if (script.prototype.swap) {
                        // swapping
                        const old = self._scripts[script.__name];
                        const ind = self._list.indexOf(old);
                        self._list[ind] = script;
                        self._scripts[script.__name] = script;

                        self.fire('swap', script.__name, script);
                        self.fire(`swap:${script.__name}`, script);
                    } else {
                        console.warn(`script registry already has '${script.__name}' script, define 'swap' method for new script type to enable code hot swapping`);
                    }
                });
                return false;
            }

            this._scripts[script.__name] = script;
            this._list.push(script);

            this.fire('add', script.__name, script);
            this.fire(`add:${script.__name}`, script);

            // for all components awaiting Script Type
            // create script instance
            setTimeout(() => {
                if (! self._scripts.hasOwnProperty(script.__name))
                    return;

                const components = self.app.systems.script._components;
                let i, scriptInstance, attributes;
                const scriptInstances = [ ];
                const scriptInstancesInitialized = [ ];

                for (i = 0; i < components.length; i++) {
                    // check if awaiting for script
                    if (components[i]._scriptsIndex[script.__name] && components[i]._scriptsIndex[script.__name].awaiting) {
                        if (components[i]._scriptsData && components[i]._scriptsData[script.__name])
                            attributes = components[i]._scriptsData[script.__name].attributes;

                        scriptInstance = components[i].create(script.__name, {
                            preloading: true,
                            ind: components[i]._scriptsIndex[script.__name].ind,
                            attributes
                        });

                        if (scriptInstance)
                            scriptInstances.push(scriptInstance);
                    }
                }

                // initialize attributes
                for (i = 0; i < scriptInstances.length; i++)
                    scriptInstances[i].__initializeAttributes();

                // call initialize()
                for (i = 0; i < scriptInstances.length; i++) {
                    if (scriptInstances[i].enabled) {
                        scriptInstances[i]._initialized = true;

                        scriptInstancesInitialized.push(scriptInstances[i]);

                        if (scriptInstances[i].initialize)
                            scriptInstances[i].initialize();
                    }
                }

                // call postInitialize()
                for (i = 0; i < scriptInstancesInitialized.length; i++) {
                    if (! scriptInstancesInitialized[i].enabled || scriptInstancesInitialized[i]._postInitialized) {
                        continue;
                    }

                    scriptInstancesInitialized[i]._postInitialized = true;

                    if (scriptInstancesInitialized[i].postInitialize)
                        scriptInstancesInitialized[i].postInitialize();
                }
            });

            return true;
        }

        /**
         * @function
         * @name pc.ScriptRegistry#remove
         * @description Remove {@link ScriptType}.
         * @param {String} name Name of a {@link ScriptType} to remove
         * @returns {Boolean} True if removed or False if already not in registry
         * @example
         * app.scripts.remove('playerController');
         */
        remove(script) {
            let name = script;

            if (typeof(script) === 'function')
                name = script.__name;

            if (! this._scripts.hasOwnProperty(name))
                return false;

            const item = this._scripts[name];
            delete this._scripts[name];

            const ind = this._list.indexOf(item);
            this._list.splice(ind, 1);

            this.fire('remove', name, item);
            this.fire(`remove:${name}`, item);

            return true;
        }

        /**
         * @function
         * @name pc.ScriptRegistry#get
         * @description Get {@link ScriptType} by name.
         * @param {String} name Name of a {@link ScriptType}.
         * @returns {ScriptType} The Script Type if it exists in the registry or null otherwise.
         * @example
         * var PlayerController = app.scripts.get('playerController');
         */
        get(name) {
            return this._scripts[name] || null;
        }

        /**
         * @function
         * @name pc.ScriptRegistry#has
         * @description Check if a {@link ScriptType} with the specified name is in the registry.
         * @param {String} name Name of a {@link ScriptType}
         * @returns {Boolean} True if {@link ScriptType} is in registry
         * @example
         * if (app.scripts.has('playerController')) {
         *     // playerController is in pc.ScriptRegistry
         * }
         */
        has(name) {
            return this._scripts.hasOwnProperty(name);
        }

        /**
         * @function
         * @name pc.ScriptRegistry#list
         * @description Get list of all {@link ScriptType}s from registry.
         * @returns {ScriptType[]} list of all {@link ScriptType}s in registry
         * @example
         * // logs array of all Script Type names available in registry
         * console.log(app.scripts.list().map(function(o) {
         *     return o.name;
         * }));
         */
        list() {
            return this._list;
        }
    }


    return {
        ScriptRegistry
    };
})());
