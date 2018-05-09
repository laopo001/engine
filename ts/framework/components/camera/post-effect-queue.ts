pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.PostEffectQueue
     * @classdesc Used to manage multiple post effects for a camera
     * @description Create a new PostEffectQueue
     * @param {pc.Application} app The application
     * @param {pc.CameraComponent} camera The camera component
     */
    class PostEffectQueue {
        constructor(app, camera) {
            const self = this;

            this.app = app;
            this.camera = camera;
            // stores all of the post effects
            this.effects = [];
            // if the queue is enabled it will render all of its effects
            // otherwise it will not render anything
            this.enabled = false;

            // legacy
            this.depthTarget = null;

            this.renderTargetScale = 1;
            this.resizeTimeout = null;
            this.resizeLast = 0;

            this._resizeTimeoutCallback = () => {
                self.resizeRenderTargets();
            };

            camera.on('set_rect', this.onCameraRectChanged, this);
        }

        /**
         * @private
         * @function
         * @name pc.PostEffectQueue#_createOffscreenTarget
         * @description Creates a render target with the dimensions of the canvas, with an optional depth buffer
         * @param {Boolean} useDepth Set to true if you want to create a render target with a depth buffer
         * @param {Boolean} hdr Use HDR render target format
         * @returns {pc.RenderTarget} The render target
         */

        _createOffscreenTarget(useDepth, hdr) {
            const rect = this.camera.rect;

            const width = Math.floor(rect.z * this.app.graphicsDevice.width * this.renderTargetScale);
            const height = Math.floor(rect.w * this.app.graphicsDevice.height * this.renderTargetScale);

            const device = this.app.graphicsDevice;
            const format = hdr? device.getHdrFormat() : pc.PIXELFORMAT_R8_G8_B8_A8;

            const colorBuffer = new pc.Texture(device, {
                format,
                width,
                height
            });

            colorBuffer.minFilter = pc.FILTER_NEAREST;
            colorBuffer.magFilter = pc.FILTER_NEAREST;
            colorBuffer.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
            colorBuffer.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

            return new pc.RenderTarget(this.app.graphicsDevice, colorBuffer, { depth: useDepth });
        }

        _resizeOffscreenTarget(rt) {
            const rect = this.camera.rect;

            const width = Math.floor(rect.z * this.app.graphicsDevice.width * this.renderTargetScale);
            const height = Math.floor(rect.w * this.app.graphicsDevice.height * this.renderTargetScale);

            const device = this.app.graphicsDevice;
            const format = rt.colorBuffer.format;

            rt._colorBuffer.destroy();

            const colorBuffer = new pc.Texture(device, {
                format,
                width,
                height
            });

            colorBuffer.minFilter = pc.FILTER_NEAREST;
            colorBuffer.magFilter = pc.FILTER_NEAREST;
            colorBuffer.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
            colorBuffer.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

            rt._colorBuffer = colorBuffer;
            rt.destroy();
        }

        setRenderTargetScale(scale) {
            this.renderTargetScale = scale;
            this.resizeRenderTargets();
        }

        /**
         * @function
         * @name pc.PostEffectQueue#addEffect
         * @description Adds a post effect to the queue. If the queue is disabled adding a post effect will
         * automatically enable the queue.
         * @param {pc.PostEffect} effect The post effect to add to the queue.
         */
        addEffect(effect) {
            // first rendering of the scene requires depth buffer
            const isFirstEffect = this.effects.length === 0;

            const effects = this.effects;
            const newEntry = {
                effect,
                inputTarget: this._createOffscreenTarget(isFirstEffect, effect.hdr),
                outputTarget: null
            };

            // legacy compatibility: create new layer
            if (!this.layer) {
                this.layer = new pc.Layer({
                    opaqueSortMode: pc.SORTMODE_NONE,
                    transparentSortMode: pc.SORTMODE_NONE,
                    passThrough: true,
                    name: "PostEffectQueue",
                    renderTarget: this.camera.renderTarget,
                    clear: false,
                    onPostRender() {
                        for (let i=0; i<this._commandList.length; i++) {
                            this._commandList[i]();
                        }
                    }
                });
                // insert it after the last occurence of this camera
                const layerList = this.app.scene.layers.layerList;
                let order = 0;
                let i;
                let start = layerList.length - 1;
                for (i=start; i>=0; i--) {
                    if (layerList[i].id === pc.LAYERID_UI) {
                        start = i - 1;
                        layerList[i].overrideClear = true;
                        layerList[i].clearColorBuffer = false;
                        layerList[i].clearDepthBuffer = this.camera.clearDepthBuffer;
                        layerList[i].clearStencilBuffer = this.camera.clearStencilBuffer;
                        break;
                    }
                }
                for (i=start; i>=0; i--) {
                    if (layerList[i].cameras.includes(this.camera)) {
                        if (order === 0) {
                            order = i + 1;
                        }
                        layerList[i].renderTarget = newEntry.inputTarget;
                    }
                }
                this.app.scene.layers.insertOpaque(this.layer, order);
                this.layer._commandList = [];
                this.layer.isPostEffect = true;
            }

            effects.push(newEntry);

            const len = effects.length;
            if (len > 1) {
                // connect the effect with the previous effect if one exists
                effects[len - 2].outputTarget = newEntry.inputTarget;
            }

            this.enable();
        }

        /**
         * @function
         * @name pc.PostEffectQueue#removeEffect
         * @description Removes a post effect from the queue. If the queue becomes empty it will be disabled automatically.
         * @param {pc.PostEffect} effect The post effect to remove.
         */
        removeEffect(effect) {
            // find index of effect
            let index = -1;
            for (let i=0, len=this.effects.length; i<len; i++) {
                if (this.effects[i].effect === effect) {
                    index = i;
                    break;
                }
            }

            if (index >= 0) {
                if (index > 0)  {
                    // connect the previous effect with the effect after the one we're about to remove
                    this.effects[index-1].outputTarget = (index + 1) < this.effects.length ?
                        this.effects[index+1].inputTarget :
                        null;
                } else {
                    if (this.effects.length > 1) {
                        // if we removed the first effect then make sure that
                        // the input render target of the effect that will now become the first one
                        // has a depth buffer
                        if (!this.effects[1].inputTarget._depth) {
                            this.effects[1].inputTarget.destroy();
                            this.effects[1].inputTarget = this._createOffscreenTarget(true, this.effects[1].hdr);
                        }

                        this.camera.renderTarget = this.effects[1].inputTarget;
                    }
                }

                // release memory for removed effect
                this.effects[index].inputTarget.destroy();

                this.effects.splice(index, 1);
            }

            if (this.enabled) {
                if (effect.needsDepthBuffer) {
                    this.camera.releaseDepthMap();
                }
            }

            if (this.effects.length === 0) {
                this.disable();
            }
        }

        requestDepthMap() {
            for (let i=0, len=this.effects.length; i<len; i++) {
                const effect = this.effects[i].effect;
                if (effect.needsDepthBuffer) {
                    this.camera.camera.requestDepthMap();
                }
            }
        }

        releaseDepthMap() {
            for (let i=0, len=this.effects.length; i<len; i++) {
                const effect = this.effects[i].effect;
                if (effect.needsDepthBuffer) {
                    this.camera.releaseDepthMap();
                }
            }
        }

        /**
         * @function
         * @name pc.PostEffectQueue#destroy
         * @description Removes all the effects from the queue and disables it
         */
        destroy() {
            // release memory for all effects
            for (let i=0, len=this.effects.length; i<len; i++) {
                this.effects[i].inputTarget.destroy();
            }

            this.effects.length = 0;

            this.disable();
        }

        /**
         * @function
         * @name pc.PostEffectQueue#enable
         * @description Enables the queue and all of its effects. If there are no effects then the queue will not be enabled.
         */
        enable() {
            if (!this.enabled && this.effects.length) {
                this.enabled = true;

                const self = this;
                this.requestDepthMap();

                this.app.graphicsDevice.on('resizecanvas', this._onCanvasResized, this);

                // set the camera's rect to full screen. Set it directly to the
                // camera node instead of the component because we want to keep the old
                // rect set in the component for restoring the camera to its original settings
                // when the queue is disabled.
                //self.camera.camera.setRect(0, 0, 1, 1);

                // create a new command that renders all of the effects one after the other
                this.command = () => {
                    if (self.enabled) {
                        let rect = null;
                        const len = self.effects.length;
                        if (len) {
                            self.layer.renderTarget = self.effects[0].inputTarget;
                            //self.depthTarget = self.camera.camera._depthTarget;

                            for (let i=0; i<len; i++) {
                                const fx = self.effects[i];
                                //if (self.depthTarget) fx.effect.depthMap = self.depthTarget.colorBuffer;
                                if (i === len - 1) {
                                    rect = self.camera.rect;
                                }

                                fx.effect.render(fx.inputTarget, fx.outputTarget, rect);
                            }
                        }
                    }
                };

                this.layer._commandList.push(this.command);
            }
        }

        /**
         * @function
         * @name pc.PostEffectQueue#disable
         * @description Disables the queue and all of its effects.
         */
        disable() {
            if (this.enabled) {
                this.enabled = false;

                this.app.graphicsDevice.off('resizecanvas', this._onCanvasResized, this);

                this.camera.renderTarget = null;
                this.releaseDepthMap();

                const rect = this.camera.rect;
                //this.camera.camera.setRect(rect.x, rect.y, rect.z, rect.w);

                // remove the draw command
                const i = this.layer._commandList.indexOf(this.command);
                if (i >= 0) {
                    this.layer._commandList.splice(i, 1);
                }
            }
        }

        _onCanvasResized(width, height) {
            const rect = this.camera.rect;
            const device = this.app.graphicsDevice;
            this.camera.camera.aspectRatio = (device.width * rect.z) / (device.height * rect.w);

            // avoid resizing the render targets too often by using a timeout
            if (this.resizeTimeout)
                return;

            if ((pc.now() - this.resizeLast) > 100) {
                // allow resizing immediately if haven't been resized recently
                this.resizeRenderTargets();
            } else {
                // target to maximum at 10 resizes a second
                this.resizeTimeout = setTimeout(this._resizeTimeoutCallback, 100);
            }
        }

        resizeRenderTargets() {
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = null;
            }

            this.resizeLast = pc.now();

            const rect = this.camera.rect;
            const desiredWidth = Math.floor(rect.z * this.app.graphicsDevice.width * this.renderTargetScale);
            const desiredHeight = Math.floor(rect.w * this.app.graphicsDevice.height * this.renderTargetScale);

            const effects = this.effects;

            for (let i=0, len=effects.length; i<len; i++) {
                const fx = effects[i];
                if (fx.inputTarget.width !== desiredWidth ||
                    fx.inputTarget.height !== desiredHeight)  {
                    this._resizeOffscreenTarget(fx.inputTarget);
                }
            }
        }

        onCameraRectChanged(name, oldValue, newValue) {
            if (this.enabled) {
                // reset the camera node's rect to full screen otherwise
                // post effect will not work correctly
                //this.camera.camera.setRect(0, 0, 1, 1);
                this.resizeRenderTargets();
            }
        }
    }

    return {
        PostEffectQueue
    };
})());
