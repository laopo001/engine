pc.extend(pc, (() => {
    const _schema = [
        'enabled',
        'clearColorBuffer',
        'clearColor',
        'clearDepthBuffer',
        'clearStencilBuffer',
        'frustumCulling',
        'projection',
        'fov',
        'orthoHeight',
        'nearClip',
        'farClip',
        'priority',
        'rect',
        'scissorRect',
        'camera',
        'aspectRatio',
        'aspectRatioMode',
        'horizontalFov',
        'model',
        'renderTarget',
        'calculateTransform',
        'calculateProjection',
        'cullFaces',
        'flipFaces',
        'layers'
    ];

    /**
     * @constructor
     * @name pc.CameraComponentSystem
     * @classdesc Used to add and remove {@link pc.CameraComponent}s from Entities. It also holds an
     * array of all active cameras.
     * @description Create a new CameraComponentSystem
     * @param {pc.Application} app The Application
     *
     * @property {pc.CameraComponent[]} cameras Holds all the active camera components
     * @extends pc.ComponentSystem
     */
    let CameraComponentSystem = function({systems}) {
        this.id = 'camera';
        this.description = "Renders the scene from the location of the Entity.";
        systems.add(this.id, this);

        this.ComponentType = pc.CameraComponent;
        this.DataType = pc.CameraComponentData;

        this.schema = _schema;

        // holds all the active camera components
        this.cameras = [ ];

        this.on('beforeremove', this.onBeforeRemove, this);
        this.on('remove', this.onRemove, this);

        pc.ComponentSystem.on('update', this.onUpdate, this);
    };
    CameraComponentSystem = pc.inherits(CameraComponentSystem, pc.ComponentSystem);

    pc.Component._buildAccessors(pc.CameraComponent.prototype, _schema);

    pc.extend(CameraComponentSystem.prototype, {
        initializeComponentData(component, _data, properties) {
            properties = [
                'postEffects',
                'enabled',
                'model',
                'camera',
                'aspectRatio',
                'aspectRatioMode',
                'horizontalFov',
                'renderTarget',
                'clearColor',
                'fov',
                'orthoHeight',
                'nearClip',
                'farClip',
                'projection',
                'priority',
                'clearColorBuffer',
                'clearDepthBuffer',
                'clearStencilBuffer',
                'frustumCulling',
                'rect',
                'scissorRect',
                'calculateTransform',
                'calculateProjection',
                'cullFaces',
                'flipFaces',
                'layers'
            ];

            // duplicate data because we're modifying the data
            const data = {};
            properties.forEach(prop => {
                data[prop] = _data[prop];
            });

            if (data.layers && pc.type(data.layers) === 'array') {
                data.layers = data.layers.slice(0);
            }

            if (data.clearColor && pc.type(data.clearColor) === 'array') {
                const c = data.clearColor;
                data.clearColor = new pc.Color(c[0], c[1], c[2], c[3]);
            }

            if (data.rect && pc.type(data.rect) === 'array') {
                const rect = data.rect;
                data.rect = new pc.Vec4(rect[0], rect[1], rect[2], rect[3]);
            }

            if (data.scissorRect && pc.type(data.scissorRect) === 'array') {
                const scissorRect = data.scissorRect;
                data.scissorRect = new pc.Vec4(scissorRect[0], scissorRect[1], scissorRect[2], scissorRect[3]);
            }

            if (data.activate) {
                console.warn("WARNING: activate: Property is deprecated. Set enabled property instead.");
                data.enabled = data.activate;
            }

            data.camera = new pc.Camera();
            data._node = component.entity;
            data.camera._component = component;

            const self = component;
            data.camera.calculateTransform = (mat, mode) => {
                if (!self._calculateTransform)
                    return null;

                return self._calculateTransform(mat, mode);
            };
            data.camera.calculateProjection = (mat, mode) => {
                if (!self._calculateProjection)
                    return null;

                return self._calculateProjection(mat, mode);
            };

            data.postEffects = new pc.PostEffectQueue(this.app, component);

            CameraComponentSystem._super.initializeComponentData.call(this, component, data, properties);
        },

        onBeforeRemove(entity, component) {
            this.removeCamera(component);
        },

        onRemove(entity, data) {
            data.camera = null;
        },

        onUpdate(dt) {
            const components = this.store;
            let component, componentData, cam, vrDisplay;

            if (this.app.vr) {
                for (const id in components) {
                    component = components[id];
                    componentData = component.data;
                    cam = componentData.camera;
                    vrDisplay = cam.vrDisplay;
                    if (componentData.enabled && component.entity.enabled && vrDisplay) {
                        // Change WebVR near/far planes based on the stereo camera
                        vrDisplay.setClipPlanes(cam._nearClip, cam._farClip);

                        // update camera node transform from VrDisplay
                        if (cam._node) {
                            cam._node.localTransform.copy(vrDisplay.combinedViewInv);
                            cam._node._dirtyLocal = false;
                            cam._node._dirtify();
                            // cam._node.syncHierarchy();
                        }
                    }
                }
            }
        },

        addCamera(camera) {
            this.cameras.push(camera);
            this.sortCamerasByPriority();
        },

        removeCamera(camera) {
            const index = this.cameras.indexOf(camera);
            if (index >= 0) {
                this.cameras.splice(index, 1);
                this.sortCamerasByPriority();
            }
        },

        sortCamerasByPriority() {
            this.cameras.sort(({priority}, {priority}) => priority - priority);
        }
    });

    return {
        CameraComponentSystem
    };
})());
