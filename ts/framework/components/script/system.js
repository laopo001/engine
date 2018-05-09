pc.extend(pc, (() => {
    const _schema = [ 'enabled' ];

    /**
     * @name pc.ScriptComponentSystem
     * @description Create a new ScriptComponentSystem
     * @class Allows scripts to be attached to an Entity and executed
     * @param {pc.Application} app The application
     * @extends pc.ComponentSystem
     */

    let ScriptComponentSystem = function ScriptComponentSystem(app) {
        this.id = 'script';
        this.app = app;
        app.systems.add(this.id, this);

        this.ComponentType = pc.ScriptComponent;
        this.DataType = pc.ScriptComponentData;

        this.schema = _schema;

        // list of all entities script components
        this._components = [ ];

        this.preloading = true;

        this.on('beforeremove', this._onBeforeRemove, this);
        pc.ComponentSystem.on('initialize', this._onInitialize, this);
        pc.ComponentSystem.on('postInitialize', this._onPostInitialize, this);
        pc.ComponentSystem.on('update', this._onUpdate, this);
        pc.ComponentSystem.on('postUpdate', this._onPostUpdate, this);
    };
    ScriptComponentSystem = pc.inherits(ScriptComponentSystem, pc.ComponentSystem);

    pc.Component._buildAccessors(pc.ScriptComponent.prototype, _schema);

    pc.extend(ScriptComponentSystem.prototype, {
        initializeComponentData(component, data, properties) {
            this._components.push(component);

            component.enabled = data.hasOwnProperty('enabled') ? !!data.enabled : true;

            if (data.hasOwnProperty('order') && data.hasOwnProperty('scripts')) {
                component._scriptsData = data.scripts;

                for (let i = 0; i < data.order.length; i++) {
                    component.create(data.order[i], {
                        enabled: data.scripts[data.order[i]].enabled,
                        attributes: data.scripts[data.order[i]].attributes,
                        preloading: this.preloading
                    });
                }
            }
        },

        cloneComponent({script}, clone) {
            let i, key;
            const order = [ ];
            const scripts = { };

            for (i = 0; i < script._scripts.length; i++) {
                const scriptInstance = script._scripts[i];
                const scriptName = scriptInstance.__scriptType.__name;
                order.push(scriptName);

                const attributes = { };
                for (key in scriptInstance.__attributes)
                    attributes[key] = scriptInstance.__attributes[key];

                scripts[scriptName] = {
                    enabled: scriptInstance._enabled,
                    attributes
                };
            }

            for (key in script._scriptsIndex) {
                if (key.awayting)
                    order.splice(key.ind, 0, key);
            }

            const data = {
                enabled: script.enabled,
                order,
                scripts
            };

            return this.addComponent(clone, data);
        },

        _callComponentMethod(name, dt) {
            for (let i = 0; i < this._components.length; i++) {
                if (! this._components[i].entity.enabled || ! this._components[i].enabled)
                    continue;

                this._components[i][name](dt);
            }
        },

        _onInitialize() {
            this.preloading = false;

            // initialize attributes
            for (let i = 0; i < this._components.length; i++)
                this._components[i]._onInitializeAttributes();

            this._callComponentMethod('_onInitialize');
        },
        _onPostInitialize() {
            this._callComponentMethod('_onPostInitialize');
        },
        _onUpdate(dt) {
            this._callComponentMethod('_onUpdate', dt);
        },
        _onPostUpdate(dt) {
            this._callComponentMethod('_onPostUpdate', dt);
        },

        _onBeforeRemove(entity, component) {
            const ind = this._components.indexOf(component);
            if (ind === -1) return;

            component._onBeforeRemove();

            this._components.splice(ind, 1);
        }
    });

    return {
        ScriptComponentSystem
    };
})());
