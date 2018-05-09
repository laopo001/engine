pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.Model
     * @classdesc A model is a graphical object that can be added to or removed from a scene.
     * It contains a hierarchy and any number of mesh instances.
     * @description Creates a new model.
     * @example
     * // Create a new model
     * var model = new pc.Model();
     * @property {pc.GraphNode} graph The root node of the model's graph node hierarchy.
     * @property {pc.MeshInstance[]} meshInstances An array of meshInstances contained in this model.
     */
    class Model {
        constructor() {
            this.graph = null;
            this.meshInstances = [];
            this.skinInstances = [];
            this.morphInstances = [];

            this.cameras = [];
            this.lights = [];

            this._shadersVersion = 0;
        }

        getGraph() {
            return this.graph;
        }

        setGraph(graph) {
            this.graph = graph;
        }

        getCameras() {
            return this.cameras;
        }

        setCameras(cameras) {
            this.cameras = cameras;
        }

        getLights() {
            return this.lights;
        }

        setLights(lights) {
            this.lights = lights;
        }

        getMaterials() {
            let i;
            const materials = [];
            for (i = 0; i < this.meshInstances.length; i++) {
                const meshInstance = this.meshInstances[i];
                if (!materials.includes(meshInstance.material)) {
                    materials.push(meshInstance.material);
                }
            }
            return materials;
        }

        /**
         * @function
         * @name pc.Model#clone
         * @description Clones a model. The returned model has a newly created hierarchy
         * and mesh instances, but meshes are shared between the clone and the specified
         * model.
         * @returns {pc.Model} A clone of the specified model.
         * @example
         * var clonedModel = model.clone();
         */
        clone() {
            let i, j;

            // Duplicate the node hierarchy
            const srcNodes = [];
            const cloneNodes = [];

            const _duplicate = node => {
                const newNode = node.clone();

                srcNodes.push(node);
                cloneNodes.push(newNode);

                for (let i = 0; i < node._children.length; i++) {
                    newNode.addChild(_duplicate(node._children[i]));
                }

                return newNode;
            };

            const cloneGraph = _duplicate(this.graph);
            const cloneMeshInstances = [];
            const cloneSkinInstances = [];
            const cloneMorphInstances = [];

            // Clone the skin instances
            for (i = 0; i < this.skinInstances.length; i++) {
                const skin = this.skinInstances[i].skin;
                const cloneSkinInstance = new pc.SkinInstance(skin);

                // Resolve bone IDs to actual graph nodes
                const bones = [];
                for (j = 0; j < skin.boneNames.length; j++) {
                    const boneName = skin.boneNames[j];
                    const bone = cloneGraph.findByName(boneName);
                    bones.push(bone);
                }
                cloneSkinInstance.bones = bones;

                cloneSkinInstances.push(cloneSkinInstance);
            }

            // Clone the morph instances
            for (i = 0; i < this.morphInstances.length; i++) {
                const morph = this.morphInstances[i].morph;
                const cloneMorphInstance = new pc.MorphInstance(morph);
                cloneMorphInstances.push(cloneMorphInstance);
            }

            // Clone the mesh instances
            for (i = 0; i < this.meshInstances.length; i++) {
                const meshInstance = this.meshInstances[i];
                const nodeIndex = srcNodes.indexOf(meshInstance.node);
                const cloneMeshInstance = new pc.MeshInstance(cloneNodes[nodeIndex], meshInstance.mesh, meshInstance.material);

                if (meshInstance.skinInstance) {
                    const skinInstanceIndex = this.skinInstances.indexOf(meshInstance.skinInstance);
                    cloneMeshInstance.skinInstance = cloneSkinInstances[skinInstanceIndex];
                }

                if (meshInstance.morphInstance) {
                    const morphInstanceIndex = this.morphInstances.indexOf(meshInstance.morphInstance);
                    cloneMeshInstance.morphInstance = cloneMorphInstances[morphInstanceIndex];
                }

                cloneMeshInstances.push(cloneMeshInstance);
            }

            const clone = new pc.Model();
            clone.graph = cloneGraph;
            clone.meshInstances = cloneMeshInstances;
            clone.skinInstances = cloneSkinInstances;
            clone.morphInstances = cloneMorphInstances;

            clone.getGraph().syncHierarchy();

            return clone;
        }

        /**
         * @function
         * @name pc.Model#destroy
         * @description destroys skinning texture and possibly deletes vertex/index buffers of a model.
         * Mesh is reference-counted, so buffers are only deleted if all models with referencing mesh instances were deleted.
         * That means all in-scene models + the "base" one (asset.resource) which is created when the model is parsed.
         * It is recommended to use asset.unload() instead, which will also remove the model from the scene.
         */
        destroy() {
            const meshInstances = this.meshInstances;
            let meshInstance, mesh, skin, morph, ib, boneTex, j;
            let device;
            for (let i = 0; i < meshInstances.length; i++) {
                meshInstance = meshInstances[i];

                mesh = meshInstance.mesh;
                if (mesh) {
                    mesh._refCount--;
                    if (mesh._refCount < 1) {
                        if (mesh.vertexBuffer) {
                            device = device || mesh.vertexBuffer.device;
                            mesh.vertexBuffer.destroy();
                            mesh.vertexBuffer = null;
                        }
                        for (j=0; j<mesh.indexBuffer.length; j++) {
                            device = device || mesh.indexBuffer.device;
                            ib = mesh.indexBuffer[j];
                            if (!ib) continue;
                            ib.destroy();
                        }
                        mesh.indexBuffer.length = 0;
                    }
                }

                skin = meshInstance.skinInstance;
                if (skin) {
                    boneTex = skin.boneTexture;
                    if (boneTex) {
                        boneTex.destroy();
                    }
                }
                meshInstance.skinInstance = null;

                morph = meshInstance.morphInstance;
                if (morph) {
                    morph.destroy();
                }
                meshInstance.morphInstance = null;

                meshInstance.material = null; // make sure instance and material clear references
            }
        }

        /**
         * @function
         * @name pc.Model#generateWireframe
         * @description Generates the necessary internal data for a model to be
         * renderable as wireframe. Once this function has been called, any mesh
         * instance in the model can have its renderStyle property set to
         * pc.RENDERSTYLE_WIREFRAME
         * @example
         * model.generateWireframe();
         * for (var i = 0; i < model.meshInstances.length; i++) {
         *     model.meshInstances[i].renderStyle = pc.RENDERSTYLE_WIREFRAME;
         * }
         */
        generateWireframe() {
            let i, j, k;
            let i1, i2;
            let mesh, base, count, indexBuffer, wireBuffer;
            let srcIndices, dstIndices;

            // Build an array of unique meshes in this model
            const meshes = [];
            for (i = 0; i < this.meshInstances.length; i++) {
                mesh = this.meshInstances[i].mesh;
                if (!meshes.includes(mesh)) {
                    meshes.push(mesh);
                }
            }

            const offsets = [[0, 1], [1, 2], [2, 0]];
            for (i = 0; i < meshes.length; i++) {
                mesh = meshes[i];
                base = mesh.primitive[pc.RENDERSTYLE_SOLID].base;
                count = mesh.primitive[pc.RENDERSTYLE_SOLID].count;
                indexBuffer = mesh.indexBuffer[pc.RENDERSTYLE_SOLID];

                srcIndices = new Uint16Array(indexBuffer.lock());

                const uniqueLineIndices = {};
                const lines = [];
                for (j = base; j < base + count; j+=3) {
                    for (k = 0; k < 3; k++) {
                        i1 = srcIndices[j + offsets[k][0]];
                        i2 = srcIndices[j + offsets[k][1]];
                        const line = (i1 > i2) ? ((i2 << 16) | i1) : ((i1 << 16) | i2);
                        if (uniqueLineIndices[line] === undefined) {
                            uniqueLineIndices[line] = 0;
                            lines.push(i1, i2);
                        }
                    }
                }

                indexBuffer.unlock();

                wireBuffer = new pc.IndexBuffer(indexBuffer.device, pc.INDEXFORMAT_UINT16, lines.length);
                dstIndices = new Uint16Array(wireBuffer.lock());
                dstIndices.set(lines);
                wireBuffer.unlock();

                mesh.primitive[pc.RENDERSTYLE_WIREFRAME] = {
                    type: pc.PRIMITIVE_LINES,
                    base: 0,
                    count: lines.length,
                    indexed: true
                };
                mesh.indexBuffer[pc.RENDERSTYLE_WIREFRAME] = wireBuffer;
            }
        }
    }

    return {
        Model
    };
})());
