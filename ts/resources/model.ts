pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.ModelHandler
     * @classdesc Resource Handler for creating pc.Model resources
     * @description {@link pc.ResourceHandler} use to load 3D model resources
     * @param {pc.GraphicsDevice} device The graphics device that will be rendering
     */
    class ModelHandler {
        constructor(device) {
            this._device = device;
            this._parsers = [];

            this.addParser(new pc.JsonModelParser(this._device), (url, data) => pc.path.getExtension(url) === '.json');
        }

        /**
         * @function
         * @name pc.ModelHandler#load
         * @description Fetch model data from a remote url
         * @param {String} url The URL of the model data.
         * @param {Function} callback Callback function called when the load completes. The
         * callback is of the form fn(err, response), where err is a String error message in
         * the case where the load fails, and repsponse is the model data that has been
         * successfully loaded.
         */
        load(url, callback) {
            pc.http.get(url, (err, response) => {
                if (! callback)
                    return;

                if (! err) {
                    callback(null, response);
                } else {
                    callback(pc.string.format("Error loading model: {0} [{1}]", url, err));
                }
            });
        }

        /**
         * @function
         * @name pc.ModelHandler#open
         * @description Process data in deserialized format into a pc.Model object.
         * @param {String} url The URL of the model data.
         * @param {Object} data The data from model file deserialized into a JavaScript Object.
         * @returns {pc.Model} The loaded model.
         */
        open(url, data) {
            for (let i = 0; i < this._parsers.length; i++) {
                const p = this._parsers[i];

                if (p.decider(url, data)) {
                    return p.parser.parse(data);
                }
            }
            logWARNING(pc.string.format("No model parser found for: {0}", url));
            return null;
        }

        patch(asset, assets) {
            if (! asset.resource)
                return;

            const data = asset.data;

            asset.resource.meshInstances.forEach((meshInstance, i) => {
                if (data.mapping) {
                    const handleMaterial = asset => {
                        if (asset.resource) {
                            meshInstance.material = asset.resource;
                        } else {
                            asset.once('load', handleMaterial);
                            assets.load(asset);
                        }

                        asset.once('remove', ({resource}) => {
                            if (meshInstance.material === resource)
                                meshInstance.material = pc.ModelHandler.DEFAULT_MATERIAL;
                        });
                    };

                    if (! data.mapping[i]) {
                        meshInstance.material = pc.ModelHandler.DEFAULT_MATERIAL;
                        return;
                    }

                    const id = data.mapping[i].material;
                    const url = data.mapping[i].path;
                    let material;

                    if (id !== undefined) { // id mapping
                        if (! id) {
                            meshInstance.material = pc.ModelHandler.DEFAULT_MATERIAL;
                        } else {
                            material = assets.get(id);
                            if (material) {
                                handleMaterial(material);
                            } else {
                                assets.once(`add:${id}`, handleMaterial);
                            }
                        }
                    } else if (url) {
                        // url mapping
                        const fileUrl = asset.getFileUrl();
                        const dirUrl = pc.path.getDirectory(fileUrl);
                        const path = pc.path.join(dirUrl, data.mapping[i].path);
                        material = assets.getByUrl(path);

                        if (material) {
                            handleMaterial(material);
                        } else {
                            assets.once(`add:url:${path}`, handleMaterial);
                        }
                    }
                }
            });
        }

        /**
         * @function
         * @name pc.ModelHandler#addParser
         * @description Add a parser that converts raw data into a {@link pc.Model}
         * Default parser is for JSON models
         * @param {Object} parser See JsonModelParser for example
         * @param {Function} decider Function that decides on which parser to use.
         * Function should take (url, data) arguments and return true if this parser should be used to parse the data into a {@link pc.Model}.
         * The first parser to return true is used.
         */
        addParser(parser, decider) {
            this._parsers.push({
                parser,
                decider
            });
        }
    }

    ModelHandler.DEFAULT_MATERIAL = pc.Scene.defaultMaterial;

    return {
        ModelHandler
    };
})());
