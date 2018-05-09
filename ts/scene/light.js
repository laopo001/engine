pc.extend(pc, (() => {
    const spotCenter = new pc.Vec3();
    const spotEndPoint = new pc.Vec3();
    const tmpVec = new pc.Vec3();

    const chanId = { r: 0, g: 1, b: 2, a: 3 };

    /**
     * @private
     * @constructor
     * @name pc.Light
     * @classdesc A light.
     */
    class Light {
        constructor() {
            // Light properties (defaults)
            this._type = pc.LIGHTTYPE_DIRECTIONAL;
            this._color = new pc.Color(0.8, 0.8, 0.8);
            this._intensity = 1;
            this._castShadows = false;
            this._enabled = false;
            this._mask = 1;
            this.isStatic = false;
            this.key = 0;
            this.bakeDir = true;

            // Point and spot properties
            this.attenuationStart = 10;
            this.attenuationEnd = 10;
            this._falloffMode = 0;
            this._shadowType = pc.SHADOW_PCF3;
            this._vsmBlurSize = 11;
            this.vsmBlurMode = pc.BLUR_GAUSSIAN;
            this.vsmBias = 0.01 * 0.25;
            this._cookie = null; // light cookie texture (2D for spot, cubemap for point)
            this.cookieIntensity = 1;
            this._cookieFalloff = true;
            this._cookieChannel = "rgb";
            this._cookieTransform = null; // 2d rotation/scale matrix (spot only)
            this._cookieOffset = null; // 2d position offset (spot only)
            this._cookieTransformSet = false;
            this._cookieOffsetSet = false;

            // Spot properties
            this._innerConeAngle = 40;
            this._outerConeAngle = 45;

            // Cache of light property data in a format more friendly for shader uniforms
            this._finalColor = new pc.Vec3(0.8, 0.8, 0.8);
            const c = this._finalColor.data[0] ** 2.2;
            this._linearFinalColor = new pc.Vec3(c, c, c);

            this._position = new pc.Vec3(0, 0, 0);
            this._direction = new pc.Vec3(0, 0, 0);
            this._innerConeAngleCos = Math.cos(this._innerConeAngle * Math.PI / 180);
            this._outerConeAngleCos = Math.cos(this._outerConeAngle * Math.PI / 180);

            // Shadow mapping resources
            this._shadowCamera = null;
            this._shadowMatrix = new pc.Mat4();
            this.shadowDistance = 40;
            this._shadowResolution = 1024;
            this.shadowBias = -0.0005;
            this._normalOffsetBias = 0.0;
            this.shadowUpdateMode = pc.SHADOWUPDATE_REALTIME;

            this._scene = null;
            this._node = null;
            this._rendererParams = [];

            this._isVsm = false;
            this._isPcf = true;
            this._cacheShadowMap = false;
            this._isCachedShadowMap = false;

            this._visibleLength = [0]; // lengths of passes in culledList
            this._visibleList = [[]]; // culled mesh instances per pass (1 for spot, 6 for point, cameraCount for directional)
            this._visibleCameraSettings = []; // camera settings used in each directional light pass
        }

        /**
         * @private
         * @function
         * @name pc.Light#clone
         * @description Duplicates a light node but does not 'deep copy' the hierarchy.
         * @returns {pc.Light} A cloned Light.
         */
        clone() {
            const clone = new pc.Light();

            // Clone Light properties
            clone.type = this._type;
            clone.setColor(this._color);
            clone.intensity = this._intensity;
            clone.castShadows = this.castShadows;
            clone.enabled = this._enabled;

            // Point and spot properties
            clone.attenuationStart = this.attenuationStart;
            clone.attenuationEnd = this.attenuationEnd;
            clone.falloffMode = this._falloffMode;
            clone.shadowType = this._shadowType;
            clone.vsmBlurSize = this._vsmBlurSize;
            clone.vsmBlurMode = this.vsmBlurMode;
            clone.vsmBias = this.vsmBias;
            clone.shadowUpdateMode = this.shadowUpdateMode;
            clone.mask = this._mask;

            // Spot properties
            clone.innerConeAngle = this._innerConeAngle;
            clone.outerConeAngle = this._outerConeAngle;

            // Shadow properties
            clone.shadowBias = this.shadowBias;
            clone.normalOffsetBias = this._normalOffsetBias;
            clone.shadowResolution = this._shadowResolution;
            clone.shadowDistance = this.shadowDistance;

            // Cookies properties
            // clone.cookie = this._cookie;
            // clone.cookieIntensity = this.cookieIntensity;
            // clone.cookieFalloff = this._cookieFalloff;
            // clone.cookieChannel = this._cookieChannel;
            // clone.cookieTransform = this._cookieTransform;
            // clone.cookieOffset = this._cookieOffset;

            return clone;
        }

        getColor() {
            return this._color;
        }

        getBoundingSphere(sphere) {
            if (this._type===pc.LIGHTTYPE_SPOT) {
                const range = this.attenuationEnd;
                const angle = this._outerConeAngle;
                const f = Math.cos(angle * pc.math.DEG_TO_RAD);
                const node = this._node;

                spotCenter.copy(node.up);
                spotCenter.scale(-range*0.5*f);
                spotCenter.add(node.getPosition());
                sphere.center = spotCenter;

                spotEndPoint.copy(node.up);
                spotEndPoint.scale(-range);

                tmpVec.copy(node.right);
                tmpVec.scale(Math.sin(angle * pc.math.DEG_TO_RAD) * range);
                spotEndPoint.add(tmpVec);

                sphere.radius = spotEndPoint.length() * 0.5;

            } else if (this._type===pc.LIGHTTYPE_POINT) {
                sphere.center = this._node.getPosition();
                sphere.radius = this.attenuationEnd;
            }
        }

        getBoundingBox(box) {
            if (this._type===pc.LIGHTTYPE_SPOT) {
                const range = this.attenuationEnd;
                const angle = this._outerConeAngle;
                const node = this._node;

                const scl = Math.abs( Math.sin(angle * pc.math.DEG_TO_RAD) * range );

                box.center.set(0, -range*0.5, 0);
                box.halfExtents.set(scl, range*0.5, scl);

                box.setFromTransformedAabb(box, node.getWorldTransform());

            } else if (this._type===pc.LIGHTTYPE_POINT) {
                box.center.copy(this._node.getPosition());
                box.halfExtents.set(this.attenuationEnd, this.attenuationEnd, this.attenuationEnd);
            }
        }

        setColor(...args) {
            let r, g, b;
            if (args.length === 1) {
                r = args[0].r;
                g = args[0].g;
                b = args[0].b;
            } else if (args.length === 3) {
                r = args[0];
                g = args[1];
                b = args[2];
            }

            this._color.set(r, g, b);

            // Update final color
            const i = this._intensity;
            this._finalColor.set(r * i, g * i, b * i);
            for (let c=0; c<3; c++) {
                if (i >= 1) {
                    this._linearFinalColor.data[c] = this._finalColor.data[c] / i ** 2.2 * i;
                } else {
                    this._linearFinalColor.data[c] = this._finalColor.data[c] ** 2.2;
                }
            }
        }

        _destroyShadowMap() {
            if (this._shadowCamera) {
                if (!this._isCachedShadowMap) {
                    const rt = this._shadowCamera.renderTarget;
                    let i;
                    if (rt) {
                        if (rt.length) {
                            for (i=0; i<rt.length; i++) {
                                if (rt[i].colorBuffer) rt[i].colorBuffer.destroy();
                                rt[i].destroy();
                            }
                        } else {
                            if (rt.colorBuffer) rt.colorBuffer.destroy();
                            rt.destroy();
                        }
                    }
                }
                this._shadowCamera.renderTarget = null;
                this._shadowCamera = null;
                this._shadowCubeMap = null;
                if (this.shadowUpdateMode===pc.SHADOWUPDATE_NONE) {
                    this.shadowUpdateMode = pc.SHADOWUPDATE_THISFRAME;
                }
            }
        }

        updateShadow() {
            if (this.shadowUpdateMode!==pc.SHADOWUPDATE_REALTIME) {
                this.shadowUpdateMode = pc.SHADOWUPDATE_THISFRAME;
            }
        }

        updateKey() {
            // Key definition:
            // Bit
            // 31      : sign bit (leave)
            // 29 - 30 : type
            // 28      : cast shadows
            // 25 - 27 : shadow type
            // 23 - 24 : falloff mode
            // 22      : normal offset bias
            // 21      : cookie
            // 20      : cookie falloff
            // 18 - 19 : cookie channel R
            // 16 - 17 : cookie channel G
            // 14 - 15 : cookie channel B
            // 12      : cookie transform
            let key = (this._type << 29) |
                   ((this._castShadows? 1 : 0)                  << 28) |
                   (this._shadowType                            << 25) |
                   (this._falloffMode                           << 23) |
                   ((this._normalOffsetBias!==0.0? 1 : 0)       << 22) |
                   ((this._cookie? 1 : 0)                       << 21) |
                   ((this._cookieFalloff? 1 : 0)                << 20) |
                   (chanId[this._cookieChannel.charAt(0)]       << 18) |
                   ((this._cookieTransform? 1 : 0)              << 12);

            if (this._cookieChannel.length===3) {
                key |= (chanId[this._cookieChannel.charAt(1)]   << 16);
                key |= (chanId[this._cookieChannel.charAt(2)]   << 14);
            }

            this.key = key;
        }

        get enabled() {
            return this._type;
        }

        set enabled(value) {
            if (this._type === value)
                return;

            this._enabled = value;
            if (this._scene !== null)
                this._scene.updateShaders = true;
        }

        get type() {
            return this._type;
        }

        set type(value) {
            if (this._type === value)
                return;

            this._type = value;
            this._destroyShadowMap();
            if (this._scene !== null)
                this._scene.updateShaders = true;
            this.updateKey();

            const stype = this._shadowType;
            this._shadowType = null;
            this.shadowType = stype; // refresh shadow type; switching from direct/spot to point and back may change it

            if (this._scene !== null) this._scene.layers._dirtyLights = true;
        }

        get mask() {
            return this._mask;
        }

        set mask(value) {
            if (this._mask === value)
                return;

            this._mask = value;
            if (this._scene !== null)
                this._scene.updateShaders = true;
        }

        get shadowType() {
            return this._shadowType;
        }

        set shadowType(value) {
            if (this._shadowType === value)
                return;

            const device = pc.Application.getApplication().graphicsDevice;

            if (this._type === pc.LIGHTTYPE_POINT)
                value = pc.SHADOW_PCF3; // VSM or HW PCF for point lights is not supported yet

            if (value === pc.SHADOW_PCF5 && !device.webgl2) {
                value = pc.SHADOW_PCF3; // fallback from HW PCF to old PCF
            }

            if (value === pc.SHADOW_VSM32 && ! device.extTextureFloatRenderable) // fallback from vsm32 to vsm16
                value = pc.SHADOW_VSM16;

            if (value === pc.SHADOW_VSM16 && ! device.extTextureHalfFloatRenderable) // fallback from vsm16 to vsm8
                value = pc.SHADOW_VSM8;

            this._isVsm = value >= pc.SHADOW_VSM8 && value <= pc.SHADOW_VSM32;
            this._isPcf = value === pc.SHADOW_PCF5 || value === pc.SHADOW_PCF3;

            this._shadowType = value;
            this._destroyShadowMap();
            if (this._scene !== null)
                this._scene.updateShaders = true;
            this.updateKey();
        }

        get castShadows() {
            return this._castShadows && this._mask !== pc.MASK_LIGHTMAP && this._mask !== 0;
        }

        set castShadows(value) {
            if (this._castShadows === value)
                return;

            this._castShadows = value;
            if (this._scene !== null)
                this._scene.updateShaders = true;
            this.updateKey();
        }

        get shadowResolution() {
            return this._shadowResolution;
        }

        set shadowResolution(value) {
            if (this._shadowResolution === value)
                return;

            const device = pc.Application.getApplication().graphicsDevice;
            if (this._type === pc.LIGHTTYPE_POINT) {
                value = Math.min(value, device.maxCubeMapSize);
            } else {
                value = Math.min(value, device.maxTextureSize);
            }
            this._shadowResolution = value;
        }

        get vsmBlurSize() {
            return this._vsmBlurSize;
        }

        set vsmBlurSize(value) {
            if (this._vsmBlurSize === value)
                return;

            if (value % 2 === 0) value++; // don't allow even size
            this._vsmBlurSize = value;
        }

        get normalOffsetBias() {
            return this._normalOffsetBias;
        }

        set normalOffsetBias(value) {
            if (this._normalOffsetBias === value)
                return;

            if ((! this._normalOffsetBias && value) || (this._normalOffsetBias && ! value)) {
                if (this._scene !== null)
                    this._scene.updateShaders = true;
                this.updateKey();
            }
            this._normalOffsetBias = value;
        }

        get falloffMode() {
            return this._falloffMode;
        }

        set falloffMode(value) {
            if (this._falloffMode === value)
                return;

            this._falloffMode = value;
            if (this._scene !== null)
                this._scene.updateShaders = true;
            this.updateKey();
        }

        get innerConeAngle() {
            return this._innerConeAngle;
        }

        set innerConeAngle(value) {
            if (this._innerConeAngle === value)
                return;

            this._innerConeAngle = value;
            this._innerConeAngleCos = Math.cos(value * Math.PI / 180);
        }

        get outerConeAngle() {
            return this._outerConeAngle;
        }

        set outerConeAngle(value) {
            if (this._outerConeAngle === value)
                return;

            this._outerConeAngle = value;
            this._outerConeAngleCos = Math.cos(value * Math.PI / 180);
        }

        get intensity() {
            return this._intensity;
        }

        set intensity(value) {
            if (this._intensity === value)
                return;

            this._intensity = value;

            // Update final color
            const c = this._color.data;
            const r = c[0];
            const g = c[1];
            const b = c[2];
            const i = this._intensity;
            this._finalColor.set(r * i, g * i, b * i);
            for (let j = 0; j < 3; j++) {
                if (i >= 1) {
                    this._linearFinalColor.data[j] = this._finalColor.data[j] / i ** 2.2 * i;
                } else {
                    this._linearFinalColor.data[j] = this._finalColor.data[j] ** 2.2;
                }
            }
        }

        get cookie() {
            return this._cookie;
        }

        set cookie(value) {
            if (this._cookie === value)
                return;

            this._cookie = value;
            if (this._scene !== null)
                this._scene.updateShaders = true;
            this.updateKey();
        }

        get cookieFalloff() {
            return this._cookieFalloff;
        }

        set cookieFalloff(value) {
            if (this._cookieFalloff === value)
                return;

            this._cookieFalloff = value;
            if (this._scene !== null)
                this._scene.updateShaders = true;
            this.updateKey();
        }

        get cookieChannel() {
            return this._cookieChannel;
        }

        set cookieChannel(value) {
            if (this._cookieChannel === value)
                return;

            if (value.length < 3) {
                const chr = value.charAt(value.length - 1);
                const addLen = 3 - value.length;
                for (let i = 0; i < addLen; i++)
                    value += chr;
            }
            this._cookieChannel = value;
            if (this._scene !== null)
                this._scene.updateShaders = true;
            this.updateKey();
        }

        get cookieTransform() {
            return this._cookieTransform;
        }

        set cookieTransform(value) {
            if (this._cookieTransform === value)
                return;

            const xformOld = !! (this._cookieTransformSet || this._cookieOffsetSet);
            const xformNew = !! (value || this._cookieOffsetSet);
            if (xformOld !== xformNew) {
                if (this._scene !== null)
                    this._scene.updateShaders = true;
            }
            this._cookieTransform = value;
            this._cookieTransformSet = !! value;
            if (value && ! this._cookieOffset) {
                this.cookieOffset = new pc.Vec2(); // using transform forces using offset code
                this._cookieOffsetSet = false;
            }
            this.updateKey();
        }

        get cookieOffset() {
            return this._cookieOffset;
        }

        set cookieOffset(value) {
            if (this._cookieOffset === value)
                return;

            const xformOld = !! (this._cookieTransformSet || this._cookieOffsetSet);
            const xformNew = !! (this._cookieTransformSet || value);
            if (xformOld !== xformNew) {
                if (this._scene !== null)
                    this._scene.updateShaders = true;
            }
            if (xformNew && !value && this._cookieOffset) {
                this._cookieOffset.set(0,0);
            } else {
                this._cookieOffset = value;
            }
            this._cookieOffsetSet = !! value;
            if (value && ! this._cookieTransform) {
                this.cookieTransform = new pc.Vec4(1,1,0,0); // using offset forces using matrix code
                this._cookieTransformSet = false;
            }
            this.updateKey();
        }
    }


    return {
        Light
    };
})());
