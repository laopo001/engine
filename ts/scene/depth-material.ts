pc.extend(pc, (() => {

    /**
     * @private
     * @constructor
     * @name pc.DepthMaterial
     * @classdesc A Depth material is for rendering linear depth values to a render target.
     */
    let DepthMaterial = () => {
    };

    DepthMaterial = pc.inherits(DepthMaterial, pc.Material);

    pc.extend(DepthMaterial.prototype, {
        /**
         * @private
         * @function
         * @name pc.DepthMaterial#clone
         * @description Duplicates a Depth material.
         * @returns {pc.DepthMaterial} A cloned Depth material.
         */
        clone() {
            const clone = new pc.DepthMaterial();

            pc.Material.prototype._cloneInternal.call(this, clone);

            clone.update();
            return clone;
        },

        update() {
        },

        updateShader(device) {
            const options = {
                skin: !!this.meshInstances[0].skinInstance
            };
            const library = device.getProgramLibrary();
            this.shader = library.getProgram('depth', options);
        }
    });

    return {
        DepthMaterial
    };
})());
