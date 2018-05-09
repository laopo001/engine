pc.extend(pc, (() => {
    class SpriteHandler {
        constructor(assets, device) {
            this._assets = assets;
            this._device = device;
        }

        load(url, callback) {
            // if given a json file (probably engine-only use case)
            if (pc.path.getExtension(url) === '.json') {
                pc.http.get(url, (err, response) => {
                    if (!err) {
                        callback(null, response);
                    } else {
                        callback(err);
                    }
                });
            }
        }

        // Create sprite resource
        open(url, data) {
            const sprite = new pc.Sprite(this._device);
            // json data loaded from file
            if (data) {
                // store data on sprite object temporarily
                sprite.__data = data;
            }

            return sprite;
        }

        // Set sprite data
        patch(asset, assets) {
            const sprite = asset.resource;
            if (sprite.__data) {
                // loading from a json file we have asset data store temporarily on the sprite resource
                // copy it into asset.data and delete

                asset.data.pixelsPerUnit = sprite.__data.pixelsPerUnit;
                asset.data.renderMode = sprite.__data.renderMode;
                asset.data.frameKeys = sprite.__data.frameKeys;

                const atlas = assets.getByUrl(sprite.__data.textureAtlasAsset);
                if (atlas) {
                    asset.data.textureAtlasAsset = atlas.id;
                }

                delete sprite.__data;

            }

            sprite.startUpdate();
            sprite.renderMode = asset.data.renderMode;
            sprite.pixelsPerUnit = asset.data.pixelsPerUnit;
            sprite.frameKeys = asset.data.frameKeys;
            this._updateAtlas(asset);
            sprite.endUpdate();

            asset.off('change', this._onAssetChange, this);
            asset.on('change', this._onAssetChange, this);
        }

        // Load atlas
        _updateAtlas(asset) {
            const sprite = asset.resource;
            if (! asset.data.textureAtlasAsset) {
                sprite.atlas = null;
                return;
            }

            this._assets.off(`load:${asset.data.textureAtlasAsset}`, onTextureAtlasLoaded, asset);
            this._assets.on(`load:${asset.data.textureAtlasAsset}`, onTextureAtlasLoaded, asset);

            const atlasAsset = this._assets.get(asset.data.textureAtlasAsset);
            if (atlasAsset && atlasAsset.resource) {
                sprite.atlas = atlasAsset.resource;
            } else {
                if (!atlasAsset) {
                    this._assets.off(`add:${asset.data.textureAtlasAsset}`, onTextureAtlasAdded, asset);
                    this._assets.on(`add:${asset.data.textureAtlasAsset}`, onTextureAtlasAdded, asset);
                } else {
                    this._assets.load(atlasAsset);
                }
            }
        }

        _onAssetChange(asset, attribute, value, oldValue) {
            if (attribute === 'data') {
                // if the texture atlas changed, clear events for old atlas asset
                if (value && value.textureAtlasAsset && oldValue && value.textureAtlasAsset !== oldValue.textureAtlasAsset) {
                    this._assets.off(`load:${oldValue.textureAtlasAsset}`, onTextureAtlasLoaded, asset);
                    this._assets.off(`add:${oldValue.textureAtlasAsset}`, onTextureAtlasAdded, asset);
                }
            }
        }
    }

    // The scope of this function is the sprite asset
    const onTextureAtlasLoaded = function({resource}) {
        const spriteAsset = this;
        if (spriteAsset.resource) {
            spriteAsset.resource.atlas = resource;
        }
    };

    // The scope of this function is the sprite asset
    const onTextureAtlasAdded = function (atlasAsset) {
        const spriteAsset = this;
        spriteAsset.registry.load(atlasAsset);
    };

    return {
        SpriteHandler
    };
})());
