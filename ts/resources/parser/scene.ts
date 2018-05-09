pc.extend(pc, (() => {
    class SceneParser {
        constructor(app) {
            this._app = app;
        }

        parse(data) {
            const entities = {};
            let id, i;
            let parent = null;

            // instantiate entities
            for (id in data.entities) {
                entities[id] = this._createEntity(data.entities[id]);
                if (data.entities[id].parent === null) {
                    parent = entities[id];
                }
            }

            // put entities into hierarchy
            for (id in data.entities) {
                const l = data.entities[id].children.length;
                for (i = 0; i < l; i++) {
                    // pop resource id off the end of the array
                    const resource_id = data.entities[id].children[i];
                    if (entities[resource_id]) {
                        // push entity on the front of the array
                        entities[id].addChild(entities[resource_id]);
                    }
                }
            }

            this._openComponentData(parent, data.entities);

            return parent;
        }

        _createEntity(data) {
            const entity = new pc.Entity();

            const p = data.position;
            const r = data.rotation;
            const s = data.scale;

            entity.name = data.name;
            entity._guid = data.resource_id;
            entity.setLocalPosition(p[0], p[1], p[2]);
            entity.setLocalEulerAngles(r[0], r[1], r[2]);
            entity.setLocalScale(s[0], s[1], s[2]);
            entity._enabled = data.enabled !== undefined ? data.enabled : true;
            entity._enabledInHierarchy = entity._enabled;
            entity.template = data.template;

            if (data.tags) {
                for (let i = 0; i < data.tags.length; i++) {
                    entity.tags.add(data.tags[i]);
                }
            }

            if (data.labels) {
                data.labels.forEach(label => {
                    entity.addLabel(label);
                });
            }

            return entity;
        }

        _openComponentData(entity, entities) {
            // Create Components in order
            const systems = this._app.systems.list();
            let i;
            const len = systems.length;
            const edata = entities[entity._guid];
            for (i = 0; i < len; i++) {
                const componentData = edata.components[systems[i].id];
                if (componentData) {
                    this._app.systems[systems[i].id].addComponent(entity, componentData);
                }
            }

            // Open all children and add them to the node
            const length = edata.children.length;
            const children = entity._children;
            for (i = 0; i < length; i++) {
                children[i] = this._openComponentData(children[i], entities);
            }

            return entity;
        }
    }

    return {
        SceneParser
    };
})());
