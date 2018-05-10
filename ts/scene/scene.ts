namespace pc {
    // Scene API enums
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_SUBTRACTIVE
     * @description Subtract the color of the source fragment from the destination fragment
     * and write the result to the frame buffer.
     */
    export const BLEND_SUBTRACTIVE = 0;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_ADDITIVE
     * @description Add the color of the source fragment to the destination fragment
     * and write the result to the frame buffer.
     */
    export const BLEND_ADDITIVE = 1;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_NORMAL
     * @description Enable simple translucency for materials such as glass. This is
     * equivalent to enabling a source blend mode of pc.BLENDMODE_SRC_ALPHA and a destination
     * blend mode of pc.BLENDMODE_ONE_MINUS_SRC_ALPHA.
     */
    export const BLEND_NORMAL = 2;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_NONE
     * @description Disable blending.
     */
    export const BLEND_NONE = 3;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_PREMULTIPLIED
     * @description Similar to pc.BLEND_NORMAL expect the source fragment is assumed to have
     * already been multiplied by the source alpha value.
     */
    export const BLEND_PREMULTIPLIED = 4;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_MULTIPLICATIVE
     * @description Multiply the color of the source fragment by the color of the destination
     * fragment and write the result to the frame buffer.
     */
    export const BLEND_MULTIPLICATIVE = 5;
    /**
     * @enum pc.BLEND
     * @name pc.BLEND_ADDITIVEALPHA
     * @description Same as pc.BLEND_ADDITIVE except the source RGB is multiplied by the source alpha.
     */
    export const BLEND_ADDITIVEALPHA = 6;

    /**
     * @enum pc.BLEND
     * @name pc.BLEND_MULTIPLICATIVE2X
     * @description Multiplies colors and doubles the result
     */
    export const BLEND_MULTIPLICATIVE2X = 7;

    /**
     * @enum pc.BLEND
     * @name pc.BLEND_SCREEN
     * @description Softer version of additive
     */
    export const BLEND_SCREEN = 8;

    /**
     * @enum pc.BLEND
     * @name pc.BLEND_MIN
     * @description Minimum color. Check app.graphicsDevice.extBlendMinmax for support.
     */
    export const BLEND_MIN = 9;

    /**
     * @enum pc.BLEND
     * @name pc.BLEND_MAX
     * @description Maximum color. Check app.graphicsDevice.extBlendMinmax for support.
     */
    export const BLEND_MAX = 10;

    /**
     * @enum pc.FOG
     * @name pc.FOG_NONE
     * @description No fog is applied to the scene.
     */
    export const FOG_NONE = 'none';
    /**
     * @enum pc.FOG
     * @name pc.FOG_LINEAR
     * @description Fog rises linearly from zero to 1 between a start and end depth.
     */
    export const FOG_LINEAR = 'linear';
    /**
     * @enum pc.FOG
     * @name pc.FOG_EXP
     * @description Fog rises according to an exponential curve controlled by a density value.
     */
    export const FOG_EXP = 'exp';
    /**
     * @enum pc.FOG
     * @name pc.FOG_EXP2
     * @description Fog rises according to an exponential curve controlled by a density value.
     */
    export const FOG_EXP2 = 'exp2';

    export const FRESNEL_NONE = 0;
    export const FRESNEL_SCHLICK = 2;

    export const LAYER_HUD = 0;
    export const LAYER_GIZMO = 1;
    export const LAYER_FX = 2;
    // 3 - 14 are custom user layers
    export const LAYER_WORLD = 15;

    // New layers
    export const LAYERID_WORLD = 0;
    export const LAYERID_DEPTH = 1;
    export const LAYERID_SKYBOX = 2;
    export const LAYERID_IMMEDIATE = 3;
    export const LAYERID_UI = 4;

    /**
     * @enum pc.LIGHTTYPE
     * @name pc.LIGHTTYPE_DIRECTIONAL
     * @description Directional (global) light source.
     */
    export const LIGHTTYPE_DIRECTIONAL = 0;
    /**
     * @enum pc.LIGHTTYPE
     * @name pc.LIGHTTYPE_POINT
     * @description Point (local) light source.
     */
    export const LIGHTTYPE_POINT = 1;
    /**
     * @enum pc.LIGHTTYPE
     * @name pc.LIGHTTYPE_SPOT
     * @description Spot (local) light source.
     */
    export const LIGHTTYPE_SPOT = 2;

    export const LIGHTFALLOFF_LINEAR = 0;
    export const LIGHTFALLOFF_INVERSESQUARED = 1;

    export const SHADOW_PCF3 = 0;
    export const SHADOW_DEPTH = 0; // alias for SHADOW_PCF3 for backwards compatibility
    export const SHADOW_VSM8 = 1;
    export const SHADOW_VSM16 = 2;
    export const SHADOW_VSM32 = 3;
    export const SHADOW_PCF5 = 4;

    export const BLUR_BOX = 0;
    export const BLUR_GAUSSIAN = 1;

    export const PARTICLESORT_NONE = 0;
    export const PARTICLESORT_DISTANCE = 1;
    export const PARTICLESORT_NEWER_FIRST = 2;
    export const PARTICLESORT_OLDER_FIRST = 3;
    export const PARTICLEMODE_GPU = 0;
    export const PARTICLEMODE_CPU = 1;
    export const EMITTERSHAPE_BOX = 0;
    export const EMITTERSHAPE_SPHERE = 1;

    /**
     * @enum pc.PROJECTION
     * @name pc.PROJECTION_PERSPECTIVE
     * @description A perspective camera projection where the frustum shape is essentially pyramidal.
     */
    export const PROJECTION_PERSPECTIVE = 0;
    /**
     * @enum pc.PROJECTION
     * @name pc.PROJECTION_ORTHOGRAPHIC
     * @description An orthographic camera projection where the frustum shape is essentially a cuboid.
     */
    export const PROJECTION_ORTHOGRAPHIC = 1;

    export const RENDERSTYLE_SOLID = 0;
    export const RENDERSTYLE_WIREFRAME = 1;
    export const RENDERSTYLE_POINTS = 2;

    export const CUBEPROJ_NONE = 0;
    export const CUBEPROJ_BOX = 1;

    export const SPECULAR_PHONG = 0;
    export const SPECULAR_BLINN = 1;

    export const GAMMA_NONE = 0;
    export const GAMMA_SRGB = 1;
    export const GAMMA_SRGBFAST = 2; // deprecated
    export const GAMMA_SRGBHDR = 3;

    export const TONEMAP_LINEAR = 0;
    export const TONEMAP_FILMIC = 1;
    export const TONEMAP_HEJL = 2;
    export const TONEMAP_ACES = 3;
    export const TONEMAP_ACES2 = 4;

    export const SPECOCC_NONE = 0;
    export const SPECOCC_AO = 1;
    export const SPECOCC_GLOSSDEPENDENT = 2;

    export const SHADERDEF_NOSHADOW = 1;
    export const SHADERDEF_SKIN = 2;
    export const SHADERDEF_UV0 = 4;
    export const SHADERDEF_UV1 = 8;
    export const SHADERDEF_VCOLOR = 16;
    export const SHADERDEF_INSTANCING = 32;
    export const SHADERDEF_LM = 64;
    export const SHADERDEF_DIRLM = 128;
    export const SHADERDEF_SCREENSPACE = 256;

    export const LINEBATCH_WORLD = 0;
    export const LINEBATCH_OVERLAY = 1;
    export const LINEBATCH_GIZMO = 2;

    export const SHADOWUPDATE_NONE = 0;
    export const SHADOWUPDATE_THISFRAME = 1;
    export const SHADOWUPDATE_REALTIME = 2;

    export const SORTKEY_FORWARD = 0;
    export const SORTKEY_DEPTH = 1;

    export const SHADER_FORWARD = 0;
    export const SHADER_FORWARDHDR = 1;
    export const SHADER_DEPTH = 2;
    export const SHADER_SHADOW = 3; // PCF3
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
    export const SHADER_PICK = 18;

    export const BAKE_COLOR = 0;
    export const BAKE_COLORDIR = 1;

    export const VIEW_CENTER = 0;
    export const VIEW_LEFT = 1;
    export const VIEW_RIGHT = 2



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
    export class Scene {
        root: any;
        _gravity: Vec3;
        _layers: any;
        _fog: any;
        fogColor: Color;
        fogStart: number;
        fogEnd: number;
        fogDensity: number;
        ambientLight: Color;
        _gammaCorrection: any;
        _toneMapping: number;
        exposure: number;
        _skyboxPrefiltered: any[];
        _skyboxCubeMap: any;
        skyboxModel: any;
        _skyboxIntensity: number;
        _skyboxMip: number;
        lightmapSizeMultiplier: number;
        lightmapMaxResolution: number;
        lightmapMode: any;
        _stats: { meshInstances: number; lights: number; dynamicLights: number; bakedLights: number; lastStaticPrepareFullTime: number; lastStaticPrepareSearchTime: number; lastStaticPrepareWriteTime: number; lastStaticPrepareTriAabbTime: number; lastStaticPrepareCombineTime: number; updateShadersTime: number; };
        updateShaders: boolean;
        updateSkybox: boolean;
        _shaderVersion: number;
        _statsUpdated: boolean;
        _models: any[];
        fire(arg0: any, arg1: any, arg2: any): any {
            throw new Error("Method not implemented.");
        }
        skyLayer: any;
        constructor() {
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

        get fog() {
            return this._fog;
        }

        set fog(type) {
            if (type !== this._fog) {
                this._fog = type;
                this.updateShaders = true;
            }
        }

        get gammaCorrection() {
            return this._gammaCorrection;
        }

        set gammaCorrection(value) {
            if (value !== this._gammaCorrection) {
                this._gammaCorrection = value;
                this.updateShaders = true;
            }
        }

        get toneMapping() {
            return this._toneMapping;
        }

        set toneMapping(value) {
            if (value !== this._toneMapping) {
                this._toneMapping = value;
                this.updateShaders = true;
            }
        }

        get skybox() {
            return this._skyboxCubeMap;
        }

        set skybox(value) {
            this._skyboxCubeMap = value;
            this._resetSkyboxModel();
            this.updateShaders = true;
        }

        get skyboxIntensity() {
            return this._skyboxIntensity;
        }

        set skyboxIntensity(value) {
            this._skyboxIntensity = value;
            this._resetSkyboxModel();
            this.updateShaders = true;
        }

        get skyboxMip() {
            return this._skyboxMip;
        }

        set skyboxMip(value) {
            this._skyboxMip = value;
            this._resetSkyboxModel();
            this.updateShaders = true;
        }

        get skyboxPrefiltered128() {
            return this._skyboxPrefiltered[0];
        }

        set skyboxPrefiltered128(value) {
            if (this._skyboxPrefiltered[0] === value)
                return;

            this._skyboxPrefiltered[0] = value;
            this.updateShaders = true;
        }

        get skyboxPrefiltered64() {
            return this._skyboxPrefiltered[1];
        }

        set skyboxPrefiltered64(value) {
            if (this._skyboxPrefiltered[1] === value)
                return;

            this._skyboxPrefiltered[1] = value;
            this.updateShaders = true;
        }

        get skyboxPrefiltered32() {
            return this._skyboxPrefiltered[2];
        }

        set skyboxPrefiltered32(value) {
            if (this._skyboxPrefiltered[2] === value)
                return;

            this._skyboxPrefiltered[2] = value;
            this.updateShaders = true;
        }

        get skyboxPrefiltered16() {
            return this._skyboxPrefiltered[3];
        }

        set skyboxPrefiltered16(value) {
            if (this._skyboxPrefiltered[3] === value)
                return;

            this._skyboxPrefiltered[3] = value;
            this.updateShaders = true;
        }

        get skyboxPrefiltered8() {
            return this._skyboxPrefiltered[4];
        }

        set skyboxPrefiltered8(value) {
            if (this._skyboxPrefiltered[4] === value)
                return;

            this._skyboxPrefiltered[4] = value;
            this.updateShaders = true;
        }

        get skyboxPrefiltered4() {
            return this._skyboxPrefiltered[5];
        }

        set skyboxPrefiltered4(value) {
            if (this._skyboxPrefiltered[5] === value)
                return;

            this._skyboxPrefiltered[5] = value;
            this.updateShaders = true;
        }

        // some backwards compatibility
        // drawCalls will now return list of all active composition mesh instances
        get drawCalls() {
            let drawCalls = this.layers._meshInstances;
            if (!drawCalls.length) {
                this.layers._update();
                drawCalls = this.layers._meshInstances;
            }
            return drawCalls;
        }

        set drawCalls(value) {

        }

        get layers() {
            return this._layers;
        }

        set layers(layers) {
            const prev = this._layers;
            this._layers = layers;
            this.fire("set:layers", prev, layers);
        }

        applySettings({ physics, render }) {
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
        }

        _updateSkybox(device) {
            let i;

            // Create skybox
            if (this._skyboxCubeMap && !this.skyboxModel) {
                const material = new pc.Material();
                const scene = this;
                material.updateShader = function (dev, sc, defs, staticLightList, pass) {
                    const library = device.getProgramLibrary();
                    const shader = library.getProgram('skybox', {
                        rgbm: scene._skyboxCubeMap.rgbm,
                        hdr: (scene._skyboxCubeMap.rgbm || scene._skyboxCubeMap.format === pc.PIXELFORMAT_RGBA32F),
                        useIntensity: scene.skyboxIntensity !== 1,
                        mip: scene._skyboxCubeMap.fixCubemapSeams ? scene.skyboxMip : 0,
                        fixSeams: scene._skyboxCubeMap.fixCubemapSeams,
                        gamma: (pass === pc.SHADER_FORWARDHDR ? (scene.gammaCorrection ? pc.GAMMA_SRGBHDR : pc.GAMMA_NONE) : scene.gammaCorrection),
                        toneMapping: (pass === pc.SHADER_FORWARDHDR ? pc.TONEMAP_LINEAR : scene.toneMapping)
                    });
                    this.setShader(shader);
                };

                material.updateShader();
                let usedTex;
                if (!this._skyboxCubeMap.fixCubemapSeams || !scene._skyboxMip) {
                    usedTex = this._skyboxCubeMap;
                } else {
                    const mip2tex = [null, "64", "16", "8", "4"];
                    const mipTex = this[`skyboxPrefiltered${mip2tex[scene._skyboxMip]}`];
                    if (mipTex)
                        usedTex = mipTex;
                }
                material.setParameter("texture_cubeMap", usedTex);
                material.cull = pc.CULLFACE_NONE;

                const skyLayer = this.layers.getLayerById(pc.LAYERID_SKYBOX);
                if (skyLayer) {
                    const node = new pc.GraphNode();
                    const mesh = pc.createBox(device);
                    const meshInstance = new pc.MeshInstance(node, mesh, material);
                    meshInstance.cull = false;
                    meshInstance._noDepthDrawGl1 = true;

                    const model = new pc.Model();
                    model.graph = node;
                    model.meshInstances = [meshInstance];
                    this.skyboxModel = model;

                    skyLayer.addMeshInstances(model.meshInstances);
                    skyLayer.enabled = true;
                    this.skyLayer = skyLayer;

                    this.fire("set:skybox", usedTex);
                }
            }
        }

        _resetSkyboxModel() {
            if (this.skyboxModel) {
                this.skyLayer.removeMeshInstances(this.skyboxModel.meshInstances);
                this.skyLayer.enabled = false;
            }
            this.skyboxModel = null;
            this.updateSkybox = true;
        }

        setSkybox(cubemaps) {
            let i;
            if (!cubemaps)
                cubemaps = [null, null, null, null, null, null, null];

            // check if any values actually changed
            // to prevent unnecessary recompilations

            let different = false;

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
        }

        destroy() {
            this.skybox = null;
        }

        // Backwards compatibility
        addModel(model) {
            if (this.containsModel(model)) return;
            const layer = this.layers.getLayerById(pc.LAYERID_WORLD);
            if (!layer) return;
            layer.addMeshInstances(model.meshInstances);
            this._models.push(model);
        }

        addShadowCaster({ meshInstances }) {
            const layer = this.layers.getLayerById(pc.LAYERID_WORLD);
            if (!layer) return;
            layer.addShadowCasters(meshInstances);
        }

        removeModel(model) {
            const index = this._models.indexOf(model);
            if (index !== -1) {
                const layer = this.layers.getLayerById(pc.LAYERID_WORLD);
                if (!layer) return;
                layer.removeMeshInstances(model.meshInstances);
                this._models.splice(index, 1);
            }
        }

        removeShadowCasters({ meshInstances }) {
            const layer = this.layers.getLayerById(pc.LAYERID_WORLD);
            if (!layer) return;
            layer.removeShadowCasters(meshInstances);
        }

        containsModel(model) {
            return this._models.includes(model);
        }

        getModels(model) {
            return this._models;
        }
    }

}

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

