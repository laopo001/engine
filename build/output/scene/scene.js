var pc;
(function (pc) {
    // Scene API enums
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_SUBTRACTIVE
     * @description Subtract the color of the source fragment from the destination fragment
     * and write the result to the frame buffer.
     */
    pc.BLEND_SUBTRACTIVE = 0;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_ADDITIVE
     * @description Add the color of the source fragment to the destination fragment
     * and write the result to the frame buffer.
     */
    pc.BLEND_ADDITIVE = 1;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_NORMAL
     * @description Enable simple translucency for materials such as glass. This is
     * equivalent to enabling a source blend mode of pc.BLENDMODE_SRC_ALPHA and a destination
     * blend mode of pc.BLENDMODE_ONE_MINUS_SRC_ALPHA.
     */
    pc.BLEND_NORMAL = 2;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_NONE
     * @description Disable blending.
     */
    pc.BLEND_NONE = 3;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_PREMULTIPLIED
     * @description Similar to pc.BLEND_NORMAL expect the source fragment is assumed to have
     * already been multiplied by the source alpha value.
     */
    pc.BLEND_PREMULTIPLIED = 4;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_MULTIPLICATIVE
     * @description Multiply the color of the source fragment by the color of the destination
     * fragment and write the result to the frame buffer.
     */
    pc.BLEND_MULTIPLICATIVE = 5;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_ADDITIVEALPHA
     * @description Same as pc.BLEND_ADDITIVE except the source RGB is multiplied by the source alpha.
     */
    pc.BLEND_ADDITIVEALPHA = 6;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_MULTIPLICATIVE2X
     * @description Multiplies colors and doubles the result
     */
    pc.BLEND_MULTIPLICATIVE2X = 7;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_SCREEN
     * @description Softer version of additive
     */
    pc.BLEND_SCREEN = 8;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_MIN
     * @description Minimum color. Check app.graphicsDevice.extBlendMinmax for support.
     */
    pc.BLEND_MIN = 9;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_MAX
     * @description Maximum color. Check app.graphicsDevice.extBlendMinmax for support.
     */
    pc.BLEND_MAX = 10;
    /**
     * @enum pc.FOG
     * @name pc.FOG_NONE
     * @description No fog is applied to the scene.
     */
    pc.FOG_NONE = 'none';
    /**
     * @enum pc.FOG
     * @name pc.FOG_LINEAR
     * @description Fog rises linearly from zero to 1 between a start and end depth.
     */
    pc.FOG_LINEAR = 'linear';
    /**
     * @enum pc.FOG
     * @name pc.FOG_EXP
     * @description Fog rises according to an exponential curve controlled by a density value.
     */
    pc.FOG_EXP = 'exp';
    /**
     * @enum pc.FOG
     * @name pc.FOG_EXP2
     * @description Fog rises according to an exponential curve controlled by a density value.
     */
    pc.FOG_EXP2 = 'exp2';
    pc.FRESNEL_NONE = 0;
    pc.FRESNEL_SCHLICK = 2;
    pc.LAYER_HUD = 0;
    pc.LAYER_GIZMO = 1;
    pc.LAYER_FX = 2;
    // 3 - 14 are custom user layers
    pc.LAYER_WORLD = 15;
    // New layers
    pc.LAYERID_WORLD = 0;
    pc.LAYERID_DEPTH = 1;
    pc.LAYERID_SKYBOX = 2;
    pc.LAYERID_IMMEDIATE = 3;
    pc.LAYERID_UI = 4;
    /**
     * @enum pc.LIGHTTYPE
     * @name pc.LIGHTTYPE_DIRECTIONAL
     * @description Directional (global) light source.
     */
    pc.LIGHTTYPE_DIRECTIONAL = 0;
    /**
     * @enum pc.LIGHTTYPE
     * @name pc.LIGHTTYPE_POINT
     * @description Point (local) light source.
     */
    pc.LIGHTTYPE_POINT = 1;
    /**
     * @enum pc.LIGHTTYPE
     * @name pc.LIGHTTYPE_SPOT
     * @description Spot (local) light source.
     */
    pc.LIGHTTYPE_SPOT = 2;
    pc.LIGHTFALLOFF_LINEAR = 0;
    pc.LIGHTFALLOFF_INVERSESQUARED = 1;
    pc.SHADOW_PCF3 = 0;
    pc.SHADOW_DEPTH = 0; // alias for SHADOW_PCF3 for backwards compatibility
    pc.SHADOW_VSM8 = 1;
    pc.SHADOW_VSM16 = 2;
    pc.SHADOW_VSM32 = 3;
    pc.SHADOW_PCF5 = 4;
    pc.BLUR_BOX = 0;
    pc.BLUR_GAUSSIAN = 1;
    pc.PARTICLESORT_NONE = 0;
    pc.PARTICLESORT_DISTANCE = 1;
    pc.PARTICLESORT_NEWER_FIRST = 2;
    pc.PARTICLESORT_OLDER_FIRST = 3;
    pc.PARTICLEMODE_GPU = 0;
    pc.PARTICLEMODE_CPU = 1;
    pc.EMITTERSHAPE_BOX = 0;
    pc.EMITTERSHAPE_SPHERE = 1;
    /**
     * @enum pc.PROJECTION
     * @name pc.PROJECTION_PERSPECTIVE
     * @description A perspective camera projection where the frustum shape is essentially pyramidal.
     */
    pc.PROJECTION_PERSPECTIVE = 0;
    /**
     * @enum pc.PROJECTION
     * @name pc.PROJECTION_ORTHOGRAPHIC
     * @description An orthographic camera projection where the frustum shape is essentially a cuboid.
     */
    pc.PROJECTION_ORTHOGRAPHIC = 1;
    pc.RENDERSTYLE_SOLID = 0;
    pc.RENDERSTYLE_WIREFRAME = 1;
    pc.RENDERSTYLE_POINTS = 2;
    pc.CUBEPROJ_NONE = 0;
    pc.CUBEPROJ_BOX = 1;
    pc.SPECULAR_PHONG = 0;
    pc.SPECULAR_BLINN = 1;
    pc.GAMMA_NONE = 0;
    pc.GAMMA_SRGB = 1;
    pc.GAMMA_SRGBFAST = 2; // deprecated
    pc.GAMMA_SRGBHDR = 3;
    pc.TONEMAP_LINEAR = 0;
    pc.TONEMAP_FILMIC = 1;
    pc.TONEMAP_HEJL = 2;
    pc.TONEMAP_ACES = 3;
    pc.TONEMAP_ACES2 = 4;
    pc.SPECOCC_NONE = 0;
    pc.SPECOCC_AO = 1;
    pc.SPECOCC_GLOSSDEPENDENT = 2;
    pc.SHADERDEF_NOSHADOW = 1;
    pc.SHADERDEF_SKIN = 2;
    pc.SHADERDEF_UV0 = 4;
    pc.SHADERDEF_UV1 = 8;
    pc.SHADERDEF_VCOLOR = 16;
    pc.SHADERDEF_INSTANCING = 32;
    pc.SHADERDEF_LM = 64;
    pc.SHADERDEF_DIRLM = 128;
    pc.SHADERDEF_SCREENSPACE = 256;
    pc.LINEBATCH_WORLD = 0;
    pc.LINEBATCH_OVERLAY = 1;
    pc.LINEBATCH_GIZMO = 2;
    pc.SHADOWUPDATE_NONE = 0;
    pc.SHADOWUPDATE_THISFRAME = 1;
    pc.SHADOWUPDATE_REALTIME = 2;
    pc.SORTKEY_FORWARD = 0;
    pc.SORTKEY_DEPTH = 1;
    pc.SHADER_FORWARD = 0;
    pc.SHADER_FORWARDHDR = 1;
    pc.SHADER_DEPTH = 2;
    pc.SHADER_SHADOW = 3; // PCF3
    // 4: VSM8,
    // 5: VSM16,
    // 6: VSM32,
    // 7: PCF5,
    // 8: PCF3 POINT
    // 9: VSM8 POINT,
    // 10: VSM16 POINT,
    // 11: VSM32 POINT,
    // 12: PCF5 POINT
    // 13: PCF3 SPOT
    // 14: VSM8 SPOT,
    // 15: VSM16 SPOT,
    // 16: VSM32 SPOT,
    // 17: PCF5 SPOT
    pc.SHADER_PICK = 18;
    pc.BAKE_COLOR = 0;
    pc.BAKE_COLORDIR = 1;
    pc.VIEW_CENTER = 0;
    pc.VIEW_LEFT = 1;
    pc.VIEW_RIGHT = 2;
    /**
     * @constructor
     * @name pc.Scene
     * @classdesc A scene is graphical representation of an environment. It manages the scene hierarchy, all
     * graphical objects, lights, and scene-wide properties.
     * @description Creates a new Scene.
     * @property {pc.Color} ambientLight The color of the scene's ambient light. Defaults to black (0, 0, 0).
     * @property {String} fog The type of fog used by the scene. Can be:
     * <ul>
     *     <li>pc.FOG_NONE</li>
     *     <li>pc.FOG_LINEAR</li>
     *     <li>pc.FOG_EXP</li>
     *     <li>pc.FOG_EXP2</li>
     * </ul>
     * Defaults to pc.FOG_NONE.
     * @property {pc.Color} fogColor The color of the fog (if enabled). Defaults to black (0, 0, 0).
     * @property {Number} fogDensity The density of the fog (if enabled). This property is only valid if the
     * fog property is set to pc.FOG_EXP or pc.FOG_EXP2. Defaults to 0.
     * @property {Number} fogEnd The distance from the viewpoint where linear fog reaches its maximum. This
     * property is only valid if the fog property is set to pc.FOG_LINEAR. Defaults to 1000.
     * @property {Number} fogStart The distance from the viewpoint where linear fog begins. This property is
     * only valid if the fog property is set to pc.FOG_LINEAR. Defaults to 1.
     * @property {Number} gammaCorrection The gamma correction to apply when rendering the scene. Can be:
     * <ul>
     *     <li>pc.GAMMA_NONE</li>
     *     <li>pc.GAMMA_SRGB</li>
     * </ul>
     * Defaults to pc.GAMMA_NONE.
     * @property {Number} toneMapping The tonemapping transform to apply when writing fragments to the
     * frame buffer. Can be:
     * <ul>
     *     <li>pc.TONEMAP_LINEAR</li>
     *     <li>pc.TONEMAP_FILMIC</li>
     *     <li>pc.TONEMAP_HEJL</li>
     *     <li>pc.TONEMAP_ACES</li>
     * </ul>
     * Defaults to pc.TONEMAP_LINEAR.
     * @property {pc.Texture} skybox A cube map texture used as the scene's skybox. Defaults to null.
     * @property {Number} skyboxIntensity Multiplier for skybox intensity. Defaults to 1.
     * @property {Number} skyboxMip The mip level of the skybox to be displayed. Only valid for prefiltered
     * cubemap skyboxes. Defaults to 0 (base level).
     * @property {Number} lightmapSizeMultiplier The lightmap resolution multiplier. Defaults to 1.
     * @property {Number} lightmapMaxResolution The maximum lightmap resolution. Defaults to 2048.
     * @property {Number} lightmapMode The lightmap baking mode. Can be:
     * <ul>
     *     <li>pc.BAKE_COLOR: single color lightmap
     *     <li>pc.BAKE_COLORDIR: single color lightmap + dominant light direction (used for bump/specular)
     * </ul>
     * Only lights with bakeDir=true will be used for generating the dominant light direction. Defaults to
     * pc.BAKE_COLORDIR.
     * @property {pc.LayerComposition} layers A {@link pc.LayerComposition} that defines rendering order of this scene.
     */
    var Scene = /** @class */ (function () {
        function Scene() {
            this.root = null;
            this._gravity = new pc.Vec3(0, -9.8, 0);
            this._layers = null;
            this._fog = pc.FOG_NONE;
            this.fogColor = new pc.Color(0, 0, 0);
            this.fogStart = 1;
            this.fogEnd = 1000;
            this.fogDensity = 0;
            this.ambientLight = new pc.Color(0, 0, 0);
            this._gammaCorrection = pc.GAMMA_NONE;
            this._toneMapping = 0;
            this.exposure = 1.0;
            this._skyboxPrefiltered = [null, null, null, null, null, null];
            this._skyboxCubeMap = null;
            this.skyboxModel = null;
            this._skyboxIntensity = 1;
            this._skyboxMip = 0;
            this.lightmapSizeMultiplier = 1;
            this.lightmapMaxResolution = 2048;
            this.lightmapMode = pc.BAKE_COLORDIR;
            this._stats = {
                meshInstances: 0,
                lights: 0,
                dynamicLights: 0,
                bakedLights: 0,
                lastStaticPrepareFullTime: 0,
                lastStaticPrepareSearchTime: 0,
                lastStaticPrepareWriteTime: 0,
                lastStaticPrepareTriAabbTime: 0,
                lastStaticPrepareCombineTime: 0,
                updateShadersTime: 0
            };
            this.updateShaders = true;
            this.updateSkybox = true;
            this._shaderVersion = 0;
            this._statsUpdated = false;
            // backwards compatibilty only
            this._models = [];
            pc.events.attach(this);
        }
        Scene.prototype.fire = function (arg0, arg1, arg2) {
            throw new Error("Method not implemented.");
        };
        Object.defineProperty(Scene.prototype, "fog", {
            get: function () {
                return this._fog;
            },
            set: function (type) {
                if (type !== this._fog) {
                    this._fog = type;
                    this.updateShaders = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "gammaCorrection", {
            get: function () {
                return this._gammaCorrection;
            },
            set: function (value) {
                if (value !== this._gammaCorrection) {
                    this._gammaCorrection = value;
                    this.updateShaders = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "toneMapping", {
            get: function () {
                return this._toneMapping;
            },
            set: function (value) {
                if (value !== this._toneMapping) {
                    this._toneMapping = value;
                    this.updateShaders = true;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skybox", {
            get: function () {
                return this._skyboxCubeMap;
            },
            set: function (value) {
                this._skyboxCubeMap = value;
                this._resetSkyboxModel();
                this.updateShaders = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skyboxIntensity", {
            get: function () {
                return this._skyboxIntensity;
            },
            set: function (value) {
                this._skyboxIntensity = value;
                this._resetSkyboxModel();
                this.updateShaders = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skyboxMip", {
            get: function () {
                return this._skyboxMip;
            },
            set: function (value) {
                this._skyboxMip = value;
                this._resetSkyboxModel();
                this.updateShaders = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skyboxPrefiltered128", {
            get: function () {
                return this._skyboxPrefiltered[0];
            },
            set: function (value) {
                if (this._skyboxPrefiltered[0] === value)
                    return;
                this._skyboxPrefiltered[0] = value;
                this.updateShaders = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skyboxPrefiltered64", {
            get: function () {
                return this._skyboxPrefiltered[1];
            },
            set: function (value) {
                if (this._skyboxPrefiltered[1] === value)
                    return;
                this._skyboxPrefiltered[1] = value;
                this.updateShaders = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skyboxPrefiltered32", {
            get: function () {
                return this._skyboxPrefiltered[2];
            },
            set: function (value) {
                if (this._skyboxPrefiltered[2] === value)
                    return;
                this._skyboxPrefiltered[2] = value;
                this.updateShaders = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skyboxPrefiltered16", {
            get: function () {
                return this._skyboxPrefiltered[3];
            },
            set: function (value) {
                if (this._skyboxPrefiltered[3] === value)
                    return;
                this._skyboxPrefiltered[3] = value;
                this.updateShaders = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skyboxPrefiltered8", {
            get: function () {
                return this._skyboxPrefiltered[4];
            },
            set: function (value) {
                if (this._skyboxPrefiltered[4] === value)
                    return;
                this._skyboxPrefiltered[4] = value;
                this.updateShaders = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "skyboxPrefiltered4", {
            get: function () {
                return this._skyboxPrefiltered[5];
            },
            set: function (value) {
                if (this._skyboxPrefiltered[5] === value)
                    return;
                this._skyboxPrefiltered[5] = value;
                this.updateShaders = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "drawCalls", {
            // some backwards compatibility
            // drawCalls will now return list of all active composition mesh instances
            get: function () {
                var drawCalls = this.layers._meshInstances;
                if (!drawCalls.length) {
                    this.layers._update();
                    drawCalls = this.layers._meshInstances;
                }
                return drawCalls;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scene.prototype, "layers", {
            get: function () {
                return this._layers;
            },
            set: function (layers) {
                var prev = this._layers;
                this._layers = layers;
                this.fire("set:layers", prev, layers);
            },
            enumerable: true,
            configurable: true
        });
        Scene.prototype.applySettings = function (_a) {
            var physics = _a.physics, render = _a.render;
            // settings
            this._gravity.set(physics.gravity[0], physics.gravity[1], physics.gravity[2]);
            this.ambientLight.set(render.global_ambient[0], render.global_ambient[1], render.global_ambient[2]);
            this._fog = render.fog;
            this.fogColor.set(render.fog_color[0], render.fog_color[1], render.fog_color[2]);
            this.fogStart = render.fog_start;
            this.fogEnd = render.fog_end;
            this.fogDensity = render.fog_density;
            this._gammaCorrection = render.gamma_correction;
            this._toneMapping = render.tonemapping;
            this.lightmapSizeMultiplier = render.lightmapSizeMultiplier;
            this.lightmapMaxResolution = render.lightmapMaxResolution;
            this.lightmapMode = render.lightmapMode;
            this.exposure = render.exposure;
            this._skyboxIntensity = render.skyboxIntensity === undefined ? 1 : render.skyboxIntensity;
            this._skyboxMip = render.skyboxMip === undefined ? 0 : render.skyboxMip;
            this._resetSkyboxModel();
            this.updateShaders = true;
        };
        Scene.prototype._updateSkybox = function (device) {
            var i;
            // Create skybox
            if (this._skyboxCubeMap && !this.skyboxModel) {
                var material = new pc.Material();
                var scene_1 = this;
                material.updateShader = function (dev, sc, defs, staticLightList, pass) {
                    var library = device.getProgramLibrary();
                    var shader = library.getProgram('skybox', {
                        rgbm: scene_1._skyboxCubeMap.rgbm,
                        hdr: (scene_1._skyboxCubeMap.rgbm || scene_1._skyboxCubeMap.format === pc.PIXELFORMAT_RGBA32F),
                        useIntensity: scene_1.skyboxIntensity !== 1,
                        mip: scene_1._skyboxCubeMap.fixCubemapSeams ? scene_1.skyboxMip : 0,
                        fixSeams: scene_1._skyboxCubeMap.fixCubemapSeams,
                        gamma: (pass === pc.SHADER_FORWARDHDR ? (scene_1.gammaCorrection ? pc.GAMMA_SRGBHDR : pc.GAMMA_NONE) : scene_1.gammaCorrection),
                        toneMapping: (pass === pc.SHADER_FORWARDHDR ? pc.TONEMAP_LINEAR : scene_1.toneMapping)
                    });
                    this.setShader(shader);
                };
                material.updateShader();
                var usedTex = void 0;
                if (!this._skyboxCubeMap.fixCubemapSeams || !scene_1._skyboxMip) {
                    usedTex = this._skyboxCubeMap;
                }
                else {
                    var mip2tex = [null, "64", "16", "8", "4"];
                    var mipTex = this["skyboxPrefiltered" + mip2tex[scene_1._skyboxMip]];
                    if (mipTex)
                        usedTex = mipTex;
                }
                material.setParameter("texture_cubeMap", usedTex);
                material.cull = pc.CULLFACE_NONE;
                var skyLayer = this.layers.getLayerById(pc.LAYERID_SKYBOX);
                if (skyLayer) {
                    var node = new pc.GraphNode();
                    var mesh = pc.createBox(device);
                    var meshInstance = new pc.MeshInstance(node, mesh, material);
                    meshInstance.cull = false;
                    meshInstance._noDepthDrawGl1 = true;
                    var model = new pc.Model();
                    model.graph = node;
                    model.meshInstances = [meshInstance];
                    this.skyboxModel = model;
                    skyLayer.addMeshInstances(model.meshInstances);
                    skyLayer.enabled = true;
                    this.skyLayer = skyLayer;
                    this.fire("set:skybox", usedTex);
                }
            }
        };
        Scene.prototype._resetSkyboxModel = function () {
            if (this.skyboxModel) {
                this.skyLayer.removeMeshInstances(this.skyboxModel.meshInstances);
                this.skyLayer.enabled = false;
            }
            this.skyboxModel = null;
            this.updateSkybox = true;
        };
        Scene.prototype.setSkybox = function (cubemaps) {
            var i;
            if (!cubemaps)
                cubemaps = [null, null, null, null, null, null, null];
            // check if any values actually changed
            // to prevent unnecessary recompilations
            var different = false;
            if (this._skyboxCubeMap !== cubemaps[0])
                different = true;
            if (!different) {
                for (i = 0; i < 6 && !different; i++) {
                    if (this._skyboxPrefiltered[i] !== cubemaps[i + 1])
                        different = true;
                }
            }
            if (!different)
                return;
            // set skybox
            for (i = 0; i < 6; i++)
                this._skyboxPrefiltered[i] = cubemaps[i + 1];
            this.skybox = cubemaps[0];
        };
        Scene.prototype.destroy = function () {
            this.skybox = null;
        };
        // Backwards compatibility
        Scene.prototype.addModel = function (model) {
            if (this.containsModel(model))
                return;
            var layer = this.layers.getLayerById(pc.LAYERID_WORLD);
            if (!layer)
                return;
            layer.addMeshInstances(model.meshInstances);
            this._models.push(model);
        };
        Scene.prototype.addShadowCaster = function (_a) {
            var meshInstances = _a.meshInstances;
            var layer = this.layers.getLayerById(pc.LAYERID_WORLD);
            if (!layer)
                return;
            layer.addShadowCasters(meshInstances);
        };
        Scene.prototype.removeModel = function (model) {
            var index = this._models.indexOf(model);
            if (index !== -1) {
                var layer = this.layers.getLayerById(pc.LAYERID_WORLD);
                if (!layer)
                    return;
                layer.removeMeshInstances(model.meshInstances);
                this._models.splice(index, 1);
            }
        };
        Scene.prototype.removeShadowCasters = function (_a) {
            var meshInstances = _a.meshInstances;
            var layer = this.layers.getLayerById(pc.LAYERID_WORLD);
            if (!layer)
                return;
            layer.removeShadowCasters(meshInstances);
        };
        Scene.prototype.containsModel = function (model) {
            return this._models.includes(model);
        };
        Scene.prototype.getModels = function (model) {
            return this._models;
        };
        return Scene;
    }());
    pc.Scene = Scene;
})(pc || (pc = {}));
/**
* @event
* @name pc.Scene#set:skybox
* @description Fired when the skybox is set.
* @param {pc.Texture} usedTex Previously used cubemap texture. New is in the {@link pc.Scene#skybox}.
*/
/**
* @event
* @name pc.Scene#set:layers
* @description Fired when the layer composition is set. Use this event to add callbacks or advanced properties to your layers.
* @param {pc.LayerComposition} oldComp Previously used {@link pc.LayerComposition}.
* @param {pc.LayerComposition} newComp Newly set {@link pc.LayerComposition}.
* @example
*   this.app.scene.on('set:layers', function(oldComp, newComp) {
*       var list = newComp.layerList;
*       var layer;
*       for(var i=0; i<list.length; i++) {
*           layer = list[i];
*           switch(layer.name) {
*               case 'MyLayer':
*                   layer.onEnable = myOnEnableFunction;
*                   layer.onDisable = myOnDisableFunction;
*                   break;
*               case 'MyOtherLayer':
*                   layer.shaderPass = myShaderPass;
*                   break;
*           }
*       }
*   });
*/
//# sourceMappingURL=scene.js.map