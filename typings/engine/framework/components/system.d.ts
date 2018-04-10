declare namespace pc {
    /**
     * @name pc.ComponentSystem
     * @class Component Systems contain the logic and functionality to update all Components of a particular type
     * @param {pc.Application} app The running Application
     */
    class ComponentSystem extends pc.Events {

        /**
         * @function
         * @name pc.events.on
         * @description Attach an event handler to an event
         * @param {String} name Name of the event to bind the callback to
         * @param {Function} callback Function that is called when event is fired. Note the callback is limited to 8 arguments.
         * @param {Object} [scope] Object to use as 'this' when the event is fired, defaults to current this
         * @example
         * obj.on('test', function (a, b) {
         *     console.log(a + b);
         * });
         * obj.fire('test', 1, 2); // prints 3 to the console
         */
        static on(name: string, callback: (...args: any[]) => void, scope?: any): void;

        /**
         * @function
         * @name pc.events.off
         * @description Detach an event handler from an event. If callback is not provided then all callbacks are unbound from the event,
         * if scope is not provided then all events with the callback will be unbound.
         * @param {String} [name] Name of the event to unbind
         * @param {Function} [callback] Function to be unbound
         * @param {Object} [scope] Scope that was used as the this when the event is fired
         * @example
         * var handler = function () {
         * };
         * obj.on('test', handler);
         *
         * obj.off(); // Removes all events
         * obj.off('test'); // Removes all events called 'test'
         * obj.off('test', handler); // Removes all handler functions, called 'test'
         * obj.off('test', handler, this); // Removes all hander functions, called 'test' with scope this
         */
        static off(name: string, callback?: (...args: any[]) => void, scope?: any): void;

        /**
         * @function
         * @name pc.events.fire
         * @description Fire an event, all additional arguments are passed on to the event listener
         * @param {Object} name Name of event to fire
         * @param {*} [...] Arguments that are passed to the event handler
         * @example
         * obj.fire('test', 'This is the message');
         */
        static fire(name: string, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, arg6?: any, arg7?: any, arg8?: any): void;


        constructor(app: pc.Application)

        /**
         * @private
         * @field
         * @type Array
         * @name pc.ComponentSystem#store
         * @description The store where all {@link pc.ComponentData} objects are kept
         */
        private store: pc.ComponentData[];

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
        private addComponent(entity: pc.Entity, data: {}): pc.Component;

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
        private removeComponent(entity: pc.Entity): void;

        /**
         * @private
         * @function
         * @name pc.ComponentSystem#cloneComponent
         * @description Create a clone of component. This creates a copy all ComponentData variables.
         * @param {pc.Entity} entity The entity to clone the component from
         * @param {pc.Entity} clone The entity to clone the component into
         */
        private cloneComponent(entity: pc.Entity, clone: pc.Entity): pc.Component;

        /**
         * @private
         * @function
         * @name pc.ComponentSystem#initializeComponentData
         * @description Called during {@link pc.ComponentSystem#addComponent} to initialize the {@link pc.ComponentData} in the store
         * This can be overridden by derived Component Systems and either called by the derived System or replaced entirely
         */
        private initializeComponentData(component: pc.Component, data: {}, properties: {}): void;
    }
}
