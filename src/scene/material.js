pc.extend(pc, function () {
    var id = 0;

    /**
     * @name pc.Material
     * @class A material determines how a particular mesh instance is rendered. It specifies the shader and render state that is
     * set before the mesh instance is submitted to the graphics device.
     * @description Create a new Material instance
     * @property {Number} alphaTest The alpha test reference value to control which fragments are written to the currently
     * active render target based on alpha value. All fragments with an alpha value of less than the alphaTest reference value
     * will be discarded. alphaTest defaults to 0 (all fragments pass).
     * @property {Boolean} alphaToCoverage Enables or disables alpha to coverage (WebGL2 only). When enabled, and if hardware anti-aliasing is on,
     * limited order-independent transparency can be achieved. Quality depends on the number of MSAA samples of the current render target.
     * It can nicely soften edges of otherwise sharp alpha cutouts, but isn't recommended for large area semi-transparent surfaces.
     * Note, that you don't need to enable blending to make alpha to coverage work. It will work without it, just like alphaTest.
     * @property {Boolean} alphaWrite If true, the alpha component of fragments generated by the shader of this material is written to
     * the color buffer of the currently active render target. If false, the alpha component will not be written. Defaults to true.
     * @property {Number} blendType Controls how primitives are blended when being written to the currently active render target.
     * Can be one of the following values:
     * <ul>
     * <li>{@link pc.BLEND_SUBTRACTIVE}: Subtract the color of the source fragment from the destination fragment and write the result to the frame buffer.</li>
     * <li>{@link pc.BLEND_ADDITIVE}: Add the color of the source fragment to the destination fragment and write the result to the frame buffer.</li>
     * <li>{@link pc.BLEND_NORMAL}: Enable simple translucency for materials such as glass. This is equivalent to enabling a source blend mode of pc.BLENDMODE_SRC_ALPHA and a destination blend mode of pc.BLENDMODE_ONE_MINUS_SRC_ALPHA.</li>
     * <li>{@link pc.BLEND_NONE}: Disable blending.</li>
     * <li>{@link pc.BLEND_PREMULTIPLIED}: Similar to pc.BLEND_NORMAL expect the source fragment is assumed to have already been multiplied by the source alpha value.</li>
     * <li>{@link pc.BLEND_MULTIPLICATIVE}: Multiply the color of the source fragment by the color of the destination fragment and write the result to the frame buffer.</li>
     * <li>{@link pc.BLEND_ADDITIVEALPHA}: Same as pc.BLEND_ADDITIVE except the source RGB is multiplied by the source alpha.</li>
     * </ul>
     * Defaults to pc.BLEND_NONE.
     * @property {Boolean} blueWrite If true, the blue component of fragments generated by the shader of this material is written to
     * the color buffer of the currently active render target. If false, the blue component will not be written. Defaults to true.
     * @property {Number} cull Controls how triangles are culled based on their face direction with respect to the viewpoint.
     * Can be one of the following values:
     * <ul>
     * <li>{@link pc.CULLFACE_NONE}: Do not cull triangles based on face direction.</li>
     * <li>{@link pc.CULLFACE_BACK}: Cull the back faces of triangles (do not render triangles facing away from the view point).</li>
     * <li>{@link pc.CULLFACE_FRONT}: Cull the front faces of triangles (do not render triangles facing towards the view point).</li>
     * <li>{@link pc.CULLFACE_FRONTANDBACK}: Cull both front and back faces (triangles will not be rendered).</li>
     * </ul>
     * Defaults to pc.CULLFACE_BACK.
     * @property {Boolean} depthTest If true, fragments generated by the shader of this material are only written to the
     * current render target if they pass the depth test. If false, fragments generated by the shader of this material are
     * written to the current render target regardless of what is in the depth buffer. Defaults to true.
     * @property {Boolean} depthWrite If true, fragments generated by the shader of this material write a depth value to
     * the depth buffer of the currently active render target. If false, no depth value is written. Defaults to true.
     * @property {Boolean} greenWrite If true, the green component of fragments generated by the shader of this material is written to
     * the color buffer of the currently active render target. If false, the green component will not be written. Defaults to true.
     * @property {String} name The name of the material.
     * @property {Boolean} redWrite If true, the red component of fragments generated by the shader of this material is written to
     * the color buffer of the currently active render target. If false, the red component will not be written. Defaults to true.
     * @property {pc.Shader} shader The shader used by this material to render mesh instances.
     * @property {pc.StencilParameters} stencilFront Stencil parameters for front faces (default is null).
     * @property {pc.StencilParameters} stencilBack Stencil parameters for back faces (default is null).
     */
    var Material = function Material() {
        this.name = "Untitled";
        this.id = id++;
        this._shader = null;
        this.variants = {};

        this.parameters = {};

        // Render states
        this.alphaTest = 0;
        this.alphaToCoverage = false;

        this.blend = false;
        this.blendSrc = pc.BLENDMODE_ONE;
        this.blendDst = pc.BLENDMODE_ZERO;
        this.blendEquation = pc.BLENDEQUATION_ADD;

        this.separateAlphaBlend = false;
        this.blendSrcAlpha = pc.BLENDMODE_ONE;
        this.blendDstAlpha = pc.BLENDMODE_ZERO;
        this.blendAlphaEquation = pc.BLENDEQUATION_ADD;

        this.cull = pc.CULLFACE_BACK;

        this.depthTest = true;
        this.depthWrite = true;
        this.stencilFront = null;
        this.stencilBack = null;

        this.redWrite = true;
        this.greenWrite = true;
        this.blueWrite = true;
        this.alphaWrite = true;

        this.meshInstances = []; // The mesh instances referencing this material
    };

    Object.defineProperty(Material.prototype, 'shader', {
        get: function () {
            return this._shader;
        },
        set: function (shader) {
            this.setShader(shader);
        }
    });

    Object.defineProperty(Material.prototype, 'blendType', {
        get: function () {
            if ((!this.blend) &&
                (this.blendSrc === pc.BLENDMODE_ONE) &&
                (this.blendDst === pc.BLENDMODE_ZERO) &&
                (this.blendEquation === pc.BLENDEQUATION_ADD)) {
                return pc.BLEND_NONE;
            } else if ((this.blend) &&
                       (this.blendSrc === pc.BLENDMODE_SRC_ALPHA) &&
                       (this.blendDst === pc.BLENDMODE_ONE_MINUS_SRC_ALPHA) &&
                       (this.blendEquation === pc.BLENDEQUATION_ADD)) {
                return pc.BLEND_NORMAL;
            } else if ((this.blend) &&
                       (this.blendSrc === pc.BLENDMODE_ONE) &&
                       (this.blendDst === pc.BLENDMODE_ONE) &&
                       (this.blendEquation === pc.BLENDEQUATION_ADD)) {
                return pc.BLEND_ADDITIVE;
            } else if ((this.blend) &&
                       (this.blendSrc === pc.BLENDMODE_SRC_ALPHA) &&
                       (this.blendDst === pc.BLENDMODE_ONE) &&
                       (this.blendEquation === pc.BLENDEQUATION_ADD)) {
                return pc.BLEND_ADDITIVEALPHA;
            } else if ((this.blend) &&
                       (this.blendSrc === pc.BLENDMODE_DST_COLOR) &&
                       (this.blendDst === pc.BLENDMODE_SRC_COLOR) &&
                       (this.blendEquation === pc.BLENDEQUATION_ADD)) {
                return pc.BLEND_MULTIPLICATIVE2X;
            } else if ((this.blend) &&
                       (this.blendSrc === pc.BLENDMODE_ONE_MINUS_DST_COLOR) &&
                       (this.blendDst === pc.BLENDMODE_ONE) &&
                       (this.blendEquation === pc.BLENDEQUATION_ADD)) {
                return pc.BLEND_SCREEN;
            } else if ((this.blend) &&
                       (this.blendSrc === pc.BLENDMODE_ONE) &&
                       (this.blendDst === pc.BLENDMODE_ONE) &&
                       (this.blendEquation === pc.BLENDEQUATION_MIN)) {
                return pc.BLEND_MIN;
            } else if ((this.blend) &&
                       (this.blendSrc === pc.BLENDMODE_ONE) &&
                       (this.blendDst === pc.BLENDMODE_ONE) &&
                       (this.blendEquation === pc.BLENDEQUATION_MAX)) {
                return pc.BLEND_MAX;
            } else if ((this.blend) &&
                       (this.blendSrc === pc.BLENDMODE_DST_COLOR) &&
                       (this.blendDst === pc.BLENDMODE_ZERO) &&
                       (this.blendEquation === pc.BLENDEQUATION_ADD)) {
                return pc.BLEND_MULTIPLICATIVE;
            } else if ((this.blend) &&
                       (this.blendSrc === pc.BLENDMODE_ONE) &&
                       (this.blendDst === pc.BLENDMODE_ONE_MINUS_SRC_ALPHA) &&
                       (this.blendEquation === pc.BLENDEQUATION_ADD)) {
                return pc.BLEND_PREMULTIPLIED;
            } else {
                return pc.BLEND_NORMAL;
            }
        },
        set: function (type) {
            switch (type) {
                case pc.BLEND_NONE:
                    this.blend = false;
                    this.blendSrc = pc.BLENDMODE_ONE;
                    this.blendDst = pc.BLENDMODE_ZERO;
                    this.blendEquation = pc.BLENDEQUATION_ADD;
                    break;
                case pc.BLEND_NORMAL:
                    this.blend = true;
                    this.blendSrc = pc.BLENDMODE_SRC_ALPHA;
                    this.blendDst = pc.BLENDMODE_ONE_MINUS_SRC_ALPHA;
                    this.blendEquation = pc.BLENDEQUATION_ADD;
                    break;
                case pc.BLEND_PREMULTIPLIED:
                    this.blend = true;
                    this.blendSrc = pc.BLENDMODE_ONE;
                    this.blendDst = pc.BLENDMODE_ONE_MINUS_SRC_ALPHA;
                    this.blendEquation = pc.BLENDEQUATION_ADD;
                    break;
                case pc.BLEND_ADDITIVE:
                    this.blend = true;
                    this.blendSrc = pc.BLENDMODE_ONE;
                    this.blendDst = pc.BLENDMODE_ONE;
                    this.blendEquation = pc.BLENDEQUATION_ADD;
                    break;
                case pc.BLEND_ADDITIVEALPHA:
                    this.blend = true;
                    this.blendSrc = pc.BLENDMODE_SRC_ALPHA;
                    this.blendDst = pc.BLENDMODE_ONE;
                    this.blendEquation = pc.BLENDEQUATION_ADD;
                    break;
                case pc.BLEND_MULTIPLICATIVE2X:
                    this.blend = true;
                    this.blendSrc = pc.BLENDMODE_DST_COLOR;
                    this.blendDst = pc.BLENDMODE_SRC_COLOR;
                    this.blendEquation = pc.BLENDEQUATION_ADD;
                    break;
                case pc.BLEND_SCREEN:
                    this.blend = true;
                    this.blendSrc = pc.BLENDMODE_ONE_MINUS_DST_COLOR;
                    this.blendDst = pc.BLENDMODE_ONE;
                    this.blendEquation = pc.BLENDEQUATION_ADD;
                    break;
                case pc.BLEND_MULTIPLICATIVE:
                    this.blend = true;
                    this.blendSrc = pc.BLENDMODE_DST_COLOR;
                    this.blendDst = pc.BLENDMODE_ZERO;
                    this.blendEquation = pc.BLENDEQUATION_ADD;
                    break;
                case pc.BLEND_MIN:
                    this.blend = true;
                    this.blendSrc = pc.BLENDMODE_ONE;
                    this.blendDst = pc.BLENDMODE_ONE;
                    this.blendEquation = pc.BLENDEQUATION_MIN;
                    break;
                case pc.BLEND_MAX:
                    this.blend = true;
                    this.blendSrc = pc.BLENDMODE_ONE;
                    this.blendDst = pc.BLENDMODE_ONE;
                    this.blendEquation = pc.BLENDEQUATION_MAX;
                    break;
            }
            this._updateMeshInstanceKeys();
        }
    });

    Material.prototype._cloneInternal = function (clone) {
        clone.name = this.name;
        clone.id = id++;
        clone.variants = { }; // ?
        clone.shader = this.shader;
        clone.parameters = { };

        // and need copy parameters of that shader
        for(var parameterName in this.parameters) {
            if (this.parameters.hasOwnProperty(parameterName))
                clone.parameters[parameterName] = { scopeId: null, data: this.parameters[parameterName].data };
        }

        // Render states
        clone.alphaTest = this.alphaTest;
        clone.alphaToCoverage = this.alphaToCoverage;

        clone.blend = this.blend;
        clone.blendSrc = this.blendSrc;
        clone.blendDst = this.blendDst;
        clone.blendEquation = this.blendEquation;

        clone.separateAlphaBlend = this.separateAlphaBlend;
        clone.blendSrcAlpha = this.blendSrcAlpha;
        clone.blendDstAlpha = this.blendDstAlpha;
        clone.blendAlphaEquation = this.blendAlphaEquation;

        clone.cull = this.cull;

        clone.depthTest = this.depthTest;
        clone.depthWrite = this.depthWrite;
        if (this.stencilFront) clone.stencilFront = this.stencilFront.clone();
        if (this.stencilBack) {
            if (this.stencilFront===this.stencilBack) {
                clone.stencilBack = clone.stencilFront;
            } else {
                clone.stencilBack = this.stencilBack.clone();
            }
        }

        clone.redWrite = this.redWrite;
        clone.greenWrite = this.greenWrite;
        clone.blueWrite = this.blueWrite;
        clone.alphaWrite = this.alphaWrite;

        clone.meshInstances = [];
    };

    Material.prototype.clone = function () {
        var clone = new pc.Material();
        this._cloneInternal(clone);
        return clone;
    };

    Material.prototype._updateMeshInstanceKeys = function () {
        var i, meshInstances = this.meshInstances;
        for (i = 0; i < meshInstances.length; i++) {
            meshInstances[i].updateKey();
        }
    };

    Material.prototype.updateShader = function (device, scene, objDefs) {
        // For vanilla materials, the shader can only be set by the user
    };

    // Parameter management
    Material.prototype.clearParameters = function () {
        this.parameters = {};
    };

    Material.prototype.getParameters = function () {
        return this.parameters;
    };

    Material.prototype.clearVariants = function () {
        var meshInstance;
        for (var s in this.variants) {
            if (this.variants.hasOwnProperty(s)) {
                this.variants[s]._refCount--;
            }
        }
        this.variants = {};
        var j;
        for (var i = 0; i < this.meshInstances.length; i++) {
            meshInstance = this.meshInstances[i];
            for(j=0; j<meshInstance._shader.length; j++) {
                meshInstance._shader[j] = null;
            }
        }
    };

    /**
     * @function
     * @name pc.Material#getParameter
     * @description Retrieves the specified shader parameter from a material.
     * @param {String} name The name of the parameter to query.
     * @returns {Object} The named parameter.
     */
    Material.prototype.getParameter = function (name) {
        return this.parameters[name];
    };

    /**
     * @function
     * @name pc.Material#setParameter
     * @description Sets a shader parameter on a material.
     * @param {String} name The name of the parameter to set.
     * @param {Number|Array|pc.Texture} data The value for the specified parameter.
     */
    Material.prototype.setParameter = function (arg, data, passFlags) {

        if (passFlags === undefined) passFlags = (1 << pc.SHADER_FORWARD) | (1 << pc.SHADER_FORWARDHDR);

        var name;
        if (data === undefined && typeof(arg) === 'object') {
            var uniformObject = arg;
            if (uniformObject.length) {
                for(var i=0; i<uniformObject.length; i++) this.setParameter(uniformObject[i]);
                    return;
            } else {
                name = uniformObject.name;
                data = uniformObject.value;
            }
        } else {
            name = arg;
        }

        var param = this.parameters[name];
        if (param) {
            param.data = data;
            param.passFlags = passFlags;
        } else {
            this.parameters[name] = {
                scopeId: null,
                data: data,
                passFlags: passFlags
            };
        }
    };

    /**
     * @function
     * @name pc.Material#deleteParameter
     * @description Deletes a shader parameter on a material.
     * @param {String} name The name of the parameter to delete.
     */
    Material.prototype.deleteParameter = function (name) {
        if (this.parameters[name]) {
            delete this.parameters[name];
        }
    };

    /**
     * @function
     * @name pc.Material#setParameters
     * @description Pushes all material parameters into scope.
     */
    Material.prototype.setParameters = function () {
        // Push each shader parameter into scope
        for (var paramName in this.parameters) {
            var parameter = this.parameters[paramName];
            // TODO: Fix https://github.com/playcanvas/engine/issues/597
            //if (!parameter.scopeId) {
            //    parameter.scopeId = device.scope.resolve(paramName);
            //}
            parameter.scopeId.setValue(parameter.data);
        }
    };

    /**
     * @function
     * @name pc.Material#update
     * @description Applies any changes made to the material's properties.
     */
    Material.prototype.update = function () {
        throw Error("Not Implemented in base class");
    };

    /**
     * @function
     * @description Initializes the material with the properties in the specified data.
     * @name pc.Material#init
     * @param {Object} data The initial data for the material.
     */
    Material.prototype.init = function (data) {
        throw Error("Not Implemented in base class");
    };

    ////////////////
    // DEPRECATED //
    ////////////////
    /**
     * @private
     * @function
     * @name pc.Material#getName
     * @description Returns the string name of the specified material. This name is not
     * necessarily unique. Material names set by an artist within the modelling application
     * should be preserved in the PlayCanvas runtime.
     * @return {String} The name of the material.
     */
    Material.prototype.getName = function () {
        return this.name;
    };

    /**
     * @private
     * @function
     * @name pc.Material#setName
     * @description Sets the string name of the specified material. This name does not
     * have to be unique.
     * @param {String} name The name of the material.
     */
    Material.prototype.setName = function (name) {
        this.name = name;
    };

    /**
     * @private
     * @function
     * @name pc.Material#getShader
     * @description Retrieves the shader assigned to the specified material.
     * @returns {pc.Shader} The shader assigned to the material.
     */
    Material.prototype.getShader = function () {
        return this.shader;
    };

    /**
     * @private
     * @function
     * @name pc.Material#setShader
     * @description Assigns a shader to the specified material.
     * @param {pc.Shader} shader The shader to assign to the material.
     */
    Material.prototype.setShader = function (shader) {
        if (this._shader) {
            this._shader._refCount--;
        }
        this._shader = shader;
        if (shader) shader._refCount++;
    };

    /**
     * @private
     * @function
     * @name pc.Material#destroy
     * @description Removes this material from the scene and possibly frees up memory from its shaders (if there are no other materials using it).
     */
    Material.prototype.destroy = function () {
        if (this.shader) {
            this.shader._refCount--;
            if (this.shader._refCount < 1) {
                this.shader.destroy();
            }
        }

        var variant;
        for (var s in this.variants) {
            if (this.variants.hasOwnProperty(s)) {
                variant = this.variants[s];
                if (variant===this.shader) continue;
                variant._refCount--;
                if (variant._refCount < 1) {
                    variant.destroy();
                }
            }
        }
        this.variants = {};
        this.shader = null;

        var meshInstance, j;
        for (var i = 0; i < this.meshInstances.length; i++) {
            meshInstance = this.meshInstances[i];
            for(j=0; j<meshInstance._shader.length; j++) {
                meshInstance._shader[j] = null;
            }
            meshInstance._material = null;
            if (this!==pc.Scene.defaultMaterial) {
                meshInstance.material = pc.Scene.defaultMaterial;
            }
        }
    };

    /**
     * @name pc.StencilParameters
     * @class Holds stencil test settings
     * @description Create a new StencilParameters instance
     * @property {Number} func Sets stencil test function. See pc.GraphicsDevice#setStencilFunc
     * @property {Number} ref Sets stencil test reference value. See pc.GraphicsDevice#setStencilFunc
     * @property {Number} fail Sets operation to perform if stencil test is failed. See pc.GraphicsDevice#setStencilOperation
     * @property {Number} zfail Sets operation to perform if depth test is failed. See pc.GraphicsDevice#setStencilOperation
     * @property {Number} zpass Sets operation to perform if both stencil and depth test are passed. See pc.GraphicsDevice#setStencilOperation
     * @property {Number} readMask Sets stencil test reading mask. See pc.GraphicsDevice#setStencilFunc
     * @property {Number} writeMask Sets stencil test writing mask. See pc.GraphicsDevice#setStencilOperation
    */
    var StencilParameters = function (options) {
        this.func = options.func===undefined? pc.FUNC_ALWAYS : options.func;
        this.ref = options.ref || 0;
        this.readMask = options.readMask===undefined? 0xFF : options.readMask;
        this.writeMask = options.writeMask===undefined? 0xFF : options.writeMask;

        this.fail = options.fail || pc.STENCILOP_KEEP; // keep == 0
        this.zfail = options.zfail || pc.STENCILOP_KEEP;
        this.zpass = options.zpass || pc.STENCILOP_KEEP;
    };

    StencilParameters.prototype.clone = function () {
        var clone = new pc.StencilParameters({
            func: this.func,
            ref: this.ref,
            readMask: this.readMask,
            writeMask: this.writeMask,
            fail: this.fail,
            zfail: this.zfail,
            zpass: this.zpass
        });
        return clone;
    };

    return {
        Material: Material,
        StencilParameters: StencilParameters
    };
}());
