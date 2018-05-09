pc.extend(pc, (() => {
    /**
     * @enum pc.SCALEMODE
     * @name pc.SCALEMODE_NONE
     * @description Always use the application's resolution as the resolution for the {@link pc.ScreenComponent}.
     */
    pc.SCALEMODE_NONE = "none";
    /**
     * @enum pc.SCALEMODE
     * @name pc.SCALEMODE_BLEND
     * @description Scale the {@link pc.ScreenComponent} when the application's resolution is different than the ScreenComponent's referenceResolution.
     */
    pc.SCALEMODE_BLEND = "blend";

    /**
     * @component
     * @constructor
     * @name pc.ScreenComponent
     * @classdesc A ScreenComponent enables the Entity to render child {@link pc.ElementComponent}s using anchors and positions in the ScreenComponent's space.
     * @description Create a new ScreenComponent
     * @param {pc.ScreenComponentSystem} system The ComponentSystem that created this Component
     * @param {pc.Entity} entity The Entity that this Component is attached to.
     * @extends pc.Component
     * @property {Boolean} screenSpace If true then the ScreenComponent will render its child {@link pc.ElementComponent}s in screen space instead of world space. Enable this to create 2D user interfaces.
     * @property {String} scaleMode Can either be {@link pc.SCALEMODE_NONE} or {@link pc.SCALEMODE_BLEND}. See the description of referenceResolution for more information.
     * @property {Number} scaleBlend A value between 0 and 1 that is used when scaleMode is equal to {@link pc.SCALEMODE_BLEND}. Scales the ScreenComponent with width as a reference (when value is 0), the height as a reference (when value is 1) or anything in between.
     * @property {pc.Vec2} resolution The width and height of the ScreenComponent. When screenSpace is true the resolution will always be equal to {@link pc.GraphicsDevice#width} x {@link pc.GraphicsDevice#height}.
     * @property {pc.Vec2} referenceResolution The resolution that the ScreenComponent is designed for. This is only taken into account when screenSpace is true and scaleMode is {@link pc.SCALEMODE_BLEND}. If the actual resolution is different then the ScreenComponent will be scaled according to the scaleBlend value.
     */
    class ScreenComponent {
        constructor({app}, entity) {
            this._resolution = new pc.Vec2(640, 320);
            this._referenceResolution = new pc.Vec2(640,320);
            this._scaleMode = pc.SCALEMODE_NONE;
            this.scale = 1;
            this._scaleBlend = 0.5;

            this._screenSpace = false;
            this._screenMatrix = new pc.Mat4();

            app.graphicsDevice.on("resizecanvas", this._onResize, this);
        }

        set resolution({x, y}) {
            if (!this._screenSpace) {
                this._resolution.set(x, y);
            } else {
                // ignore input when using screenspace.
                this._resolution.set(this.system.app.graphicsDevice.width, this.system.app.graphicsDevice.height);
            }

            this._updateScale();

            this._calcProjectionMatrix();

            if (! this.entity._dirtyLocal)
                this.entity._dirtify(true);

            this.fire("set:resolution", this._resolution);
        }

        get resolution() {
            return this._resolution;
        }

        set referenceResolution({x, y}) {
            this._referenceResolution.set(x, y);
            this._updateScale();
            this._calcProjectionMatrix();

            if (! this.entity._dirtyLocal)
                this.entity._dirtify(true);

            this.fire("set:referenceresolution", this._resolution);
        }

        get referenceResolution() {
            if (this._scaleMode === pc.SCALEMODE_NONE) {
                return this._resolution;
            } else {
                return this._referenceResolution;
            }
        }

        set screenSpace(value) {
            this._screenSpace = value;
            if (this._screenSpace) {
                this._resolution.set(this.system.app.graphicsDevice.width, this.system.app.graphicsDevice.height);
            }
            this.resolution = this._resolution; // force update either way

            if (! this.entity._dirtyLocal)
                this.entity._dirtify(true);

            this.fire('set:screenspace', this._screenSpace);
        }

        get screenSpace() {
            return this._screenSpace;
        }

        set scaleMode(value) {
            if (value !== pc.SCALEMODE_NONE && value !== pc.SCALEMODE_BLEND) {
                value = pc.SCALEMODE_NONE;
            }

            // world space screens do not support scale modes
            if (!this._screenSpace && value !== pc.SCALEMODE_NONE) {
                value = pc.SCALEMODE_NONE;
            }

            this._scaleMode = value;
            this.resolution = this._resolution; // force update
            this.fire("set:scalemode", this._scaleMode);
        }

        get scaleMode() {
            return this._scaleMode;
        }

        set scaleBlend(value) {
            this._scaleBlend = value;
            this._updateScale();
            this._calcProjectionMatrix();

            if (! this.entity._dirtyLocal)
                this.entity._dirtify(true);

            this.fire("set:scaleblend", this._scaleBlend);
        }

        get scaleBlend() {
            return this._scaleBlend;
        }
    }

    ScreenComponent = pc.inherits(ScreenComponent, pc.Component);

    const _transform = new pc.Mat4();

    pc.extend(ScreenComponent.prototype, {
        /**
         * @function
         * @name pc.ScreenComponent#syncDrawOrder
         * @description Set the drawOrder of each child {@link pc.ElementComponent}
         * so that ElementComponents which are last in the hierarchy are rendered on top.
         */
        syncDrawOrder() {
            let i = 1;

            const recurse = e => {
                if (e.element) {
                    e.element.drawOrder = i++;
                }

                const children = e.getChildren();
                for (let j = 0; j < children.length; j++) {
                    recurse(children[j]);
                }
            };

            recurse(this.entity);
        },

        _calcProjectionMatrix() {
            let left;
            let right;
            let bottom;
            let top;
            const near = 1;
            const far = -1;

            const w = this._resolution.x / this.scale;
            const h = this._resolution.y / this.scale;

            left = 0;
            right = w;
            bottom = -h;
            top = 0;

            this._screenMatrix.setOrtho(left, right, bottom, top, near, far);

            if (!this._screenSpace) {
                _transform.setScale(0.5*w, 0.5*h, 1);
                this._screenMatrix.mul2(_transform, this._screenMatrix);
            }
        },

        _updateScale() {
            this.scale = this._calcScale(this._resolution, this.referenceResolution);
        },

        _calcScale({x, y}, {x, y}) {
            // Using log of scale values
            // This produces a nicer outcome where if you have a xscale = 2 and yscale = 0.5
            // the combined scale is 1 for an even blend
            const lx = Math.log2(x / x);
            const ly = Math.log2(y / y);
            return 2 ** (lx*(1-this._scaleBlend) + ly*this._scaleBlend);
        },

        _onResize(width, height) {
            if (this._screenSpace) {
                this._resolution.set(width, height);
                this.resolution = this._resolution; // force update
            }
        },

        onRemove() {
            this.system.app.graphicsDevice.off("resizecanvas", this._onResize, this);
            this.fire('remove');
        }
    });

    return {
        ScreenComponent
    };
})());
