pc.extend(pc, (() => {
    /**
     * @private
     * @enum pc.SPRITE_RENDERMODE
     * @name pc.SPRITE_RENDERMODE_SIMPLE
     * @description This mode renders a sprite as a simple quad.
     */
    pc.SPRITE_RENDERMODE_SIMPLE = 0;

    /**
     * @private
     * @enum pc.SPRITE_RENDERMODE
     * @name pc.SPRITE_RENDERMODE_SLICED
     * @description This mode renders a sprite using 9-slicing in 'sliced' mode. Sliced mode stretches the
     * top and bottom regions of the sprite horizontally, the left and right regions vertically and the middle region
     * both horizontally and vertically.
     */
    pc.SPRITE_RENDERMODE_SLICED = 1;

    /**
     * @private
     * @enum pc.SPRITE_RENDERMODE
     * @name pc.SPRITE_RENDERMODE_TILED
     * @description This mode renders a sprite using 9-slicing in 'tiled' mode. Tiled mode tiles the
     * top and bottom regions of the sprite horizontally, the left and right regions vertically and the middle region
     * both horizontally and vertically.
     */
    pc.SPRITE_RENDERMODE_TILED = 2;

    // normals are the same for every mesh
    const normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ];

    // indices are the same for every mesh
    const indices = [
        0, 1, 3,
        2, 3, 1
    ];


    /**
     * @private
     * @constructor
     * @name pc.Sprite
     * @classdesc A pc.Sprite is contains references to one or more frames of a {@link pc.TextureAtlas}. It can be used
     * by the {@link pc.SpriteComponent} or the {@link pc.ElementComponent} to render a single frame or a sprite animation.
     * @param {pc.GraphicsDevice} device The graphics device of the application.
     * @param {Object} options Options for creating the pc.Sprite.
     * @param {Number} [options.pixelsPerUnit] The number of pixels that map to one PlayCanvas unit.
     * @param {pc.SPRITE_RENDERMODE} [options.renderMode] The rendering mode of the Sprite.
     * @param {pc.TextureAtlas} [options.atlas] The texture atlas.
     * @property {String[]} [options.frameKeys] The keys of the frames in the sprite atlas that this sprite is using.
     * @property {Number} pixelsPerUnit The number of pixels that map to one PlayCanvas unit.
     * @property {pc.TextureAtlas} atlas The texture atlas.
     * @property {pc.SPRITE_RENDERMODE} renderMode The rendering mode of the Sprite.
     * @property {String[]} frameKeys The keys of the frames in the sprite atlas that this sprite is using.
     * @property {pc.Mesh[]} meshes An array that contains a mesh for each frame.
     */
    class Sprite {
        constructor(device, options) {
            this._device = device;
            this._pixelsPerUnit = options && options.pixelsPerUnit !== undefined ? options.pixelsPerUnit : 1;
            this._renderMode = options && options.renderMode !== undefined ? options.renderMode : pc.SPRITE_RENDERMODE_SIMPLE;
            this._atlas = options && options.atlas !== undefined ? options.atlas : null;
            this._frameKeys = options && options.frameKeys !== undefined ? options.frameKeys : null;
            this._meshes = [];

            // set to true to update multiple
            // properties without re-creating meshes
            this._updatingProperties = false;
            // if true, endUpdate() will re-create meshes when it's called
            this._meshesDirty = false;

            pc.events.attach(this);

            if (this._atlas && this._frameKeys) {
                this._createMeshes();
            }
        }

        _createMeshes() {
            let i, len;

            // destroy old meshes
            for (i = 0, len = this._meshes.length; i < len; i++) {
                const mesh = this._meshes[i];
                if (! mesh) continue;

                mesh.vertexBuffer.destroy();
                for (let j = 0, len2 = mesh.indexBuffer.length; j<len2; j++) {
                    mesh.indexBuffer[j].destroy();
                }
            }

            // clear meshes array
            const count = this._frameKeys.length;
            this._meshes = new Array(count);

            // get function to create meshes
            const createMeshFunc = (this.renderMode === pc.SPRITE_RENDERMODE_SLICED || this._renderMode === pc.SPRITE_RENDERMODE_TILED ? this._create9SliceMesh : this._createSimpleMesh);

            // create a mesh for each frame in the sprite
            for (i = 0; i < count; i++) {
                const frame = this._atlas.frames[this._frameKeys[i]];
                this._meshes[i] = frame ? createMeshFunc.call(this, frame) : null;
            }

            this.fire('set:meshes');
        }

        _createSimpleMesh(frame) {
            const rect = frame.rect;
            const texWidth = this._atlas.texture.width;
            const texHeight = this._atlas.texture.height;

            const w = rect.data[2] / this._pixelsPerUnit;
            const h = rect.data[3] / this._pixelsPerUnit;
            const hp = frame.pivot.x;
            const vp = frame.pivot.y;

            // positions based on pivot and size of frame
            const positions = [
                -hp*w,          -vp*h,          0,
                (1 - hp) * w,   -vp*h,          0,
                (1 - hp) * w,   (1 - vp) * h,   0,
                -hp*w,          (1 - vp) * h,   0
            ];


            // uvs based on frame rect
            // uvs
            const lu = rect.data[0] / texWidth;
            const bv = rect.data[1] / texHeight;
            const ru = (rect.data[0] + rect.data[2]) / texWidth;
            const tv = (rect.data[1] + rect.data[3]) / texHeight;

            const uvs = [
                lu, bv,
                ru, bv,
                ru, tv,
                lu, tv
            ];

            const mesh = pc.createMesh(this._device, positions, {
                uvs,
                normals,
                indices
            });

            return mesh;
        }

        _create9SliceMesh() {
            // Check the supplied options and provide defaults for unspecified ones
            const he = pc.Vec2.ONE;
            const ws = 3;
            const ls = 3;

            // Variable declarations
            let i, j;
            let x, y, z, u, v;
            const positions = [];
            const normals = [];
            const uvs = [];
            const uvs1 = [];
            const indices = [];

            // Generate plane as follows (assigned UVs denoted at corners):
            // (0,1)x---------x(1,1)
            //      |         |
            //      |         |
            //      |    O--X |length
            //      |    |    |
            //      |    Z    |
            // (0,0)x---------x(1,0)
            //         width
            let vcounter = 0;
            for (i = 0; i <= ws; i++) {
                u = (i === 0 || i === ws) ? 0 : 1;

                for (j = 0; j <= ls; j++) {

                    x = -he.x + 2.0 * he.x * (i <= 1 ? 0 : 3) / ws;
                    y = 0.0;
                    z = -(-he.y + 2.0 * he.y * (j <= 1 ? 0 : 3) / ls);

                    v = (j === 0 || j === ls) ? 0 : 1;

                    positions.push(-x, y, z);
                    normals.push(0.0, 1.0, 0.0);
                    uvs.push(u, v);

                    if ((i < ws) && (j < ls)) {
                        indices.push(vcounter+ls+1, vcounter+1, vcounter);
                        indices.push(vcounter+ls+1, vcounter+ls+2, vcounter+1);
                    }

                    vcounter++;
                }
            }

            const options = {
                normals, // crashes without normals on mac?
                uvs,
                indices
            };

            return pc.createMesh(this._device, positions, options);
        }

        _onSetFrames(frames) {
            if (this._updatingProperties) {
                this._meshesDirty = true;
            } else {
                this._createMeshes();
            }
        }

        _onFrameChanged(frameKey, frame) {
            const idx = this._frameKeys.indexOf(frameKey);
            if (idx < 0) return;

            if (frame) {
                // only re-create frame for simple render mode, since
                // 9-sliced meshes don't need frame info to create their mesh
                if (this.renderMode === pc.SPRITE_RENDERMODE_SIMPLE) {
                    this._meshes[idx] = this._createSimpleMesh(frame);
                }
            } else {
                this._meshes[idx] = null;
            }

            this.fire('set:meshes');
        }

        _onFrameRemoved(frameKey) {
            const idx = this._frameKeys.indexOf(frameKey);
            if (idx < 0) return;

            this._meshes[idx] = null;
            this.fire('set:meshes');
        }

        startUpdate() {
            this._updatingProperties = true;
            this._meshesDirty = false;
        }

        endUpdate() {
            this._updatingProperties = false;
            if (this._meshesDirty && this._atlas && this._frameKeys) {
                this._createMeshes();

            }
            this._meshesDirty = false;
        }

        get atlas() {
            return this._atlas;
        }

        set atlas(value) {
            if (value === this._atlas) return;

            if (this._atlas) {
                this._atlas.off('set:frames', this._onSetFrames, this);
                this._atlas.off('set:frame', this._onFrameChanged, this);
                this._atlas.off('remove:frame', this._onFrameRemoved, this);
            }

            this._atlas = value;
            if (this._atlas && this._frameKeys) {
                this._atlas.on('set:frames', this._onSetFrames, this);
                this._atlas.on('set:frame', this._onFrameChanged, this);
                this._atlas.on('remove:frame', this._onFrameRemoved, this);

                if (this._updatingProperties) {
                    this._meshesDirty = true;
                } else {
                    this._createMeshes();
                }
            }

            this.fire('set:atlas', value);
        }

        get pixelsPerUnit() {
            return this._pixelsPerUnit;
        }

        set pixelsPerUnit(value) {
            if (this._pixelsPerUnit === value) return;

            this._pixelsPerUnit = value;
            this.fire('set:pixelsPerUnit', value);

            // simple mode uses pixelsPerUnit to create the mesh so re-create those meshes
            if (this._atlas && this._frameKeys && this.renderMode === pc.SPRITE_RENDERMODE_SIMPLE) {
                if (this._updatingProperties) {
                    this._meshesDirty = true;
                } else {
                    this._createMeshes();
                }
            }

        }

        get renderMode() {
            return this._renderMode;
        }

        set renderMode(value) {
            if (this._renderMode === value)
                return;

            const prev = this._renderMode;
            this._renderMode = value;
            this.fire('set:renderMode', value);

            // re-create the meshes if we're going from simple to 9-sliced or vice versa
            if (prev === pc.SPRITE_RENDERMODE_SIMPLE || value === pc.SPRITE_RENDERMODE_SIMPLE) {
                if (this._atlas && this._frameKeys) {
                    if (this._updatingProperties) {
                        this._meshesDirty = true;
                    } else {
                        this._createMeshes();
                    }
                }
            }
        }

        get meshes() {
            return this._meshes;
        }
    }

    /**
    * @private
    * @function
    * @name pc.Sprite#destroy
    * @description Free up the meshes created by the sprite.
    */
    Sprite.prototype.destroy = function () {
        let i;
        let len;

        // destroy old meshes
        for (i = 0, len = this._meshes.length; i < len; i++) {
            const mesh = this._meshes[i];
            if (! mesh) continue;

            mesh.vertexBuffer.destroy();
            for (let j = 0, len2 = mesh.indexBuffer.length; j<len2; j++) {
                mesh.indexBuffer[j].destroy();
            }
        }
        this._meshes.length = 0;
    },

    Object.defineProperty(Sprite.prototype, 'frameKeys', {
        get() {
            return this._frameKeys;
        },
        set(value) {
            this._frameKeys = value;

            if (this._atlas && this._frameKeys) {
                if (this._updatingProperties) {
                    this._meshesDirty = true;
                } else {
                    this._createMeshes();
                }
            }

            this.fire('set:frameKeys', value);
        }
    });

    return {
        Sprite
    };
})());
