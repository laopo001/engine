pc.extend(pc, (() => {
    class TextElement {
        constructor(element) {
            this._element = element;
            this._system = element.system;
            this._entity = element.entity;

            // public
            this._text = "";

            this._fontAsset = null;
            this._font = null;

            this._color = new pc.Color(1,1,1,1);

            this._spacing = 1;
            this._fontSize = 32;
            this._lineHeight = 32;
            this._wrapLines = false;

            this._drawOrder = 0;

            this._alignment = new pc.Vec2(0.5, 0.5);

            this._autoWidth = true;
            this._autoHeight = true;

            this.width = 0;
            this.height = 0;

            // private
            this._node = new pc.GraphNode();
            this._model = new pc.Model();
            this._model.graph = this._node;
            this._entity.addChild(this._node);

            this._meshInfo = [];
            this._material = null;

            this._noResize = false; // flag used to disable resizing events

            this._currentMaterialType = null; // save the material type (screenspace or not) to prevent overwriting
            this._maskedMaterialSrc = null; // saved material that was assigned before element was masked

            // initialize based on screen
            this._onScreenChange(this._element.screen);

            // start listening for element events
            element.on('resize', this._onParentResize, this);
            this._element.on('set:screen', this._onScreenChange, this);
            element.on('screen:set:screenspace', this._onScreenSpaceChange, this);
            element.on('set:draworder', this._onDrawOrderChange, this);
            element.on('set:pivot', this._onPivotChange, this);
        }

        get text() {
            return this._text;
        }

        set text(value) {
            const str = value.toString();
            if (this._text !== str) {
                if (this._font) {
                    this._updateText(str);
                }
                this._text = str;
            }
        }

        get color() {
            return this._color;
        }

        set color({data}) {
            this._color.data[0] = data[0];
            this._color.data[1] = data[1];
            this._color.data[2] = data[2];

            if (this._model) {
                for (let i = 0, len = this._model.meshInstances.length; i<len; i++) {
                    const mi = this._model.meshInstances[i];
                    mi.setParameter('material_emissive', this._color.data3);
                }
            }
        }

        get opacity() {
            return this._color.data[3];
        }

        set opacity(value) {
            this._color.data[3] = value;

            if (this._model) {
                for (let i = 0, len = this._model.meshInstances.length; i<len; i++) {
                    const mi = this._model.meshInstances[i];
                    mi.setParameter('material_opacity', value);
                }
            }
        }

        get lineHeight() {
            return this._lineHeight;
        }

        set lineHeight(value) {
            const _prev = this._lineHeight;
            this._lineHeight = value;
            if (_prev !== value && this._font) {
                this._updateText();
            }
        }

        get wrapLines() {
            return this._wrapLines;
        }

        set wrapLines(value) {
            const _prev = this._wrapLines;
            this._wrapLines = value;
            if (_prev !== value && this._font) {
                this._updateText();
            }
        }

        get lines() {
            return this._lineContents;
        }

        get spacing() {
            return this._spacing;
        }

        set spacing(value) {
            const _prev = this._spacing;
            this._spacing = value;
            if (_prev !== value && this._font) {
                this._updateText();
            }
        }

        get fontSize() {
            return this._fontSize;
        }

        set fontSize(value) {
            const _prev = this._fontSize;
            this._fontSize = value;
            if (_prev !== value && this._font) {
                this._updateText();
            }
        }

        set fontAsset(value) {
            const assets = this._system.app.assets;
            let _id = value;

            if (value instanceof pc.Asset) {
                _id = value.id;
            }

            if (this._fontAsset !== _id) {
                if (this._fontAsset) {
                    const _prev = assets.get(this._fontAsset);

                    if (_prev) {
                        _prev.off("load", this._onFontLoad, this);
                        _prev.off("change", this._onFontChange, this);
                        _prev.off("remove", this._onFontRemove, this);
                    }
                }

                this._fontAsset = _id;
                if (this._fontAsset) {
                    const asset = assets.get(this._fontAsset);
                    if (! asset) {
                        assets.on(`add:${this._fontAsset}`, this._onFontAdded, this);
                    } else {
                        this._bindFont(asset);
                    }
                }
            }
        }

        get font() {
            return this._font;
        }

        set font(value) {
            let i;
            let len;

            this._font = value;
            if (! value) return;

            // make sure we have as many meshInfo entries
            // as the number of font textures
            for (i = 0, len = this._font.textures.length; i<len; i++) {
                if (! this._meshInfo[i]) {
                    this._meshInfo[i] = {
                        count: 0,
                        quad: 0,
                        lines: {},
                        positions: [],
                        normals: [],
                        uvs: [],
                        indices: [],
                        meshInstance: null
                    };
                } else {
                    // keep existing entry but set correct parameters to mesh instance
                    const mi = this._meshInfo[i].meshInstance;
                    if (mi) {
                        mi.setParameter("font_sdfIntensity", this._font.intensity);
                        mi.setParameter("font_pxrange", this._getPxRange(this._font));
                        mi.setParameter("font_textureWidth", this._font.data.info.maps[i].width);
                        mi.setParameter("texture_msdfMap", this._font.textures[i]);
                    }
                }
            }

            // destroy any excess mesh instances
            let removedModel = false;
            for (i = this._font.textures.length; i < this._meshInfo.length; i++) {
                if (this._meshInfo[i].meshInstance) {
                    if (! removedModel) {
                        // remove model from scene so that excess mesh instances are removed
                        // from the scene as well
                        this._element.removeModelFromLayers(this._model);
                        removedModel = true;
                    }
                    this._removeMeshInstance(this._meshInfo[i].meshInstance);
                }
            }

            if (this._meshInfo.length > this._font.textures.length)
                this._meshInfo.length = this._font.textures.length;

            this._updateText();
        }

        get alignment() {
            return this._alignment;
        }

        set alignment(value) {
            if (value instanceof pc.Vec2) {
                this._alignment.set(value.x, value.y);
            } else {
                this._alignment.set(value[0], value[1]);
            }

            if (this._font)
                this._updateText();
        }

        get autoWidth() {
            return this._autoWidth;
        }

        set autoWidth(value) {
            this._autoWidth = value;

            // change width of element to match text width but only if the element
            // does not have split horizontal anchors
            if (value && Math.abs(this._element.anchor.x - this._element.anchor.z) < 0.0001) {
                this._element.width = this.width;
            }
        }

        get autoHeight() {
            return this._autoHeight;
        }

        set autoHeight(value) {
            this._autoHeight = value;

            // change height of element to match text height but only if the element
            // does not have split vertical anchors
            if (value && Math.abs(this._element.anchor.y - this._element.anchor.w) < 0.0001) {
                this._element.height = this.height;
            }
        }
    }

    const LINE_BREAK_CHAR = /^[\r\n]$/;
    const WHITESPACE_CHAR = /^[ \t]$/;
    const WORD_BOUNDARY_CHAR = /^[ \t\-]$/;

    pc.extend(TextElement.prototype, {
        destroy() {
            if (this._model) {
                this._element.removeModelFromLayers(this._model);
                this._model.destroy();
                this._model = null;
            }

            this._element.off('resize', this._onParentResize, this);
            this._element.off('set:screen', this._onScreenChange, this);
            this._element.off('screen:set:screenspace', this._onScreenSpaceChange, this);
            this._element.off('set:draworder', this._onDrawOrderChange, this);
            this._element.off('set:pivot', this._onPivotChange, this);
        },

        _onParentResize(width, height) {
            if (this._noResize) return;
            if (this._font) this._updateText(this._text);
        },

        _onScreenChange(screen) {
            if (screen) {
                this._updateMaterial(screen.screen.screenSpace);
            } else {
                this._updateMaterial(false);
            }
        },

        _onScreenSpaceChange(value) {
            this._updateMaterial(value);
        },

        _onDrawOrderChange(order) {
            this._drawOrder = order;

            if (this._model) {
                let i;
                let len;

                for (i = 0, len = this._model.meshInstances.length; i<len; i++) {
                    this._model.meshInstances[i].drawOrder = order;
                }
            }
        },

        _onPivotChange(pivot) {
            if (this._font)
                this._updateText();
        },

        _updateText(text) {
            let i;
            let len;

            if (text === undefined) text = this._text;

            let textLength = text.length;
            // handle null string
            if (textLength === 0) {
                textLength = 1;
                text = " ";
            }

            const charactersPerTexture = {};

            for (i = 0; i<textLength; i++) {
                const code = text.charCodeAt(i);
                const info = this._font.data.chars[code];
                if (! info) continue;

                const map = info.map;

                if (! charactersPerTexture[map])
                    charactersPerTexture[map] = 0;

                charactersPerTexture[map]++;
            }

            let removedModel = false;

            const screenSpace = (this._element.screen && this._element.screen.screen.screenSpace);

            for (i = 0, len = this._meshInfo.length; i<len; i++) {
                const l = charactersPerTexture[i] || 0;
                const meshInfo = this._meshInfo[i];

                if (meshInfo.count !== l) {
                    if (! removedModel) {
                        this._element.removeModelFromLayers(this._model);
                        removedModel = true;
                    }

                    meshInfo.count = l;
                    meshInfo.positions.length = meshInfo.normals.length = l*3*4;
                    meshInfo.indices.length = l*3*2;
                    meshInfo.uvs.length = l*2*4;

                    // destroy old mesh
                    if (meshInfo.meshInstance) {
                        this._removeMeshInstance(meshInfo.meshInstance);
                    }

                    // if there are no letters for this mesh continue
                    if (l === 0) {
                        meshInfo.meshInstance = null;
                        continue;
                    }

                    // set up indices and normals whose values don't change when we call _updateMeshes
                    for (let v = 0; v < l; v++) {
                        // create index and normal arrays since they don't change
                        // if the length doesn't change
                        meshInfo.indices[v*3*2+0] = v*4;
                        meshInfo.indices[v*3*2+1] = v*4 + 1;
                        meshInfo.indices[v*3*2+2] = v*4 + 3;
                        meshInfo.indices[v*3*2+3] = v*4 + 2;
                        meshInfo.indices[v*3*2+4] = v*4 + 3;
                        meshInfo.indices[v*3*2+5] = v*4 + 1;

                        meshInfo.normals[v*4*3+0] = 0;
                        meshInfo.normals[v*4*3+1] = 0;
                        meshInfo.normals[v*4*3+2] = -1;

                        meshInfo.normals[v*4*3+3] = 0;
                        meshInfo.normals[v*4*3+4] = 0;
                        meshInfo.normals[v*4*3+5] = -1;

                        meshInfo.normals[v*4*3+6] = 0;
                        meshInfo.normals[v*4*3+7] = 0;
                        meshInfo.normals[v*4*3+8] = -1;

                        meshInfo.normals[v*4*3+9] = 0;
                        meshInfo.normals[v*4*3+10] = 0;
                        meshInfo.normals[v*4*3+11] = -1;
                    }

                    const mesh = pc.createMesh(this._system.app.graphicsDevice, meshInfo.positions, {uvs: meshInfo.uvs, normals: meshInfo.normals, indices: meshInfo.indices});

                    const mi = new pc.MeshInstance(this._node, mesh, this._material);
                    mi.castShadow = false;
                    mi.receiveShadow = false;

                    mi.drawOrder = this._drawOrder;
                    if (screenSpace) {
                        mi.cull = false;
                    }
                    mi.screenSpace = screenSpace;
                    mi.setParameter("texture_msdfMap", this._font.textures[i]);
                    mi.setParameter("material_emissive", this._color.data3);
                    mi.setParameter("material_opacity", this._color.data[3]);
                    mi.setParameter("font_sdfIntensity", this._font.intensity);
                    mi.setParameter("font_pxrange", this._getPxRange(this._font));
                    mi.setParameter("font_textureWidth", this._font.data.info.maps[i].width);

                    meshInfo.meshInstance = mi;

                    this._model.meshInstances.push(mi);

                }
            }

            // after creating new meshes
            // re-apply masking stencil params
            if (this._maskedBy) {
                this._element._setMaskedBy(this._maskedBy);
            }

            if (removedModel && this._element.enabled && this._entity.enabled) {
                this._element.addModelToLayers(this._model);
            }

            this._updateMeshes(text);
        },

        _removeMeshInstance(meshInstance) {
            let ib;
            let iblen;

            const oldMesh = meshInstance.mesh;
            if (oldMesh) {
                if (oldMesh.vertexBuffer) {
                    oldMesh.vertexBuffer.destroy();
                }

                if (oldMesh.indexBuffer) {
                    for (ib = 0, iblen = oldMesh.indexBuffer.length; ib<iblen; ib++)
                        oldMesh.indexBuffer[ib].destroy();
                }
            }

            const idx = this._model.meshInstances.indexOf(meshInstance);
            if (idx !== -1)
                this._model.meshInstances.splice(idx, 1);
        },

        _setMaterial(material) {
            let i;
            let len;

            this._material = material;
            if (this._model) {
                for (i = 0, len = this._model.meshInstances.length; i<len; i++) {
                    const mi = this._model.meshInstances[i];
                    mi.material = material;
                }
            }
        },

        _updateMaterial(screenSpace) {
            let cull;

            if (screenSpace) {
                this._material = this._system.defaultScreenSpaceTextMaterial;
                cull = false;
            } else {
                this._material = this._system.defaultTextMaterial;
                cull = true;
            }

            if (this._model) {
                for (let i = 0, len = this._model.meshInstances.length; i<len; i++) {
                    const mi = this._model.meshInstances[i];
                    mi.cull = cull;
                    mi.material = this._material;
                    mi.screenSpace = screenSpace;
                }
            }
        },

        _updateMeshes(text) {
            const json = this._font.data;
            const self = this;

            this.width = 0;
            this.height = 0;
            this._lineWidths = [];
            this._lineContents = [];

            const l = text.length;
            let _x = 0; // cursors
            let _xMinusTrailingWhitespace = 0;
            let _y = 0;
            const _z = 0;

            let lines = 1;
            let wordStartX = 0;
            let wordStartIndex = 0;
            let lineStartIndex = 0;
            let numWordsThisLine = 0;
            let numCharsThisLine = 0;
            const splitHorizontalAnchors = Math.abs(this._element.anchor.x - this._element.anchor.z) >= 0.0001;

            let maxLineWidth = this._element.width;
            if ((this.autoWidth && !splitHorizontalAnchors) || !this._wrapLines) {
                maxLineWidth = Number.POSITIVE_INFINITY;
            }

            // todo: move this into font asset?
            // calculate max font extents from all available chars
            let fontMinY = 0;
            let fontMaxY = 0;
            let scale = 1;
            const MAGIC = 32;

            let char, charCode, data, i, quad;

            // TODO: Optimize this as it loops through all the chars in the asset
            // every time the text changes...
            for (charCode in json.chars) {
                data = json.chars[charCode];
                scale = (data.height / MAGIC) * this._fontSize / data.height;
                if (data.bounds) {
                    fontMinY = Math.min(fontMinY, data.bounds[1] * scale);
                    fontMaxY = Math.max(fontMaxY, data.bounds[3] * scale);
                }
            }

            for (i = 0; i < this._meshInfo.length; i++) {
                this._meshInfo[i].quad = 0;
                this._meshInfo[i].lines = {};
            }

            function breakLine(lineBreakIndex, lineBreakX) {
                self._lineWidths.push(lineBreakX);
                self._lineContents.push(text.substring(lineStartIndex, lineBreakIndex));

                _x = 0;
                _y -= self._lineHeight;
                lines++;
                numWordsThisLine = 0;
                numCharsThisLine = 0;
                wordStartX = 0;
                lineStartIndex = lineBreakIndex;
            }

            for (i = 0; i < l; i++) {
                char = text.charAt(i);
                charCode = text.charCodeAt(i);

                let x = 0;
                let y = 0;
                let advance = 0;
                let quadsize = 1;
                let glyphMinX = 0;
                let glyphWidth = 0;

                data = json.chars[charCode];
                if (data && data.scale) {
                    const size = (data.width + data.height) / 2;
                    scale = (size/MAGIC) * this._fontSize / size;
                    quadsize = (size/MAGIC) * this._fontSize / data.scale;
                    advance = data.xadvance * scale;
                    x = data.xoffset * scale;
                    y = data.yoffset * scale;

                    if (data.bounds) {
                        glyphWidth = (data.bounds[2] - data.bounds[0]) * scale;
                        glyphMinX = data.bounds[0] * scale;
                    } else {
                        glyphWidth = x;
                        glyphMinX = 0;
                    }
                } else {
                    // missing character
                    advance = 1;
                    x = 0;
                    y = 0;
                    quadsize = this._fontSize;
                }

                const isLineBreak = LINE_BREAK_CHAR.test(char);
                const isWordBoundary = WORD_BOUNDARY_CHAR.test(char);
                const isWhitespace = WHITESPACE_CHAR.test(char);

                if (isLineBreak) {
                    breakLine(i, _xMinusTrailingWhitespace);
                    wordStartIndex = i + 1;
                    lineStartIndex = i + 1;
                    continue;
                }

                const meshInfo = this._meshInfo[(data && data.map) || 0];
                const candidateLineWidth = _x + glyphWidth + glyphMinX;

                // If we've exceeded the maximum line width, move everything from the beginning of
                // the current word onwards down onto a new line.
                if (candidateLineWidth >= maxLineWidth && numCharsThisLine > 0 && !isWhitespace) {
                    // Handle the case where a line containing only a single long word needs to be
                    // broken onto multiple lines.
                    if (numWordsThisLine === 0) {
                        wordStartIndex = i;
                        breakLine(i, _xMinusTrailingWhitespace);
                    } else {
                        // Move back to the beginning of the current word.
                        const backtrack = Math.max(i - wordStartIndex, 0);
                        i -= backtrack + 1;
                        meshInfo.lines[lines-1] -= backtrack;
                        meshInfo.quad -= backtrack;

                        breakLine(wordStartIndex, wordStartX);
                        continue;
                    }
                }

                quad = meshInfo.quad;
                meshInfo.lines[lines-1] = quad;

                meshInfo.positions[quad*4*3+0] = _x - x;
                meshInfo.positions[quad*4*3+1] = _y - y;
                meshInfo.positions[quad*4*3+2] = _z;

                meshInfo.positions[quad*4*3+3] = _x - x + quadsize;
                meshInfo.positions[quad*4*3+4] = _y - y;
                meshInfo.positions[quad*4*3+5] = _z;

                meshInfo.positions[quad*4*3+6] = _x - x + quadsize;
                meshInfo.positions[quad*4*3+7] = _y - y + quadsize;
                meshInfo.positions[quad*4*3+8] = _z;

                meshInfo.positions[quad*4*3+9]  = _x - x;
                meshInfo.positions[quad*4*3+10] = _y - y + quadsize;
                meshInfo.positions[quad*4*3+11] = _z;


                this.width = Math.max(this.width, _x + glyphWidth + glyphMinX);
                this.height = Math.max(this.height, fontMaxY - (_y+fontMinY));

                // advance cursor
                _x = _x + (this._spacing*advance);

                // For proper alignment handling when a line wraps _on_ a whitespace character,
                // we need to keep track of the width of the line without any trailing whitespace
                // characters. This applies to both single whitespaces and also multiple sequential
                // whitespaces.
                if (!isWhitespace && !isLineBreak) {
                    _xMinusTrailingWhitespace = _x;
                }

                if (isWordBoundary) {
                    numWordsThisLine++;
                    wordStartX = _xMinusTrailingWhitespace;
                    wordStartIndex = i + 1;
                }

                numCharsThisLine++;

                const uv = this._getUv(charCode);

                meshInfo.uvs[quad*4*2+0] = uv[0];
                meshInfo.uvs[quad*4*2+1] = uv[1];

                meshInfo.uvs[quad*4*2+2] = uv[2];
                meshInfo.uvs[quad*4*2+3] = uv[1];

                meshInfo.uvs[quad*4*2+4] = uv[2];
                meshInfo.uvs[quad*4*2+5] = uv[3];

                meshInfo.uvs[quad*4*2+6] = uv[0];
                meshInfo.uvs[quad*4*2+7] = uv[3];

                meshInfo.quad++;
            }

            // As we only break lines when the text becomes too wide for the container,
            // there will almost always be some leftover text on the final line which has
            // not yet been pushed to _lineContents.
            if (lineStartIndex < l) {
                breakLine(l, _x);
            }

            // force autoWidth / autoHeight change to update width/height of element
            this._noResize = true;
            this.autoWidth = this._autoWidth;
            this.autoHeight = this._autoHeight;
            this._noResize = false;

            // offset for pivot and alignment
            const hp = this._element.pivot.data[0];
            const vp = this._element.pivot.data[1];
            const ha = this._alignment.x;
            const va = this._alignment.y;

            for (i = 0; i < this._meshInfo.length; i++) {
                if (this._meshInfo[i].count === 0) continue;

                let prevQuad = 0;
                for (const line in this._meshInfo[i].lines) {
                    const index = this._meshInfo[i].lines[line];
                    const hoffset = - hp * this._element.width + ha * (this._element.width - this._lineWidths[parseInt(line,10)]);
                    const voffset = (1 - vp) * this._element.height - fontMaxY - (1 - va) * (this._element.height - this.height);

                    for (quad = prevQuad; quad <= index; quad++) {
                        this._meshInfo[i].positions[quad*4*3] += hoffset;
                        this._meshInfo[i].positions[quad*4*3 + 3] += hoffset;
                        this._meshInfo[i].positions[quad*4*3 + 6] += hoffset;
                        this._meshInfo[i].positions[quad*4*3 + 9] += hoffset;

                        this._meshInfo[i].positions[quad*4*3 + 1] += voffset;
                        this._meshInfo[i].positions[quad*4*3 + 4] += voffset;
                        this._meshInfo[i].positions[quad*4*3 + 7] += voffset;
                        this._meshInfo[i].positions[quad*4*3 + 10] += voffset;
                    }

                    prevQuad = index + 1;
                }

                // update vertex buffer
                const numVertices = this._meshInfo[i].quad*4;
                const it = new pc.VertexIterator(this._meshInfo[i].meshInstance.mesh.vertexBuffer);
                for (let v = 0; v < numVertices; v++) {
                    it.element[pc.SEMANTIC_POSITION].set(this._meshInfo[i].positions[v*3+0], this._meshInfo[i].positions[v*3+1], this._meshInfo[i].positions[v*3+2]);
                    it.element[pc.SEMANTIC_TEXCOORD0].set(this._meshInfo[i].uvs[v*2+0], this._meshInfo[i].uvs[v*2+1]);
                    it.next();
                }
                it.end();

                this._meshInfo[i].meshInstance.mesh.aabb.compute(this._meshInfo[i].positions);

                // force update meshInstance aabb
                this._meshInfo[i].meshInstance._aabbVer = -1;
            }
        },

        _onFontAdded(asset) {
            this._system.app.assets.off(`add:${asset.id}`, this._onFontAdded, this);

            if (asset.id === this._fontAsset) {
                this._bindFont(asset);
            }
        },

        _bindFont(asset) {
            asset.on("load", this._onFontLoad, this);
            asset.on("change", this._onFontChange, this);
            asset.on("remove", this._onFontRemove, this);

            if (asset.resource) {
                this._onFontLoad(asset);
            } else {
                this._system.app.assets.load(asset);
            }
        },

        _onFontLoad({resource}) {
            if (this.font !== resource) {
                this.font = resource;
            }
        },

        _onFontChange(asset, name, _new, _old) {
            if (name === 'data') {
                this._font.data = _new;

                const maps = this._font.data.info.maps.length;
                for (let i = 0; i<maps; i++) {
                    if (! this._meshInfo[i]) continue;

                    const mi = this._meshInfo[i].meshInstance;
                    if (mi) {
                        mi.setParameter("font_sdfIntensity", this._font.intensity);
                        mi.setParameter("font_pxrange", this._getPxRange(this._font));
                        mi.setParameter("font_textureWidth", this._font.data.info.maps[i].width);
                    }
                }
            }
        },

        _onFontRemove(asset) {

        },

        _getPxRange(font) {
            // calculate pxrange from range and scale properties on a character
            const keys = Object.keys(this._font.data.chars);
            for (let i = 0; i < keys.length; i++) {
                const char = this._font.data.chars[keys[i]];
                if (char.scale && char.range) {
                    return char.scale * char.range;
                }
            }
            return 2; // default
        },

        _getUv(char) {
            const data = this._font.data;

            if (!data.chars[char]) {
                // missing char - return "space" if we have it
                if (data.chars[32]) {
                    return this._getUv(32);
                }
                // otherwise - missing char
                return [0,0,1,1];
            }

            const map = data.chars[char].map;
            const width = data.info.maps[map].width;
            const height = data.info.maps[map].height;

            const x = data.chars[char].x;
            const y =  data.chars[char].y;

            const x1 = x;
            const y1 = y;
            const x2 = (x + data.chars[char].width);
            const y2 = (y - data.chars[char].height);
            const edge = 1 - (data.chars[char].height / height);
            return [
                x1 / width,
                edge - (y1 / height), // bottom left

                (x2 / width),
                edge - (y2 / height)  // top right
            ];
        },

        onEnable() {
            if (this._model) {
                this._element.addModelToLayers(this._model);
            }
        },

        onDisable() {
            if (this._model) {
                this._element.removeModelFromLayers(this._model);
            }
        }
    });

    return {
        TextElement
    };
})());

