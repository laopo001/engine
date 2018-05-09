pc.extend(pc, (() => {
    /**
    * Sample Obj model parser. This is not added to applications by default.
    *
    * To use:
    * @example
    * // add parser to model resource handler
    * this.app.loader.getHandler("model").addParser(new pc.ObjModelParser(this.app.graphicsDevice), function (url) {
    *     return (pc.path.getExtension(url) === '.obj');
    * });
    * Then load obj as a model asset
    * e.g.
    * var asset = new pc.Asset("MyObj", "model", {
    *    url: "model.obj"
    * });
    * this.app.assets.add(asset);
    * this.app.assets.load(asset);
    */
    class ObjModelParser {
        constructor(device) {
            this._device = device;
        }

        /**
        * First draft obj parser
        * probably doesn't handle a lot of the obj spec
        * Known issues:
        * - can't handle meshes larger than 65535 verts
        * - assigns default material to all meshes
        * - doesn't created indexed geometry
        */
        parse(input) {
            // expanded vert, uv and normal values from face indices
            const parsed = {
                default: {
                    verts: [],
                    normals: [],
                    uvs: [],
                    indices: []
                }
            };
            let group = "default"; // current group
            const lines = input.split("\n");
            const verts = [], normals = [], uvs = [];
            let i;

            for (i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                const parts = line.split( /\s+/ );

                if (line[0] === 'v') {
                    if (parts[0] === 'v') {
                        verts.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                    } else if (parts[0] === 'vn') {
                        normals.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                    } else if (parts[0] === 'vt') {
                        uvs.push(parseFloat(parts[1]), parseFloat(parts[2]));
                    }
                } else if (line[0] === 'g' || line[0] === 'o' || line[0] === 'u') {
                    // split into groups for 'g' 'o' and 'usemtl' elements
                    group = parts[1]; // only first value for name for now
                    if (!parsed[group]) {
                        parsed[group] = {
                            verts: [],
                            normals: [],
                            uvs: []
                        };
                    }
                } else if (line[0] === 'f') {
                    let p, r;
                    if (parts.length === 4) {
                        //triangles
                        for (p = 1; p < parts.length; p++) {
                            r = this._parseIndices(parts[p]);
                            parsed[group].verts.push(verts[r[0]*3], verts[r[0]*3+1], verts[r[0]*3+2]); // expand uvs from indices
                            parsed[group].uvs.push(uvs[r[1]*2], uvs[r[1]*2+1]); // expand uvs from indices
                            parsed[group].normals.push(normals[r[2]*3], normals[r[2]*3+1], normals[r[2]*3+2]); // expand normals from indices
                        }

                    } else if (parts.length === 5) {
                        //quads
                        const order = [1,2,3,3,4,1]; // split quad into to triangles;
                        p = 1;
                        for (let o = 0; o < order.length; o++) {
                            p = order[o];
                            r = this._parseIndices(parts[p]);
                            parsed[group].verts.push(verts[r[0]*3], verts[r[0]*3+1], verts[r[0]*3+2]); // expand uvs from indices
                            if (r[1]*2 < uvs.length)
                                parsed[group].uvs.push(uvs[r[1]*2], uvs[r[1]*2+1]); // expand uvs from indices
                            if (r[2]*3 < normals.length)
                                parsed[group].normals.push(normals[r[2]*3], normals[r[2]*3+1], normals[r[2]*3+2]); // expand normals from indices
                        }
                    } else {
                        console.error(pc.string.format("OBJ uses unsupported {0}-gons", parts.length-1));
                    }
                }
            }

            const model = new pc.Model();
            const groupNames = Object.keys(parsed);
            const root = new pc.GraphNode();
            // create a new mesh instance for each "group"
            for (i = 0; i < groupNames.length; i++) {
                const currentGroup = parsed[groupNames[i]];
                if (!currentGroup.verts.length) continue;
                if (currentGroup.verts.length > 65535) {
                    console.warn("Warning: mesh with more than 65535 vertices");
                }
                const mesh = pc.createMesh(this._device, currentGroup.verts, {
                    normals: currentGroup.normals,
                    uvs: currentGroup.uvs
                });
                const mi = new pc.MeshInstance(new pc.GraphNode(), mesh, pc.ModelHandler.DEFAULT_MATERIAL);
                model.meshInstances.push(mi);
                root.addChild(mi.node);
            }
            model.graph = root;
            model.getGraph().syncHierarchy();
            return model;
        }

        _parseIndices(str) {
            const result = [];
            const indices = str.split("/");
            for (let i = 0; i < 3; i++) {
                if (indices[i]) {
                    result[i] = parseInt(indices[i],10)-1; // convert to 0-indexed
                }
            }
            return result;
        }
    }


    return {
        ObjModelParser
    };
})());
