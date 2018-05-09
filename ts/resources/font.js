pc.extend(pc, (() => {
    class FontHandler {
        constructor(loader) {
            this._loader = loader;
        }

        load(url, callback, asset) {
            const self = this;
            if (pc.path.getExtension(url) === '.json') {
                // load json data then load texture of same name
                pc.http.get(url, (err, response) => {
                    if (!err) {
                        self._loadTextures(url.replace('.json', '.png'), response, (err, textures) => {
                            if (err) return callback(err);

                            callback(null, {
                                data: response,
                                textures
                            });
                        });
                    } else {
                        callback(pc.string.format("Error loading font resource: {0} [{1}]", url, err));
                    }
                });

            } else {
                this._loadTextures(url, asset && asset.data, callback);
            }
        }

        _loadTextures(url, data, callback) {
            let numTextures = 1;
            let numLoaded = 0;
            let error = null;

            if (data && data.version >= 2) {
                numTextures = data.info.maps.length;
            }

            const textures = new Array(numTextures);
            const loader = this._loader;

            const loadTexture = index => {
                const onLoaded = (err, texture) => {
                    if (error) return;

                    if (err) {
                        error = err;
                        return callback(err);
                    }

                    texture.upload();
                    textures[index] = texture;
                    numLoaded++;
                    if (numLoaded === numTextures) {
                        callback(null, textures);
                    }
                };

                if (index === 0) {
                    loader.load(url, "texture", onLoaded);
                } else {
                    loader.load(url.replace('.png', `${index}.png`), "texture", onLoaded);
                }
            };

            for (let i = 0; i < numTextures; i++)
                loadTexture(i);
        }

        open(url, data, asset) {
            let font;
            if (data.textures) {
                // both data and textures exist
                font = new pc.Font(data.textures, data.data);
            } else {
                // only textures
                font = new pc.Font(data, null);
            }
            return font;
        }

        patch(asset, assets) {
            // if not already set, get font data block from asset
            // and assign to font resource
            const font = asset.resource;
            if (!font.data && asset.data) {
                // font data present in asset but not in font
                font.data = asset.data;
            } else if (!asset.data && font.data) {
                // font data present in font but not in asset
                asset.data = font.data;
            }
        }
    }

    return {
        FontHandler
    };
})());
