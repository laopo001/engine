declare namespace pc {
    /**
     * @constructor
     * @name pc.LayerComposition
     * @classdesc Layer Composition is a collection of {@link pc.Layer} that is fed to {@link pc.Scene#layers} to define rendering order.
     * @description Create a new layer composition.
     * @property {Array} layerList A read-only array of {@link pc.Layer} sorted in the order they will be rendered.
     * @property {Array} subLayerList A read-only array of boolean values, matching {@link pc.Layer#layerList}.
     * True means only semi-transparent objects are rendered, and false means opaque.
     * @property {Array} subLayerEnabled A read-only array of boolean values, matching {@link pc.Layer#layerList}.
     * True means the layer is rendered, false means it's skipped.
     * @property {Array} cameras A read-only array of {@link pc.CameraComponent} that can be used during rendering, e.g. inside
     * {@link pc.Layer#onPreCull}, {@link pc.Layer#onPostCull}, {@link pc.Layer#onPreRender}, {@link pc.Layer#onPostRender}.
     */
    class LayerComposition {
        layerList: pc.Layer[];
        subLayerList: boolean[];
        subLayerEnabled: boolean[];
        cameras: pc.CameraComponent[];

        /**
         * @function
         * @name pc.LayerComposition#push
         * @description Adds a layer (both opaque and semi-transparent parts) to the end of the {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to add.
         */
        push(layer): void;

        /**
         * @function
         * @name pc.LayerComposition#insert
         * @description Inserts a layer (both opaque and semi-transparent parts) at the chosen index in the {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to add.
         * @param {Number} index Insertion position.
         */
        insert(layer, index): void;

        /**
         * @function
         * @name pc.LayerComposition#remove
         * @description Removes a layer (both opaque and semi-transparent parts) from {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to remove.
         */
        remove(layer): void;

        /**
         * @function
         * @name pc.LayerComposition#pushOpaque
         * @description Adds part of the layer with opaque (non semi-transparent) objects to the end of the {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to add.
         */
        pushOpaque(layer): void;

        /**
         * @function
         * @name pc.LayerComposition#insertOpaque
         * @description Inserts an opaque part of the layer (non semi-transparent mesh instances) at the chosen index in the {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to add.
         * @param {Number} index Insertion position.
         */
        insertOpaque(layer, index): void;

        /**
         * @function
         * @name pc.LayerComposition#removeOpaque
         * @description Removes an opaque part of the layer (non semi-transparent mesh instances) from {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to remove.
         */
        removeOpaque(layer): void;

        /**
         * @function
         * @name pc.LayerComposition#pushTransparent
         * @description Adds part of the layer with semi-transparent objects to the end of the {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to add.
         */
        pushTransparent(layer): void;

        /**
         * @function
         * @name pc.LayerComposition#insertTransparent
         * @description Inserts a semi-transparent part of the layer at the chosen index in the {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to add.
         * @param {Number} index Insertion position.
         */
        insertTransparent(layer, index): void;

        /**
         * @function
         * @name pc.LayerComposition#removeTransparent
         * @description Removes a transparent part of the layer from {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to remove.
         */
        removeTransparent(layer): void;

        /**
         * @function
         * @name pc.LayerComposition#getOpaqueIndex
         * @description Gets index of the opaque part of the supplied layer in the {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to find index of.
         * @returns {Number} The index of the opaque part of the specified layer.
         */
        getOpaqueIndex(layer): void;

        /**
         * @function
         * @name pc.LayerComposition#getTransparentIndex
         * @description Gets index of the semi-transparent part of the supplied layer in the {@link pc.Layer#layerList}.
         * @param {pc.Layer} layer A {@link pc.Layer} to find index of.
         * @returns {Number} The index of the semi-transparent part of the specified layer.
         */
        getTransparentIndex(layer): void;

        /**
         * @function
         * @name pc.LayerComposition#getLayerById
         * @description Finds a layer inside this composition by its ID. null is returned, if nothing is found.
         * @param {Number} id An ID of the layer to find.
         * @returns {pc.Layer} The layer corresponding to the specified ID. Returns null if layer is not found.
         */
        getLayerById(id): pc.Layer;

        /**
         * @function
         * @name pc.LayerComposition#getLayerByName
         * @description Finds a layer inside this composition by its name. null is returned, if nothing is found.
         * @param {String} name The name of the layer to find.
         * @returns {pc.Layer} The layer corresponding to the specified name. Returns null if layer is not found.
         */
        getLayerByName(name): pc.Layer;
    }
}