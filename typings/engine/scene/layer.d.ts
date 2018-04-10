declare namespace pc {
    /**
     * @constructor
     * @name pc.Layer
     * @classdesc Layer represents a renderable subset of the scene. It can contain a list of mesh instances, lights and cameras,
     * their render settings and also defines custom callbacks before, after or during rendering.
     * Layers are organized inside {@link pc.LayerComposition} in a desired order.
     * @description Create a new layer.
     * @param {Object} options Object for passing optional arguments. These arguments are the same as properties of the Layer.
     * @property {Boolean} enabled Enable the layer. Disabled layers are skipped. Defaults to true.
     * @property {String} name Name of the layer. Can be used in {@link pc.LayerComposition#getLayerByName}.
     * @property {Number} opaqueSortMode Defines the method used for sorting opaque (that is, not semi-transparent) mesh instances before rendering.
     * Possible values are:
     * <ul>
     *     <li>{@link pc.SORTMODE_NONE}</li>
     *     <li>{@link pc.SORTMODE_MANUAL}</li>
     *     <li>{@link pc.SORTMODE_MATERIALMESH}</li>
     *     <li>{@link pc.SORTMODE_BACK2FRONT}</li>
     *     <li>{@link pc.SORTMODE_FRONT2BACK}</li>
     * </ul>
     * Defaults to pc.SORTMODE_MATERIALMESH.
     * @property {Number} transparentSortMode Defines the method used for sorting semi-transparent mesh instances before rendering.
     * Possible values are:
     * <ul>
     *     <li>{@link pc.SORTMODE_NONE}</li>
     *     <li>{@link pc.SORTMODE_MANUAL}</li>
     *     <li>{@link pc.SORTMODE_MATERIALMESH}</li>
     *     <li>{@link pc.SORTMODE_BACK2FRONT}</li>
     *     <li>{@link pc.SORTMODE_FRONT2BACK}</li>
     * </ul>
     * Defaults to pc.SORTMODE_BACK2FRONT.
     * @property {pc.RenderTarget} renderTarget Render target to which rendering is performed. If not set, will render simply to the screen.
     * @property {Number} shaderPass A type of shader to use during rendering. Possible values are:
     * <ul>
     *     <li>{@link pc.SHADER_FORWARD}</li>
     *     <li>{@link pc.SHADER_FORWARDHDR}</li>
     *     <li>{@link pc.SHADER_DEPTH}</li>
     *     <li>Your own custom value. Should be in 19 - 31 range. Use {@link pc.StandardMaterial#onUpdateShader} to apply shader modifications based on this value.</li>
     * </ul>
     * Defaults to pc.SHADER_FORWARD.
     * @property {Boolean} passThrough Tells that this layer is simple and needs to just render a bunch of mesh instances without lighting, skinning and morphing (faster).
     *
     * @property {Boolean} overrideClear Defines if layer should use camera clear parameters (true) or ignore them and use {@link pc.Layer#clearColor}, {@link pc.Layer#clearColorBuffer},
     * {@link pc.Layer#clearDepthBuffer} and {@link pc.Layer#clearStencilBuffer}.
     * @property {pc.Color} clearColor The color used to clear the canvas to before each camera starts to render.
     * @property {Boolean} clearColorBuffer If true cameras will clear the color buffer to the color set in clearColor.
     * @property {Boolean} clearDepthBuffer If true cameras will clear the depth buffer.
     * @property {Boolean} clearStencilBuffer If true cameras will clear the stencil buffer.
     *
     * @property {pc.Layer} layerReference Make this layer render the same mesh instances that another layer does instead of having its own mesh instance list.
     * Both layers must share cameras. Frustum culling is only performed for one layer.
     * @property {Function} cullingMask Visibility mask that interacts with {@link pc.MeshInstance#mask}.
     * @property {Function} onEnable Custom function that is called after the layer has been enabled.
     * This happens when:
     * <ul>
     *     <li>The layer is created with {@link pc.Layer#enabled} set to true (which is the default value).</li>
     *     <li>{@link pc.Layer#enabled} was changed from false to true</li>
     *     <li>{@link pc.Layer#incrementCounter} was called and incremented the counter above zero.</li>
     * </ul>
     * Useful for allocating resources this layer will use (e.g. creating render targets).
     * @property {Function} onDisable Custom function that is called after the layer has been disabled.
     * This happens when:
     * <ul>
     *     <li>{@link pc.Layer#enabled} was changed from true to false</li>
     *     <li>{@link pc.Layer#decrementCounter} was called and set the counter to zero.</li>
     * </ul>
     * @property {Function} onPreCull Custom function that is called before visibiliy culling is performed for this layer.
     * Useful, for example, if you want to modify camera projection while still using the same camera and make frustum culling work correctly with it
     * (see {@link pc.CameraComponent#calculateTransform} and {@link pc.CameraComponent#calculateProjection}).
     * This function will receive camera index as the only argument. You can get the actual camera being used by looking up {@link pc.LayerComposition#cameras} with this index.
     * @property {Function} onPostCull Custom function that is called after visibiliy culling is performed for this layer.
     * Useful for reverting changes done in {@link pc.Layer#onPreCull} and determining final mesh instance visibility (see {@link pc.MeshInstance#visibleThisFrame}).
     * This function will receive camera index as the only argument. You can get the actual camera being used by looking up {@link pc.LayerComposition#cameras} with this index.
     * @property {Function} onPreRender Custom function that is called before this layer is rendered.
     * Useful, for example, for reacting on screen size changes.
     * This function is called before the first occurrence of this layer in {@link pc.LayerComposition}.
     * It will receive camera index as the only argument. You can get the actual camera being used by looking up {@link pc.LayerComposition#cameras} with this index.
     * @property {Function} onPreRenderOpaque Custom function that is called before opaque mesh instances (not semi-transparent) in this layer are rendered.
     * This function will receive camera index as the only argument. You can get the actual camera being used by looking up {@link pc.LayerComposition#cameras} with this index.
     * @property {Function} onPreRenderTransparent Custom function that is called before semi-transparent mesh instances in this layer are rendered.
     * This function will receive camera index as the only argument. You can get the actual camera being used by looking up {@link pc.LayerComposition#cameras} with this index.
     * @property {Function} onPostRender Custom function that is called after this layer is rendered.
     * Useful to revert changes made in {@link pc.Layer#onPreRender} or performing some processing on {@link pc.Layer#renderTarget}.
     * This function is called after the last occurrence of this layer in {@link pc.LayerComposition}.
     * It will receive camera index as the only argument. You can get the actual camera being used by looking up {@link pc.LayerComposition#cameras} with this index.
     * @property {Function} onPostRenderOpaque Custom function that is called after opaque mesh instances (not semi-transparent) in this layer are rendered.
     * This function will receive camera index as the only argument. You can get the actual camera being used by looking up {@link pc.LayerComposition#cameras} with this index.
     * @property {Function} onPostRenderTransparent Custom function that is called after semi-transparent mesh instances in this layer are rendered.
     * This function will receive camera index as the only argument. You can get the actual camera being used by looking up {@link pc.LayerComposition#cameras} with this index.
     * @property {Function} onDrawCall Custom function that is called before every mesh instance in this layer is rendered.
     * It is not recommended to set this function when rendering many objects every frame due to performance reasons.
     * @property {Function} id A unique ID of the layer.
     * Layer IDs are stored inside {@link pc.ModelComponent#layers}, {@link pc.CameraComponent#layers}, {@link pc.LightComponent#layers} and {@link pc.ElementComponent#layers} instead of names.
     * Can be used in {@link pc.LayerComposition#getLayerById}.
     */
    class Layer {
        id: number;
        name: string;
        enabled: boolean;
        opaqueSortMode: number;
        transparentSortMode: number;
        renderTarget: pc.RenderTarget;
        shaderPass: number;
        passThrough: boolean;
        overrideClear: boolean;
        clearColor: pc.Color;
        clearColorBuffer: boolean;
        clearDepthBuffer: boolean;
        clearStencilBuffer: boolean;
        layerReference: pc.Layer;
        cullingMask: number;
        onEnable: Function;
        onDisable: Function;
        onPreCull: Function;
        onPostCull: Function;
        onPreRender: Function;
        onPostRender: Function;
        onPreRenderOpaque: Function;
        onPostRenderOpaque: Function;
        onPreRenderTransparent: Function;
        onPostRenderTransparent: Function;
        onDrawCall: Function;

        /**
         * @function
         * @name pc.Layer#incrementCounter
         * @description Increments the usage counter of this layer.
         * By default, layers are created with counter set to 1 (if {@link pc.Layer.enabled} is true) or 0 (if it was false).
         * Incrementing the counter from 0 to 1 will enable the layer and call {@link pc.Layer.onEnable}.
         * Use this function to "subscribe" multiple effects to the same layer. For example, if the layer is used to render a reflection texture which is used by 2 mirrors,
         * then each mirror can call this function when visible and {@link pc.Layer.decrementCounter} if invisible.
         * In such case the reflection texture won't be updated, when there is nothing to use it, saving performance.
         */
        incrementCounter(): void;

        /**
         * @function
         * @name pc.Layer#decrementCounter
         * @description Decrements the usage counter of this layer.
         * Decrementing the counter from 1 to 0 will disable the layer and call {@link pc.Layer.onDisable}.
         * See {@link pc.Layer#incrementCounter} for more details.
         */
        decrementCounter(): void;

        /**
         * @function
         * @name pc.Layer#addMeshInstances
         * @description Adds an array of mesh instances to this layer.
         * @param {Array} meshInstances Array of {@link pc.MeshInstance}.
         * @param {Boolean} [skipShadowCasters] Set it to true if you don't want these mesh instances to cast shadows in this layer.
         */
        addMeshInstances(meshInstances, skipShadowCasters): void;

        /**
         * @function
         * @name pc.Layer#removeMeshInstances
         * @description Removes multiple mesh instances from this layer.
         * @param {Array} meshInstances Array of {@link pc.MeshInstance}. If they were added to this layer, they will be removed.
         * @param {Boolean} [skipShadowCasters] Set it to true if you want to still cast shadows from removed mesh instances or if they never did cast shadows before.
         */
        removeMeshInstances(meshInstances, skipShadowCasters): void;

        /**
         * @function
         * @name pc.Layer#clearMeshInstances
         * @description Removes all mesh instances from this layer.
         * @param {Boolean} [skipShadowCasters] Set it to true if you want to still cast shadows from removed mesh instances or if they never did cast shadows before.
         */
        clearMeshInstances(skipShadowCasters): void;

        /**
         * @function
         * @name pc.Layer#addLight
         * @description Adds a light to this layer.
         * @param {pc.LightComponent} light A {@link pc.LightComponent}.
         */
        addLight(light): void;

        /**
         * @function
         * @name pc.Layer#removeLight
         * @description Removes a light from this layer.
         * @param {pc.LightComponent} light A {@link pc.LightComponent}.
         */
        removeLight(light): void;

        /**
         * @function
         * @name pc.Layer#clearLights
         * @description Removes all lights from this layer.
         */
        clearLights(): void;

        /**
         * @function
         * @name pc.Layer#addShadowCasters
         * @description Adds an array of mesh instances to this layer, but only as shadow casters (they will not be rendered anywhere, but only cast shadows on other objects).
         * @param {Array} meshInstances Array of {@link pc.MeshInstance}.
         */
        addShadowCasters(meshInstances): void;

        /**
         * @function
         * @name pc.Layer#removeShadowCasters
         * @description Removes multiple mesh instances from the shadow casters list of this layer, meaning they will stop casting shadows.
         * @param {Array} meshInstances Array of {@link pc.MeshInstance}. If they were added to this layer, they will be removed.
         */
        removeShadowCasters(meshInstances): void;

        /**
         * @function
         * @name pc.Layer#addCamera
         * @description Adds a camera to this layer.
         * @param {pc.CameraComponent} camera A {@link pc.CameraComponent}.
         */
        addCamera(camera): void;

        /**
         * @function
         * @name pc.Layer#removeCamera
         * @description Removes a camera from this layer.
         * @param {pc.CameraComponent} camera A {@link pc.CameraComponent}.
         */
        removeCamera(camera): void;

        /**
         * @function
         * @name pc.Layer#clearCameras
         * @description Removes all cameras from this layer.
         */
        clearCameras(): void;
    }
}