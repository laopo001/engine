pc.extend(pc, (() => {
    let ammoRayStart, ammoRayEnd;

    const collisions = {};
    let frameCollisions = {};


    // DEPRECATED WARNINGS
    let WARNED_RAYCAST_CALLBACK = false;

    /**
     * @constructor
     * @name pc.RaycastResult
     * @classdesc Object holding the result of a successful raycast hit
     * @description Create a new RaycastResult
     * @param {pc.Entity} entity The entity that was hit
     * @param {pc.Vec3} point The point at which the ray hit the entity in world space
     * @param {pc.Vec3} normal The normal vector of the surface where the ray hit in world space.
     * @property {pc.Entity} entity The entity that was hit
     * @property {pc.Vec3} point The point at which the ray hit the entity in world space
     * @property {pc.Vec3} normal The normal vector of the surface where the ray hit in world space.
     */
    const RaycastResult = function RaycastResult(entity, point, normal) {
        this.entity = entity;
        this.point = point;
        this.normal = normal;
    };

    /**
     * @constructor
     * @name pc.SingleContactResult
     * @classdesc Object holding the result of a contact between two rigid bodies
     * @description Create a new SingleContactResult
     * @param {pc.Entity} a The first entity involved in the contact
     * @param {pc.Entity} b The second entity involved in the contact
     * @param {pc.ContactPoint} contactPoint The contact point between the two entities
     * @property {pc.Entity} a The first entity involved in the contact
     * @property {pc.Entity} b The second entity involved in the contact
     * @property {pc.Vec3} localPointA The point on Entity A where the contact occurred, relative to A
     * @property {pc.Vec3} localPointB The point on Entity B where the contact occurred, relative to B
     * @property {pc.Vec3} pointA The point on Entity A where the contact occurred, in world space
     * @property {pc.Vec3} pointB The point on Entity B where the contact occurred, in world space
     * @property {pc.Vec3} normal The normal vector of the contact on Entity B, in world space
     */
    const SingleContactResult = function SingleContactResult(a, b, contactPoint) {
        if (arguments.length === 0) {
            this.a = null;
            this.b = null;
            this.localPointA = new pc.Vec3();
            this.localPointB = new pc.Vec3();
            this.pointA = new pc.Vec3();
            this.pointB = new pc.Vec3();
            this.normal = new pc.Vec3();
        } else {
            this.a = a;
            this.b = b;
            this.localPointA = contactPoint.localPoint;
            this.localPointB = contactPoint.localPointOther;
            this.pointA = contactPoint.point;
            this.pointB = contactPoint.pointOther;
            this.normal = contactPoint.normal;
        }
    };

    /**
     * @constructor
     * @name pc.ContactPoint
     * @classdesc Object holding the result of a contact between two Entities.
     * @description Create a new ContactPoint
     * @param {pc.Vec3} localPoint The point on the entity where the contact occurred, relative to the entity
     * @param {pc.Vec3} localPointOther The point on the other entity where the contact occurred, relative to the other entity
     * @param {pc.Vec3} point The point on the entity where the contact occurred, in world space
     * @param {pc.Vec3} pointOther The point on the other entity where the contact occurred, in world space
     * @param {pc.Vec3} normal The normal vector of the contact on the other entity, in world space
     * @property {pc.Vec3} localPoint The point on the entity where the contact occurred, relative to the entity
     * @property {pc.Vec3} localPointOther The point on the other entity where the contact occurred, relative to the other entity
     * @property {pc.Vec3} point The point on the entity where the contact occurred, in world space
     * @property {pc.Vec3} pointOther The point on the other entity where the contact occurred, in world space
     * @property {pc.Vec3} normal The normal vector of the contact on the other entity, in world space
     */
    const ContactPoint = function ContactPoint(localPoint, localPointOther, point, pointOther, normal) {
        if (arguments.length === 0) {
            this.localPoint = new pc.Vec3();
            this.localPointOther = new pc.Vec3();
            this.point = new pc.Vec3();
            this.pointOther = new pc.Vec3();
            this.normal = new pc.Vec3();
        } else {
            this.localPoint = localPoint;
            this.localPointOther = localPointOther;
            this.point = point;
            this.pointOther = pointOther;
            this.normal = normal;
        }
    };

    /**
     * @constructor
     * @name pc.ContactResult
     * @classdesc Object holding the result of a contact between two Entities
     * @description Create a new ContactResult
     * @param {pc.Entity} other The entity that was involved in the contact with this entity
     * @param {pc.ContactPoint[]} contacts An array of ContactPoints with the other entity
     * @property {pc.Entity} other The entity that was involved in the contact with this entity
     * @property {pc.ContactPoint[]} contacts An array of ContactPoints with the other entity
     */
    const ContactResult = function ContactResult(other, contacts) {
        this.other = other;
        this.contacts = contacts;
    };

    // Events Documentation
    /**
    * @event
    * @name pc.RigidBodyComponentSystem#contact
    * @description Fired when a contact occurs between two rigid bodies
    * @param {pc.SingleContactResult} result Details of the contact between the two bodies
    */

    const _schema = [
        'enabled',
        'type',
        'mass',
        'linearDamping',
        'angularDamping',
        'linearFactor',
        'angularFactor',
        'friction',
        'restitution',
        'group',
        'mask',
        'body'
    ];

    /**
     * @constructor
     * @name pc.RigidBodyComponentSystem
     * @classdesc The RigidBodyComponentSystem maintains the dynamics world for simulating rigid bodies, it also controls global values for the world such as gravity.
     * Note: The RigidBodyComponentSystem is only valid if 3D Physics is enabled in your application. You can enable this in the application settings for your Depot.
     * @description Create a new RigidBodyComponentSystem
     * @param {pc.Application} app The Application
     * @extends pc.ComponentSystem
     */
    let RigidBodyComponentSystem = function RigidBodyComponentSystem (app) {
        this.id = 'rigidbody';
        this.description = "Adds the entity to the scene's physical simulation.";
        app.systems.add(this.id, this);
        this._stats = app.stats.frame;

        this.ComponentType = pc.RigidBodyComponent;
        this.DataType = pc.RigidBodyComponentData;

        this.contactPointPool = new pc.AllocatePool(ContactPoint, 1);
        this.contactResultPool = new pc.AllocatePool(ContactResult, 1);
        this.singleContactResultPool = new pc.AllocatePool(SingleContactResult, 1);

        this.schema = _schema;

        this.maxSubSteps = 10;
        this.fixedTimeStep = 1/60;

        this.on('remove', this.onRemove, this);
    };
    RigidBodyComponentSystem = pc.inherits(RigidBodyComponentSystem, pc.ComponentSystem);

    pc.Component._buildAccessors(pc.RigidBodyComponent.prototype, _schema);

    pc.extend(RigidBodyComponentSystem.prototype, {
        onLibraryLoaded() {
            // Create the Ammo physics world
            if (typeof Ammo !== 'undefined') {
                const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
                const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
                const overlappingPairCache = new Ammo.btDbvtBroadphase();
                const solver = new Ammo.btSequentialImpulseConstraintSolver();
                this.dynamicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);

                this._ammoGravity = new Ammo.btVector3(0, -9.82, 0);
                this.dynamicsWorld.setGravity(this._ammoGravity);

                // Lazily create temp vars
                ammoRayStart = new Ammo.btVector3();
                ammoRayEnd = new Ammo.btVector3();
                pc.ComponentSystem.on('update', this.onUpdate, this);
            } else {
                // Unbind the update function if we haven't loaded Ammo by now
                pc.ComponentSystem.off('update', this.onUpdate, this);
            }
        },

        initializeComponentData(component, _data, properties) {
            properties = ['enabled', 'mass', 'linearDamping', 'angularDamping', 'linearFactor', 'angularFactor', 'friction', 'restitution', 'type', 'group', 'mask'];

            // duplicate the input data because we are modifying it
            const data = {};
            properties.forEach(prop => {
                data[prop] = _data[prop];
            });

            // backwards compatibility
            if (_data.bodyType) {
                data.type = _data.bodyType;
                console.warn("WARNING: rigidbody.bodyType: Property is deprecated. Use type instead.");
            }

            if (data.linearFactor && pc.type(data.linearFactor) === 'array') {
                data.linearFactor = new pc.Vec3(data.linearFactor[0], data.linearFactor[1], data.linearFactor[2]);
            }
            if (data.angularFactor && pc.type(data.angularFactor) === 'array') {
                data.angularFactor = new pc.Vec3(data.angularFactor[0], data.angularFactor[1], data.angularFactor[2]);
            }

            RigidBodyComponentSystem._super.initializeComponentData.call(this, component, data, properties);
        },

        cloneComponent({rigidbody}, clone) {
            // create new data block for clone
            const data = {
                enabled: rigidbody.enabled,
                mass: rigidbody.mass,
                linearDamping: rigidbody.linearDamping,
                angularDamping: rigidbody.angularDamping,
                linearFactor: [rigidbody.linearFactor.x, rigidbody.linearFactor.y, rigidbody.linearFactor.z],
                angularFactor: [rigidbody.angularFactor.x, rigidbody.angularFactor.y, rigidbody.angularFactor.z],
                friction: rigidbody.friction,
                restitution: rigidbody.restitution,
                type: rigidbody.type,
                group: rigidbody.group,
                mask: rigidbody.mask
            };

            this.addComponent(clone, data);
        },

        onRemove(entity, data) {
            if (data.body) {
                this.removeBody(data.body);
                Ammo.destroy(data.body);
            }

            data.body = null;
        },

        addBody(body, group, mask) {
            if (group !== undefined && mask !== undefined) {
                this.dynamicsWorld.addRigidBody(body, group, mask);
            } else {
                this.dynamicsWorld.addRigidBody(body);
            }

            return body;
        },

        removeBody(body) {
            this.dynamicsWorld.removeRigidBody(body);
        },

        addConstraint(constraint) {
            this.dynamicsWorld.addConstraint(constraint);
            return constraint;
        },

        removeConstraint(constraint) {
            this.dynamicsWorld.removeConstraint(constraint);
        },

        /**
         * @function
         * @name pc.RigidBodyComponentSystem#setGravity
         * @description Set the gravity vector for the 3D physics world
         * @param {Number} x The x-component of the gravity vector
         * @param {Number} y The y-component of the gravity vector
         * @param {Number} z The z-component of the gravity vector
         */
        /**
         * @function
         * @name pc.RigidBodyComponentSystem#setGravity^2
         * @description Set the gravity vector for the 3D physics world
         * @param {pc.Vec3} gravity The gravity vector to use for the 3D physics world.
         */
        setGravity(...args) {
            let x, y, z;
            if (args.length === 1) {
                x = args[0].x;
                y = args[0].y;
                z = args[0].z;
            } else {
                x = args[0];
                y = args[1];
                z = args[2];
            }
            this._ammoGravity.setValue(x, y, z);
            this.dynamicsWorld.setGravity(this._ammoGravity);
        },

        /**
         * @function
         * @name pc.RigidBodyComponentSystem#raycastFirst
         * @description Raycast the world and return the first entity the ray hits. Fire a ray into the world from start to end,
         * if the ray hits an entity with a collision component, it returns a {@link pc.RaycastResult}, otherwise returns null.
         * @param {pc.Vec3} start The world space point where the ray starts
         * @param {pc.Vec3} end The world space point where the ray ends
         * @returns {pc.RaycastResult} The result of the raycasting or null if there was no hit.
         */
        raycastFirst({x, y, z}, {x, y, z}, callback /*callback is deprecated*/) {
            let result = null;

            ammoRayStart.setValue(x, y, z);
            ammoRayEnd.setValue(x, y, z);
            const rayCallback = new Ammo.ClosestRayResultCallback(ammoRayStart, ammoRayEnd);

            this.dynamicsWorld.rayTest(ammoRayStart, ammoRayEnd, rayCallback);
            if (rayCallback.hasHit()) {
                const collisionObj = rayCallback.get_m_collisionObject();
                const body = Ammo.castObject(collisionObj, Ammo.btRigidBody);
                if (body) {
                    const point = rayCallback.get_m_hitPointWorld();
                    const normal = rayCallback.get_m_hitNormalWorld();

                    result = new RaycastResult(
                        body.entity,
                        new pc.Vec3(point.x(), point.y(), point.z()),
                        new pc.Vec3(normal.x(), normal.y(), normal.z())
                    );

                    // keeping for backwards compatibility
                    if (callback) {
                        callback(result);

                        if (! WARNED_RAYCAST_CALLBACK) {
                            console.warn('[DEPRECATED]: pc.RigidBodyComponentSystem#rayCastFirst no longer requires a callback. The result of the raycast is returned by the function instead.');
                            WARNED_RAYCAST_CALLBACK = true;
                        }
                    }
                }
            }

            Ammo.destroy(rayCallback);

            return result;
        },

        /**
        * @private
        * @function
        * @name pc.RigidBodyComponentSystem#_storeCollision
        * @description Stores a collision between the entity and other in the contacts map and returns true if it is a new collision
        * @param {pc.Entity} entity The entity
        * @param {pc.Entity} other The entity that collides with the first entity
        * @returns {Boolean} true if this is a new collision, false otherwise.
        */
        _storeCollision(entity, other) {
            let isNewCollision = false;
            const guid = entity._guid;

            collisions[guid] = collisions[guid] || {others: [], entity};

            if (!collisions[guid].others.includes(other)) {
                collisions[guid].others.push(other);
                isNewCollision = true;
            }

            frameCollisions[guid] = frameCollisions[guid] || {others: [], entity};
            frameCollisions[guid].others.push(other);

            return isNewCollision;
        },

        _createContactPointFromAmmo(contactPoint) {
            const contact = this.contactPointPool.allocate();

            contact.localPoint.set(contactPoint.get_m_localPointA().x(), contactPoint.get_m_localPointA().y(), contactPoint.get_m_localPointA().z());
            contact.localPointOther.set(contactPoint.get_m_localPointB().x(), contactPoint.get_m_localPointB().y(), contactPoint.get_m_localPointB().z());
            contact.point.set(contactPoint.getPositionWorldOnA().x(), contactPoint.getPositionWorldOnA().y(), contactPoint.getPositionWorldOnA().z());
            contact.pointOther.set(contactPoint.getPositionWorldOnB().x(), contactPoint.getPositionWorldOnB().y(), contactPoint.getPositionWorldOnB().z());
            contact.normal.set(contactPoint.get_m_normalWorldOnB().x(), contactPoint.get_m_normalWorldOnB().y(), contactPoint.get_m_normalWorldOnB().z());

            return contact;
        },

        _createReverseContactPointFromAmmo(contactPoint) {
            const contact = this.contactPointPool.allocate();

            contact.localPointOther.set(contactPoint.get_m_localPointA().x(), contactPoint.get_m_localPointA().y(), contactPoint.get_m_localPointA().z());
            contact.localPoint.set(contactPoint.get_m_localPointB().x(), contactPoint.get_m_localPointB().y(), contactPoint.get_m_localPointB().z());
            contact.pointOther.set(contactPoint.getPositionWorldOnA().x(), contactPoint.getPositionWorldOnA().y(), contactPoint.getPositionWorldOnA().z());
            contact.point.set(contactPoint.getPositionWorldOnB().x(), contactPoint.getPositionWorldOnB().y(), contactPoint.getPositionWorldOnB().z());
            contact.normal.set(contactPoint.get_m_normalWorldOnB().x(), contactPoint.get_m_normalWorldOnB().y(), contactPoint.get_m_normalWorldOnB().z());
            return contact;
        },

        _createSingleContactResult(a, b, contactPoint) {
            const result = this.singleContactResultPool.allocate();

            result.a = a;
            result.b = b;
            result.localPointA = contactPoint.localPoint;
            result.localPointB = contactPoint.localPointOther;
            result.pointA = contactPoint.point;
            result.pointB = contactPoint.pointOther;
            result.normal = contactPoint.normal;

            return result;
        },

        _createContactResult(other, contacts) {
            const result = this.contactResultPool.allocate();
            result.other = other;
            result.contacts = contacts;
            return result;
        },

        /**
        * @private
        * @function
        * @name pc.RigidBodyComponentSystem#_cleanOldCollisions
        * @description Removes collisions that no longer exist from the collisions list and fires collisionend events to the
        * related entities.
        */
        _cleanOldCollisions() {
            for (const guid in collisions) {
                if (collisions.hasOwnProperty(guid)) {
                    const entity = collisions[guid].entity;
                    const entityCollision = entity.collision;
                    const others = collisions[guid].others;
                    const length = others.length;
                    let i=length;
                    while (i--) {
                        const other = others[i];
                        // if the contact does not exist in the current frame collisions then fire event
                        if (!frameCollisions[guid] || !frameCollisions[guid].others.includes(other)) {
                            // remove from others list
                            others.splice(i, 1);

                            if (entityCollision && other.collision) {
                                if (entity.rigidbody && other.rigidbody) {
                                    // if both are rigidbodies fire collision end
                                    entityCollision.fire("collisionend", other);
                                } else if (entity.trigger) {
                                    // if entity is a trigger
                                    entityCollision.fire("triggerleave", other);
                                }
                            }
                        }
                    }

                    if (others.length === 0) {
                        delete collisions[guid];
                    }
                }
            }
        },

        /**
        * @private
        * @name pc.RigidBodyComponentSystem#raycast
        * @description Raycast the world and return all entities the ray hits. Fire a ray into the world from start to end,
        * if the ray hits an entity with a rigidbody component, the callback function is called along with a {@link pc.RaycastResult}.
        * @param {pc.Vec3} start The world space point where the ray starts
        * @param {pc.Vec3} end The world space point where the ray ends
        * @param {Function} callback Function called if ray hits another body. Passed a single argument: a {@link pc.RaycastResult} object
        */
        // raycast: function (start, end, callback) {
        //     var rayFrom = new Ammo.btVector3(start.x, start.y, start.z);
        //     var rayTo = new Ammo.btVector3(end.x, end.y, end.z);
        //     var rayCallback = new Ammo.AllHitsRayResultCallback(rayFrom, rayTo);

        //     this.dynamicsWorld.rayTest(rayFrom, rayTo, rayCallback);
        //     if (rayCallback.hasHit()) {
        //         var body = Module.castObject(rayCallback.get_m_collisionObject(), Ammo.btRigidBody);
        //         var point = rayCallback.get_m_hitPointWorld();
        //         var normal = rayCallback.get_m_hitNormalWorld();

        //         if (body) {
        //             callback(new RaycastResult(
        //                             body.entity,
        //                             new pc.Vec3(point.x(), point.y(), point.z()),
        //                             new pc.Vec3(normal.x(), normal.y(), normal.z())
        //                         )
        //                     );
        //         }
        //     }

        //     Ammo.destroy(rayFrom);
        //     Ammo.destroy(rayTo);
        //     Ammo.destroy(rayCallback);
        // },

        onUpdate(dt) {
            // #ifdef PROFILER
            this._stats.physicsStart = pc.now();
            // #endif

            // Update the transforms of all bodies
            this.dynamicsWorld.stepSimulation(dt, this.maxSubSteps, this.fixedTimeStep);

            // Update the transforms of all entities referencing a body
            const components = this.store;
            for (const id in components) {
                if (components.hasOwnProperty(id)) {
                    const entity = components[id].entity;
                    const componentData = components[id].data;
                    if (componentData.body && componentData.body.isActive() && componentData.enabled && entity.enabled) {
                        if (componentData.type === pc.BODYTYPE_DYNAMIC) {
                            entity.rigidbody.syncBodyToEntity();
                        } else if (componentData.type === pc.BODYTYPE_KINEMATIC) {
                            entity.rigidbody._updateKinematic(dt);
                        }
                    }

                }
            }

            // Check for collisions and fire callbacks
            const dispatcher = this.dynamicsWorld.getDispatcher();
            const numManifolds = dispatcher.getNumManifolds();
            let i, j;

            frameCollisions = {};

            // loop through the all contacts and fire events
            for (i = 0; i < numManifolds; i++) {
                const manifold = dispatcher.getManifoldByIndexInternal(i);
                const body0 = manifold.getBody0();
                const body1 = manifold.getBody1();
                const wb0 = Ammo.castObject(body0, Ammo.btRigidBody);
                const wb1 = Ammo.castObject(body1, Ammo.btRigidBody);
                const e0 = wb0.entity;
                const e1 = wb1.entity;

                // check if entity is null - TODO: investigate when this happens
                if (!e0 || !e1) {
                    continue;
                }

                const flags0 = body0.getCollisionFlags();
                const flags1 = body1.getCollisionFlags();

                const numContacts = manifold.getNumContacts();
                const forwardContacts = [];
                const reverseContacts = [];
                let newCollision, e0Events, e1Events;

                if (numContacts > 0) {
                    // don't fire contact events for triggers
                    if ((flags0 & pc.BODYFLAG_NORESPONSE_OBJECT) ||
                        (flags1 & pc.BODYFLAG_NORESPONSE_OBJECT)) {

                        e0Events = e0.collision ? e0.collision.hasEvent("triggerenter") || e0.collision.hasEvent("triggerleave") : false;
                        e1Events = e1.collision ? e1.collision.hasEvent("triggerenter") || e1.collision.hasEvent("triggerleave") : false;

                        if (e0Events) {
                            // fire triggerenter events
                            newCollision = this._storeCollision(e0, e1);
                            if (newCollision) {
                                if (e0.collision && !(flags1 & pc.BODYFLAG_NORESPONSE_OBJECT)) {
                                    e0.collision.fire("triggerenter", e1);
                                }
                            }
                        }

                        if (e1Events) {
                            newCollision = this._storeCollision(e1, e0);
                            if (newCollision) {
                                if (e1.collision && !(flags0 & pc.BODYFLAG_NORESPONSE_OBJECT)) {
                                    e1.collision.fire("triggerenter", e0);
                                }
                            }
                        }
                    } else {
                        e0Events = e0.collision ? e0.collision.hasEvent("collisionstart")  || e0.collision.hasEvent("collisionend")|| e0.collision.hasEvent("contact") : false;
                        e1Events = e1.collision ? e1.collision.hasEvent("collisionstart") || e1.collision.hasEvent("collisionend") || e1.collision.hasEvent("contact") : false;
                        const globalEvents = this.hasEvent("contact");

                        if (globalEvents || e0Events || e1Events) {
                            for (j = 0; j < numContacts; j++) {
                                const btContactPoint = manifold.getContactPoint(j);

                                const contactPoint = this._createContactPointFromAmmo(btContactPoint);
                                let reverseContactPoint = null;
                                if (e0Events || e1Events) {
                                    reverseContactPoint = this._createReverseContactPointFromAmmo(btContactPoint);
                                    forwardContacts.push(contactPoint);
                                    reverseContacts.push(reverseContactPoint);
                                }

                                if (globalEvents) {
                                    // fire global contact event for every contact
                                    const result = this._createSingleContactResult(e0, e1, contactPoint);
                                    this.fire("contact", result);
                                }
                            }

                            if (e0Events) {
                                const forwardResult = this._createContactResult(e1, forwardContacts);

                                // fire contact events on collision volume
                                if (e0.collision) {
                                    e0.collision.fire("contact", forwardResult);
                                }

                                // fire collisionstart events
                                newCollision = this._storeCollision(e0, e1);
                                if (newCollision && e0.collision) {
                                    e0.collision.fire("collisionstart", forwardResult);
                                }
                            }

                            if (e1Events) {
                                const reverseResult = this._createContactResult(e0, reverseContacts);

                                if (e1.collision) {
                                    e1.collision.fire("contact", reverseResult);
                                }

                                newCollision = this._storeCollision(e1, e0);
                                if (newCollision && e1.collision) {
                                    e1.collision.fire("collisionstart", reverseResult);
                                }
                            }
                        }
                    }

                }
            }

            // check for collisions that no longer exist and fire events
            this._cleanOldCollisions();

            // Reset contact pools
            this.contactPointPool.freeAll();
            this.contactResultPool.freeAll();
            this.singleContactResultPool.freeAll();

            // #ifdef PROFILER
            this._stats.physicsTime = pc.now() - this._stats.physicsStart;
            // #endif
        }


    });

    return {
        // DEPRECATED ENUMS - see rigidbody_constants.js
        RIGIDBODY_TYPE_STATIC: 'static',
        RIGIDBODY_TYPE_DYNAMIC: 'dynamic',
        RIGIDBODY_TYPE_KINEMATIC: 'kinematic',
        RIGIDBODY_CF_STATIC_OBJECT: 1,
        RIGIDBODY_CF_KINEMATIC_OBJECT: 2,
        RIGIDBODY_CF_NORESPONSE_OBJECT: 4,
        RIGIDBODY_ACTIVE_TAG: 1,
        RIGIDBODY_ISLAND_SLEEPING: 2,
        RIGIDBODY_WANTS_DEACTIVATION: 3,
        RIGIDBODY_DISABLE_DEACTIVATION: 4,
        RIGIDBODY_DISABLE_SIMULATION: 5,

        RigidBodyComponentSystem
    };
})());
