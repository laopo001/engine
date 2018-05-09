pc.extend(pc, (() => {
    const _backbufferRt = [null, null]; // 2 RTs may be needed for ping-ponging
    let _constInput = null;
    let _constScreenSize;
    const _constScreenSizeValue = new pc.Vec4();
    const _postEffectChain = [];
    let _backbufferRtUsed = false;
    let _backbufferRt2Used = false;
    let _backbufferRtWrittenByPost = false;

    const _regexUniforms = /uniform[ \t\n\r]+\S+[ \t\n\r]+\S+[ \t\n\r]*\;/g;
    const _regexUniformStart = /\S+[ \t\n\r]*\;/;
    const _regexUniformEnd = /[ \t\n\r]*\;/;
    const _regexVariables = /(float|int|bool|vec2|vec3|vec4|struct)([ \t\n\r]+[^\;]+[ \t\n\r]*\,*)+\;/g;
    const _regexVariableSurroundings = /(float|int|bool|vec2|vec3|vec4|struct|\,|\;|\{|\})/g;
    const _regexIrrelevantVariables = /(uniform|varying|in|out)[ \t\n\r]+(float|int|bool|vec2|vec3|vec4|struct)([ \t\n\r]+[^\;]+[ \t\n\r]*\,*)+\;/g;
    const _regexIrrelevantVariableSurroundings = /(float|int|bool|vec2|vec3|vec4|struct|uniform|varying|in|out|\,|\;|\{|\})/g;
    const _regexVersion = /#version/g;
    const _regexFragColor = /out highp vec4 pc_fragColor;/g;
    const _regexFragColor2 = /#define gl_FragColor/g;
    const _regexFragColor3 = /gl_FragColor/g;
    const _regexColorBuffer = /uniform[ \t\n\r]+sampler2D[ \t\n\r]+uColorBuffer;/g;
    const _regexUv = /(varying|in)[ \t\n\r]+vec2[ \t\n\r]+vUv0;/g;
    const _regexColorBufferSample = /(texture2D|texture)[ \t\n\r]*\([ \t\n\r]*uColorBuffer/g;
    const _regexMain = /void[ \t\n\r]+main/g;

    const _createBackbufferRt = (id, device, format) => {
        const tex = new pc.Texture(device, {
            format,
            width: device.width,
            height: device.height
        });
        tex.minFilter = pc.FILTER_NEAREST;
        tex.magFilter = pc.FILTER_NEAREST;
        tex.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
        tex.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

        _backbufferRt[id]._colorBuffer = tex;
    };

    const _destroyBackbufferRt = id => {
        _backbufferRt[id].colorBuffer.destroy();
        _backbufferRt[id].destroy();
    };

    const _collectUniforms = code => {
        const strs = code.match(_regexUniforms) || []; // look ma I know regexp
        let start, end, uname;
        const uniforms = [];
        for (let i=0; i<strs.length; i++) {
            start = strs[i].search(_regexUniformStart);
            end = strs[i].search(_regexUniformEnd);
            uname = strs[i].substr(start, end - start);
            if (uname !== "uColorBuffer") { // this one is OK to be shared
                uniforms.push(uname);
            }
        }
        return uniforms;
    };

    const _uniformsCollide = (layers, chain, count, {definition}) => {
        const uniforms = _collectUniforms(definition.fshader);
        if (uniforms.length === 0) return false;

        let i, j, k, uniforms2;
        let uname;
        for (i=0; i<count; i++) {
            for (j=0; j<uniforms.length; j++) {
                uname = uniforms[j];
                uniforms2 = _collectUniforms(layers[chain[i]].shader.definition.fshader);
                for (k=0; k<uniforms2.length; k++) {
                    if (uniforms2[k] === uname) {
                        return true;
                    }
                }
            }
        }

        return false;
    };

    // collect global vars and return collisions with what's already in the list
    const _collectGlobalTempVars = (code, list) => {
        // Get code without any scoped stuff
        const len = code.length;
        let chr;
        let scopeStart = 0;
        let scopeEnd = 0;
        let scopeDepth = 0;
        let codeStart = 0;
        let codeWithoutScopes = "";
        let i, j;
        for (i=0; i<len; i++) {
            chr = code.charAt(i);
            if (chr === "{") {
                if (scopeDepth === 0) {
                    scopeStart = i;
                }
                scopeDepth++;
            } else if (chr === "}") {
                if (scopeDepth === 1) {
                    scopeEnd = i;
                    codeWithoutScopes += code.substr(codeStart, (scopeStart - codeStart) + 1);
                    codeStart = scopeEnd;
                }
                scopeDepth--;
            }
        }
        codeWithoutScopes += code.substr(codeStart, (code.length - codeStart) + 1);

        // Find all global variable declarations and detect collisions
        // ... won't work with re#defined types
        let collisions = null;
        const decls = codeWithoutScopes.match(_regexVariables) || [];
        let vars, varName;
        for (i=0; i<decls.length; i++) {
            vars = decls[i].split(",");
            for (j=0; j<vars.length; j++) {
                varName = vars[j].replace(_regexVariableSurroundings, "").trim();
                if (list.includes(varName)) {
                    if (!collisions) collisions = [];
                    collisions.push(varName);
                } else {
                    list.push(varName);
                }
            }
        }

        // find all varying/uniform declarations (ideally should be possible to filter them out with first search...)
         //and remove from list
        const irrelevantDecls = codeWithoutScopes.match(_regexIrrelevantVariables) || [];
        let index;
        for (i=0; i<irrelevantDecls.length; i++) {
            vars = irrelevantDecls[i].split(",");
            for (j=0; j<vars.length; j++) {
                varName = vars[j].replace(_regexIrrelevantVariableSurroundings, "").trim();
                index = list.indexOf(varName);
                if (index >= 0) {
                    list.splice(index, 1);
                }
            }
        }

        return collisions;
    };

    /**
     * @name pc.PostEffectPass
     */
    class PostEffectPass {
        constructor(app, options) {
            this.app = app;
            this.srcRenderTarget = options.srcRenderTarget;
            this.hdr = options.hdr;
            this.blending = options.blending;
            this.shader = options.shader;
            this.setup = options.setup;

            const self = this;
            const device = app.graphicsDevice;

            this.layer = new pc.Layer({ // grab that and put to layer composition
                opaqueSortMode: pc.SORTMODE_NONE,
                transparentSortMode: pc.SORTMODE_NONE,
                passThrough: true,
                name: options.name,

                onPostRender() {
                    if (self.srcRenderTarget) {
                        _constScreenSizeValue.x = self.srcRenderTarget.width;
                        _constScreenSizeValue.y = self.srcRenderTarget.height;
                        _constScreenSizeValue.z = 1.0 / self.srcRenderTarget.width;
                        _constScreenSizeValue.w = 1.0 / self.srcRenderTarget.height;
                    } else {
                        _constScreenSizeValue.x = device.width;
                        _constScreenSizeValue.y = device.height;
                        _constScreenSizeValue.z = 1.0 / device.width;
                        _constScreenSizeValue.w = 1.0 / device.height;
                    }
                    _constScreenSize.setValue(_constScreenSizeValue.data)

                    if (this._postEffectCombined && this._postEffectCombined < 0) {
                        if (self.setup) self.setup(device, self, _constScreenSizeValue, null, this.renderTarget);
                        return;
                    }

                    let src;
                    if (this._postEffectCombinedSrc) {
                        src = this._postEffectCombinedSrc;
                    } else {
                        src = self.srcRenderTarget ? self.srcRenderTarget : _backbufferRt[this._backbufferRtId];
                    }
                    if (src._samples > 1) src.resolve(true, false);
                    const tex = src._colorBuffer;
                    tex.magFilter = (this._postEffectCombinedShader ? this._postEffectCombinedBilinear : this.postEffectBilinear) ? pc.FILTER_LINEAR : pc.FILTER_NEAREST;

                    _constInput.setValue(tex);
                    if (self.setup) self.setup(device, self, _constScreenSizeValue, src, this.renderTarget);

                    const shader = this._postEffectCombinedShader ? this._postEffectCombinedShader : this.shader;
                    if (shader) pc.drawQuadWithShader(device, this.renderTarget, shader, null, null, self.blending);

                    if (self.srcRenderTarget) return; // don't do anything else if this effect was not reading backbuffer RT
                    // remap RT back to actual backbuffer in all layers prior to this effect
                    const layers = app.scene.layers.layerList;
                    for (let i=0; i<layers.length; i++) {
                        if (layers[i] === self.layer) break;
                        if (layers[i].renderTarget === _backbufferRt[0] || layers[i].renderTarget === _backbufferRt[1]) {
                            layers[i].renderTarget = null;
                        }
                    }
                }
            });

            this.layer._generateCameraHash(); // post effect doesn't contain actual cameras, but we need to generate cam data
            this.layer.isPostEffect = true;
            this.layer.unmodifiedUvs = options.unmodifiedUvs;
            this.layer.postEffectBilinear = options.bilinear;
            this.layer.postEffect = this;
            this.layer.shader = options.shader;
            this.layer.renderTarget = options.destRenderTarget;

            if (!_constInput) {
                // system initialization
                _constInput = device.scope.resolve("uColorBuffer"); // default input texture uniform name
                _constScreenSize = device.scope.resolve("uScreenSize");
                const _backbufferMsaa = device.supportsMsaa ? 4 : 1; // if context is created with antialias: true, backbuffer RT will use 4 MSAA samples
                for (let i=0; i<2; i++) { // create backbuffer RT objects, but don't allocate any memory for them just yet
                    _backbufferRt[i] = new pc.RenderTarget({
                        depth: true,
                        stencil: device.supportsStencil,
                        samples: _backbufferMsaa,
                        autoResolve: false
                    });
                    _backbufferRt[i].name = `backbuffer${i}`;
                }
                app.on("prerender", () => { // before every app.render, if any effect reads from backbuffer, we must replace real backbuffer with our backbuffer RTs prior to effect

                    const layers = app.scene.layers.layerList;
                    let i, j;
                    let offset = 0;
                    let rtId = 0;
                    _backbufferRtUsed = false;
                    _backbufferRt2Used = false;
                    _backbufferRtWrittenByPost = false;
                    let backbufferRtFormat = pc.PIXELFORMAT_R8_G8_B8_A8;

                    if (app.scene.layers._dirty) {
                        // only called if layer order changed
                        // detect chains of posteffects and combine if possible
                        // won't work with uniform collisions
                        // #ifdef DEBUG
                        console.log("Trying to combine shaders...");
                        // #endif
                        let iterator = 0;
                        let breakChain = false;
                        let collisions, k;
                        for (i=0; i<layers.length; i++) {
                            breakChain = false;

                            if (layers[i].isPostEffect && (iterator === 0 || (layers[i].unmodifiedUvs && layers[i].shader && !_uniformsCollide(layers, _postEffectChain, iterator, layers[i].shader)))) {
                                _postEffectChain[iterator] = i; // add effect to chain
                                iterator++;
                                if (i === layers.length - 1) breakChain = true; // this is the last layer
                            } else {
                                if (iterator > 0) {
                                    breakChain = true; // next layer is not effect
                                }
                            }

                            if (breakChain) {
                                if (iterator > 1) {
                                    //console.log(_postEffectChain);
                                    // combine multiple shaders

                                    let cachedName = "post_";
                                    let layer;
                                    for (j=0; j<iterator; j++) {
                                        layer = layers[_postEffectChain[j]];
                                        cachedName += layer.name ? layer.name : layer.id;
                                        if (j < iterator - 1) cachedName += "_";
                                    }
                                    let shader = device.programLib._cache[cachedName];
                                    if (!shader) {
                                        let subCode;
                                        let code = "vec4 shaderOutput;\n"; // this is will be used instead of gl_FragColor; reading from real gl_FragColor is buggy on some platforms
                                        let mainCode = "void main() {\n";
                                        const globalTempVars = [];

                                        for (j=0; j<iterator; j++) {
                                            subCode = `${layers[_postEffectChain[j]].shader.definition.fshader}\n`;
                                            /*
                                                For every shader's code:
                                                - Replace #version, because createShaderFromCode will append a new one anyway;
                                                - Replace pc_fragColor and #define gl_FragColor for the same reason;
                                                - Replace any usage of gl_FragColor to shaderOutput;
                                            */
                                            subCode = subCode.replace(_regexVersion, "//").replace(_regexFragColor, "//").replace(_regexFragColor2, "//").replace(_regexFragColor3, "shaderOutput");
                                            if (j > 0) {
                                                /*
                                                    For every shader's code > 0:
                                                    - Remove definition of uColorBuffer (should be defined in code 0 already);
                                                    - Remove definition of vUv0 (same reason);
                                                    - Replace reading from uColorBuffer with reading from shaderOutput.
                                                */
                                                subCode = subCode.replace(_regexColorBuffer, "//").replace(_regexUv, "//").replace(_regexColorBufferSample, "shaderOutput;\/\/");
                                            }
                                            // Replace main() with mainX()
                                            subCode = subCode.replace(_regexMain, `void main${j}`);

                                            // Check for global variable collisions
                                            collisions = _collectGlobalTempVars(subCode, globalTempVars);
                                            if (collisions) {
                                                for (k=0; k<collisions.length; k++) {
                                                    subCode = subCode.replace(new RegExp(`\\b${collisions[k]}\\b`, 'g'), `${collisions[k]}NNNN${j}`);
                                                }
                                            }

                                            code += subCode;
                                            mainCode += `main${j}();\n`;
                                        }
                                        mainCode += "gl_FragColor = shaderOutput;\n}\n";
                                        shader = pc.shaderChunks.createShaderFromCode(device,
                                                                                      pc.shaderChunks.fullscreenQuadVS,
                                                                                      code + mainCode,
                                                                                      cachedName);
                                        // #ifdef DEBUG
                                        console.log(`Combined ${cachedName}`);
                                        // #endif
                                    }
                                    for (j=0; j<iterator; j++) {
                                        layers[_postEffectChain[j]]._postEffectCombined = (j === iterator - 1) ? 1 : -1;
                                    }
                                    layers[_postEffectChain[iterator - 1]]._postEffectCombinedShader = shader;
                                    layers[_postEffectChain[iterator - 1]]._postEffectCombinedBilinear = layers[_postEffectChain[0]].postEffectBilinear;
                                    layers[_postEffectChain[iterator - 1]]._postEffectCombinedSrc = layers[_postEffectChain[0]].postEffect.srcRenderTarget;
                                }
                                _postEffectChain[0] = i; // add effect to new chain
                                iterator = 1;
                            }
                        }
                    }

                    /*
                    getting from
                        world -> backbuffer
                        backbuffer -> post1 -> backbuffer
                        backbuffer -> post2 -> backbuffer
                    to
                        world -> rt0
                        rt0 -> post1 -> rt1
                        rt1 -> post2 -> backbuffer
                    */


                    /*
                        other case:
                            world -> backbuffer
                            backbuffer -> post -> someRt
                            otherObjects -> backbuffer
                        ->
                            world -> rt0
                            rt0 -> post -> someRt
                            otherObjects -> rt0
                            if no posteffects writing backbuffer, rt0 -> backbuffer
                    */

                    for (i=0; i<layers.length; i++) {
                        if (layers[i].isPostEffect && ((!layers[i].postEffect.srcRenderTarget && !layers[i]._postEffectCombined) ||
                                                       (!layers[i].postEffect._postEffectCombinedSrc && layers[i]._postEffectCombined >= 0))) { // layer i is posteffect reading from backbuffer
                            for (j=i-1; j>=offset; j--) {
                                if (!layers[j].renderTarget) { // layer j is prior to layer i and is rendering to backbuffer
                                    layers[j].renderTarget = _backbufferRt[rtId]; // replace backbuffer with backbuffer RT
                                }
                            }
                            layers[i]._backbufferRtId = rtId; // set input hint for post effect
                            offset = i;
                            _backbufferRtUsed = true; // 1st backbuffer RT used
                            if (rtId === 1) _backbufferRt2Used = true; // 2nd backbuffer RT used
                            if (layers[i].postEffect.hdr) {
                                // backbuffer RT must be HDR
                                if (device.webgl2 && device.extTextureFloatRenderable) {
                                    backbufferRtFormat = pc.PIXELFORMAT_111110F;
                                } else if (device.extTextureHalfFloatLinear && device.extTextureHalfFloatRenderable) {
                                    backbufferRtFormat = pc.PIXELFORMAT_RGBA16F;
                                } else {
                                    backbufferRtFormat = pc.PIXELFORMAT_R8_G8_B8_A8;
                                }
                            }
                            if (layers[i].postEffect.shader && !layers[i].renderTarget) rtId = 1 - rtId; // pingpong RT if posteffect both reads/writes backbuffer

                        } else if (!layers[i].isPostEffect && !layers[i].renderTarget && _backbufferRtUsed) { // layer is not post effect, rendering to backbuffer, and backbuffer was replaced before
                            layers[i].renderTarget = _backbufferRt[rtId]; // replace backbuffer with backbuffer RT
                        }

                        if (layers[i].isPostEffect && !layers[i].renderTarget) {
                            _backbufferRtWrittenByPost = true;
                        }
                    }

                    // create/resize backbuffer render target if needed

                    if (_backbufferRtUsed) {
                        if (!_backbufferRt[0].colorBuffer) {
                            _createBackbufferRt(0, device, backbufferRtFormat);
                        } else if (_backbufferRt[0].width !== device.width || _backbufferRt[0].height !== device.height || _backbufferRt[0]._colorBuffer._format !== backbufferRtFormat) {
                            _destroyBackbufferRt(0);
                            _createBackbufferRt(0, device, backbufferRtFormat);
                        }
                    }

                    if (_backbufferRt2Used) {
                        if (!_backbufferRt[1].colorBuffer) {
                            _createBackbufferRt(1, device, backbufferRtFormat);
                        } else if (_backbufferRt[1].width !== device.width || _backbufferRt[1].height !== device.height || _backbufferRt[1]._colorBuffer._format !== backbufferRtFormat) {
                            _destroyBackbufferRt(1);
                            _createBackbufferRt(1, device, backbufferRtFormat);
                        }
                    }

                }, this);

                app.on("postrender", () => { // after every app.render test if there were no effect writing to actual backbuffer, and if so, copy it from replaced backbuffer
                    const device = app.graphicsDevice;
                    if (_backbufferRtUsed && !_backbufferRtWrittenByPost) {
                        const layers = app.scene.layers.layerList;
                        let rt;
                        for (let i=layers.length - 1; i >= 0; i--) {
                            rt = layers[i].renderTarget;
                            if (rt === _backbufferRt[0] || rt === _backbufferRt[1]) {
                                break;
                            }
                        }
                        if (rt) {
                            if (rt._samples > 1) {
                                rt.resolve(true, false);
                            }
                            device.copyRenderTarget(rt, null, true, false);
                        }
                    }
                }, this);
            }
        }

        addToComposition(order) {
            this.app.scene.layers.insertTransparent(this.layer, order);
        }
    }

    return {
        PostEffectPass
    };
})());
