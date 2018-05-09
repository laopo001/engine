pc.extend(pc, (() => {
    const _schema = [
        'enabled',
        'type',
        'halfExtents',
        'radius',
        'axis',
        'height',
        'asset',
        'shape',
        'model'
    ];

    /**
     * @constructor
     * @name pc.CollisionComponentSystem
     * @classdesc Manages creation of {@link pc.CollisionComponent}s.
     * @description Creates a new CollisionComponentSystem.
     * @param {pc.Application} app The running {pc.Application}
     * @extends pc.ComponentSystem
     */
    let CollisionComponentSystem = function CollisionComponentSystem (app) {
        this.id = "collision";
        this.description = "Specifies a collision volume.";
        app.systems.add(this.id, this);

        this.ComponentType = pc.CollisionComponent;
        this.DataType = pc.CollisionComponentData;

        this.schema = _schema;

        this.implementations = { };

        this.on('remove', this.onRemove, this);

        pc.ComponentSystem.on('update', this.onUpdate, this);
    };

    CollisionComponentSystem = pc.inherits(CollisionComponentSystem, pc.ComponentSystem);

    pc.Component._buildAccessors(pc.CollisionComponent.prototype, _schema);

    CollisionComponentSystem.prototype = pc.extend(CollisionComponentSystem.prototype, {
        onLibraryLoaded() {
            if (typeof Ammo !== 'undefined') {
                //
            } else {
                // Unbind the update function if we haven't loaded Ammo by now
                pc.ComponentSystem.off('update', this.onUpdate, this);
            }
        },

        initializeComponentData(component, _data, properties) {
            // duplicate the input data because we are modifying it
            let idx;
            const data = {};
            properties = ['type', 'halfExtents', 'radius', 'axis', 'height', 'shape', 'model', 'asset', 'enabled'];
            properties.forEach(prop => {
                data[prop] = _data[prop];
            });

            // asset takes priority over model
            // but they are both trying to change the mesh
            // so remove one of them to avoid conflicts
            if (_data.hasOwnProperty('asset')) {
                idx = properties.indexOf('model');
                if (idx !== -1) {
                    properties.splice(idx, 1);
                }
            } else if (_data.hasOwnProperty('model')) {
                idx = properties.indexOf('asset');
                if (idx !== -1) {
                    properties.splice(idx, 1);
                }
            }

            if (!data.type) {
                data.type = component.data.type;
            }
            component.data.type = data.type;

            if (data.halfExtents && pc.type(data.halfExtents) === 'array') {
                data.halfExtents = new pc.Vec3(data.halfExtents[0], data.halfExtents[1], data.halfExtents[2]);
            }

            const impl = this._createImplementation(data.type);
            impl.beforeInitialize(component, data);

            CollisionComponentSystem._super.initializeComponentData.call(this.system, component, data, properties);

            impl.afterInitialize(component, data);
        },

        // Creates an implementation based on the collision type and caches it
        // in an internal implementations structure, before returning it.
        _createImplementation(type) {
            if (this.implementations[type] === undefined) {
                let impl;
                switch (type) {
                    case 'box':
                        impl = new CollisionBoxSystemImpl(this);
                        break;
                    case 'sphere':
                        impl = new CollisionSphereSystemImpl(this);
                        break;
                    case 'capsule':
                        impl = new CollisionCapsuleSystemImpl(this);
                        break;
                    case 'cylinder':
                        impl = new CollisionCylinderSystemImpl(this);
                        break;
                    case 'mesh':
                        impl = new CollisionMeshSystemImpl(this);
                        break;
                    default:
                        throw `Invalid collision system type: ${type}`;
                }
                this.implementations[type] = impl;
            }

            return this.implementations[type];
        },

        // Gets an existing implementation for the specified entity
        _getImplementation({collision}) {
            return this.implementations[collision.data.type];
        },

        cloneComponent(entity, clone) {
            return this._getImplementation(entity).clone(entity, clone);
        },

        onRemove(entity, data) {
            this.implementations[data.type].remove(entity, data);
        },

        onUpdate(dt) {
            let id, entity, data;
            const components = this.store;

            for (id in components) {
                entity = components[id].entity;
                data = components[id].data;

                if (data.enabled && entity.enabled) {
                    if (!entity.rigidbody && entity.trigger) {
                        entity.trigger.syncEntityToBody();
                    }
                }
            }
        },

        onTransformChanged(component, position, rotation, scale) {
            this.implementations[component.data.type].updateTransform(component, position, rotation, scale);
        },

        // Destroys the previous collision type and creates a new one based on the new type provided
        changeType(component, previousType, newType) {
            this.implementations[previousType].remove( component.entity, component.data);
            this._createImplementation(newType).reset(component, component.data);
        },

        // Recreates rigid bodies or triggers for the specified component
        recreatePhysicalShapes(component) {
            this.implementations[component.data.type].recreatePhysicalShapes(component);
        }
    });

    // Collision system implementations
    class CollisionSystemImpl {
        constructor(system) {
            this.system = system;
        }

        // Called before the call to system.super.initializeComponentData is made
        beforeInitialize({entity}, data) {
            data.shape = this.createPhysicalShape(entity, data);

            data.model = new pc.Model();
            data.model.graph = new pc.GraphNode();
        }

        // Called after the call to system.super.initializeComponentData is made
        afterInitialize(component, data) {
            this.recreatePhysicalShapes(component);
            component.data.initialized = true;
        }

        // Called when a collision component changes type in order to recreate debug and physical shapes
        reset(component, data) {
            this.beforeInitialize(component, data);
            this.afterInitialize(component, data);
        }

        // Re-creates rigid bodies / triggers
        recreatePhysicalShapes(component) {
            const entity = component.entity;
            const data = component.data;

            if (typeof Ammo !== 'undefined') {
                data.shape = this.createPhysicalShape(component.entity, data);
                if (entity.rigidbody) {
                    entity.rigidbody.disableSimulation();
                    entity.rigidbody.createBody();
                } else {
                    if (!entity.trigger) {
                        entity.trigger = new pc.Trigger(this.system.app, component, data);
                    } else {
                        entity.trigger.initialize(data);
                    }
                }
            }
        }

        // Creates a physical shape for the collision. This consists
        // of the actual shape that will be used for the rigid bodies / triggers of
        // the collision.
        createPhysicalShape(entity, data) {
            return undefined;
        }

        updateTransform({entity}, position, rotation, scale) {
            if (entity.trigger) {
                entity.trigger.syncEntityToBody();
            }
        }

        // Called when the collision is removed
        remove({rigidbody, trigger}, {model}) {
            const app = this.system.app;
            if (rigidbody && rigidbody.body) {
                app.systems.rigidbody.removeBody(rigidbody.body);
                rigidbody.disableSimulation();
            }

            if (trigger) {
                trigger.destroy();
                delete trigger;
            }

            if (app.scene.containsModel(model)) {
                app.root.removeChild(model.graph);
                app.scene.removeModel(model);
            }
        }

        // Called when the collision is cloned to another entity
        clone({_guid}, clone) {
            const src = this.system.dataStore[_guid];

            const data = {
                enabled: src.data.enabled,
                type: src.data.type,
                halfExtents: [src.data.halfExtents.x, src.data.halfExtents.y, src.data.halfExtents.z],
                radius: src.data.radius,
                axis: src.data.axis,
                height: src.data.height,
                asset: src.data.asset,
                model: src.data.model
            };

            return this.system.addComponent(clone, data);
        }
    }

    // Box Collision System
    var CollisionBoxSystemImpl = system => {};

    CollisionBoxSystemImpl = pc.inherits(CollisionBoxSystemImpl, CollisionSystemImpl);

    CollisionBoxSystemImpl.prototype = pc.extend(CollisionBoxSystemImpl.prototype, {
        createPhysicalShape(entity, {halfExtents}) {
            if (typeof Ammo !== 'undefined') {
                const he = halfExtents;
                const ammoHe = new Ammo.btVector3(he ? he.x : 0.5, he ? he.y : 0.5, he ? he.z : 0.5);
                return new Ammo.btBoxShape(ammoHe);
            } else {
                return undefined;
            }
        }
    });

    // Sphere Collision System
    var CollisionSphereSystemImpl = system => {};

    CollisionSphereSystemImpl = pc.inherits(CollisionSphereSystemImpl, CollisionSystemImpl);

    CollisionSphereSystemImpl.prototype = pc.extend(CollisionSphereSystemImpl.prototype, {
        createPhysicalShape(entity, {radius}) {
            if (typeof Ammo !== 'undefined') {
                return new Ammo.btSphereShape(radius);
            } else {
                return undefined;
            }
        }
    });

    // Capsule Collision System
    var CollisionCapsuleSystemImpl = system => {};

    CollisionCapsuleSystemImpl = pc.inherits(CollisionCapsuleSystemImpl, CollisionSystemImpl);

    CollisionCapsuleSystemImpl.prototype = pc.extend(CollisionCapsuleSystemImpl.prototype, {
        createPhysicalShape(entity, data) {
            let shape = null;
            const axis = (data.axis !== undefined) ? data.axis : 1;
            const radius = data.radius || 0.5;
            const height = Math.max((data.height || 2) - 2 * radius, 0);

            if (typeof Ammo !== 'undefined') {
                switch (axis) {
                    case 0:
                        shape = new Ammo.btCapsuleShapeX(radius, height);
                        break;
                    case 1:
                        shape = new Ammo.btCapsuleShape(radius, height);
                        break;
                    case 2:
                        shape = new Ammo.btCapsuleShapeZ(radius, height);
                        break;
                }
            }
            return shape;
        }
    });

    // Cylinder Collision System
    var CollisionCylinderSystemImpl = system => {};

    CollisionCylinderSystemImpl = pc.inherits(CollisionCylinderSystemImpl, CollisionSystemImpl);

    CollisionCylinderSystemImpl.prototype = pc.extend(CollisionCylinderSystemImpl.prototype, {
        createPhysicalShape(entity, data) {
            let halfExtents = null;
            let shape = null;
            const axis = (data.axis !== undefined) ? data.axis : 1;
            const radius = (data.radius !== undefined) ? data.radius : 0.5;
            const height = (data.height !== undefined) ? data.height : 1;

            if (typeof Ammo !== 'undefined') {
                switch (axis) {
                    case 0:
                        halfExtents = new Ammo.btVector3(height * 0.5, radius, radius);
                        shape = new Ammo.btCylinderShapeX(halfExtents);
                        break;
                    case 1:
                        halfExtents = new Ammo.btVector3(radius, height * 0.5, radius);
                        shape = new Ammo.btCylinderShape(halfExtents);
                        break;
                    case 2:
                        halfExtents = new Ammo.btVector3(radius, radius, height * 0.5);
                        shape = new Ammo.btCylinderShapeZ(halfExtents);
                        break;
                }
            }
            return shape;
        }
    });

    // Mesh Collision System
    var CollisionMeshSystemImpl = system => { };

    CollisionMeshSystemImpl = pc.inherits(CollisionMeshSystemImpl, CollisionSystemImpl);

    CollisionMeshSystemImpl.prototype = pc.extend(CollisionMeshSystemImpl.prototype, {
        // override for the mesh implementation because the asset model needs
        // special handling
        beforeInitialize(component, data) {},

        createPhysicalShape(entity, data) {
            if (typeof Ammo !== 'undefined' && data.model) {
                const model = data.model;
                const shape = new Ammo.btCompoundShape();

                let i, j;
                for (i = 0; i < model.meshInstances.length; i++) {
                    const meshInstance = model.meshInstances[i];
                    const mesh = meshInstance.mesh;
                    const ib = mesh.indexBuffer[pc.RENDERSTYLE_SOLID];
                    const vb = mesh.vertexBuffer;

                    const format = vb.getFormat();
                    const stride = format.size / 4;
                    let positions;
                    for (j = 0; j < format.elements.length; j++) {
                        const element = format.elements[j];
                        if (element.name === pc.SEMANTIC_POSITION) {
                            positions = new Float32Array(vb.lock(), element.offset);
                        }
                    }

                    const indices = new Uint16Array(ib.lock());
                    const numTriangles = mesh.primitive[0].count / 3;

                    const v1 = new Ammo.btVector3();
                    const v2 = new Ammo.btVector3();
                    const v3 = new Ammo.btVector3();
                    let i1, i2, i3;

                    const base = mesh.primitive[0].base;
                    const triMesh = new Ammo.btTriangleMesh();
                    for (j = 0; j < numTriangles; j++) {
                        i1 = indices[base+j*3] * stride;
                        i2 = indices[base+j*3+1] * stride;
                        i3 = indices[base+j*3+2] * stride;
                        v1.setValue(positions[i1], positions[i1 + 1], positions[i1 + 2]);
                        v2.setValue(positions[i2], positions[i2 + 1], positions[i2 + 2]);
                        v3.setValue(positions[i3], positions[i3 + 1], positions[i3 + 2]);
                        triMesh.addTriangle(v1, v2, v3, true);
                    }

                    const useQuantizedAabbCompression = true;
                    const triMeshShape = new Ammo.btBvhTriangleMeshShape(triMesh, useQuantizedAabbCompression);

                    const wtm = meshInstance.node.getWorldTransform();
                    const scl = wtm.getScale();
                    triMeshShape.setLocalScaling(new Ammo.btVector3(scl.x, scl.y, scl.z));

                    const pos = meshInstance.node.getPosition();
                    const rot = meshInstance.node.getRotation();

                    const transform = new Ammo.btTransform();
                    transform.setIdentity();
                    transform.getOrigin().setValue(pos.x, pos.y, pos.z);

                    const ammoQuat = new Ammo.btQuaternion();
                    ammoQuat.setValue(rot.x, rot.y, rot.z, rot.w);
                    transform.setRotation(ammoQuat);

                    shape.addChildShape(transform, triMeshShape);
                }

                const entityTransform = entity.getWorldTransform();
                const scale = entityTransform.getScale();
                const vec = new Ammo.btVector3();
                vec.setValue(scale.x, scale.y, scale.z);
                shape.setLocalScaling(vec);

                return shape;
            } else {
                return undefined;
            }
        },

        recreatePhysicalShapes(component) {
            const data = component.data;

            if (data.asset !== null && component.enabled && component.entity.enabled) {
                this.loadModelAsset(component);
            } else {
                this.doRecreatePhysicalShape(component);
            }
        },

        loadModelAsset(component) {
            const self = this;
            const id = component.data.asset;
            const data = component.data;
            const assets = this.system.app.assets;

            const asset = assets.get(id);
            if (asset) {
                asset.ready(({resource}) => {
                    data.model = resource;
                    self.doRecreatePhysicalShape(component);
                });
                assets.load(asset);
            } else {
                assets.once(`add:${id}`, asset => {
                    asset.ready(({resource}) => {
                        data.model = resource;
                        self.doRecreatePhysicalShape(component);
                    });
                    assets.load(asset);
                });
            }
        },

        doRecreatePhysicalShape(component) {
            const entity = component.entity;
            const data = component.data;

            if (data.model) {
                if (data.shape) {
                    Ammo.destroy(data.shape);
                }

                data.shape = this.createPhysicalShape(entity, data);

                if (entity.rigidbody) {
                    entity.rigidbody.createBody();
                } else {
                    if (!entity.trigger) {
                        entity.trigger = new pc.Trigger(this.system.app, component, data);
                    } else {
                        entity.trigger.initialize(data);
                    }

                }
            } else {
                this.remove(entity, data);
            }

        },

        updateTransform(component, position, rotation, scale) {
            if (component.shape) {
                const entityTransform = component.entity.getWorldTransform();
                const worldScale = entityTransform.getScale();

                // if the scale changed then recreate the shape
                const previousScale = component.shape.getLocalScaling();
                if (worldScale.x !== previousScale.x() ||
                    worldScale.y !== previousScale.y() ||
                    worldScale.z !== previousScale.z() ) {
                    this.doRecreatePhysicalShape(component);
                }
            }

            CollisionMeshSystemImpl._super.updateTransform.call(this, component, position, rotation, scale);
        }
    });

    return {
        CollisionComponentSystem
    };
})());
