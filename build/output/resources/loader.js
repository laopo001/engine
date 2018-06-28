pc.extend(pc, (function () {
    /**
     * @constructor
     * @name pc.ResourceLoader
     * @classdesc Load resource data, potentially from remote sources. Caches resource on load to prevent
     * multiple requests. Add ResourceHandlers to handle different types of resources.
     */
    var ResourceLoader = /** @class */ (function () {
        function ResourceLoader() {
            this._handlers = {};
            this._requests = {};
            this._cache = {};
        }
        /**
         * @function
         * @name pc.ResourceLoader#addHandler
         * @description Add a handler for a resource type. Handler should support: load(url, callback) and open(url, data).
         * Handlers can optionally support patch(asset, assets) to handle dependencies on other assets
         * @param {String} type The name of the type that the handler will load
         * @param {pc.ResourceHandler} handler An instance of a resource handler supporting load() and open().
         * @example
         * var loader = new ResourceLoader();
         * loader.addHandler("json", new pc.JsonHandler());
         */
        ResourceLoader.prototype.addHandler = function (type, handler) {
            this._handlers[type] = handler;
            handler._loader = this;
        };
        ResourceLoader.prototype.removeHandler = function (type) {
            delete this._handlers[type];
        };
        ResourceLoader.prototype.getHandler = function (type) {
            return this._handlers[type];
        };
        /**
         * @function
         * @name pc.ResourceLoader#load
         * @description Make a request for a resource from a remote URL. Parse the returned data using the
         * handler for the specified type. When loaded and parsed, use the callback to return an instance of
         * the resource.
         * @param {String} url The URL of the resource to load.
         * @param {String} type The type of resource expected.
         * @param {Function} callback The callback used when the resource is loaded or an error occurs.
         * Passed (err, resource) where err is null if there are no errors.
         * @example
         * app.loader.load("../path/to/texture.png", "texture", function (err, texture) {
         *     // use texture here
         * });
         */
        ResourceLoader.prototype.load = function (url, type, callback, asset) {
            var _this = this;
            var handler = this._handlers[type];
            if (!handler) {
                var err = "No handler for asset type: " + type;
                callback(err);
                return;
            }
            var key = url + type;
            if (this._cache[key] !== undefined) {
                // in cache
                callback(null, this._cache[key]);
            }
            else if (this._requests[key]) {
                // existing request
                this._requests[key].push(callback);
            }
            else {
                // new request
                this._requests[key] = [callback];
                handler.load(url, function (err, data, extra) {
                    // make sure key exists because loader
                    // might have been destroyed by now
                    if (!_this._requests[key])
                        return;
                    var i;
                    var len = _this._requests[key].length;
                    if (!err) {
                        var resource = handler.open(url, data, asset);
                        _this._cache[key] = resource;
                        for (i = 0; i < len; i++)
                            _this._requests[key][i](null, resource, extra);
                    }
                    else {
                        for (i = 0; i < len; i++)
                            _this._requests[key][i](err);
                    }
                    delete _this._requests[key];
                }, asset);
            }
        };
        /**
         * @function
         * @name pc.ResourceLoader#open
         * @description Convert raw resource data into a resource instance. e.g. take 3D model format JSON and return a pc.Model.
         * @param {String} type The type of resource.
         * @param {*} data The raw resource data.
         * @returns {*} The parsed resource data.
         */
        ResourceLoader.prototype.open = function (type, data) {
            var handler = this._handlers[type];
            if (!handler) {
                console.warn("No resource handler found for: " + type);
                return data;
            }
            return handler.open(null, data);
        };
        /**
         * @function
         * @name pc.ResourceLoader#patch
         * @description Perform any operations on a resource, that requires a dependency on its asset data
         * or any other asset data.
         * @param {pc.Asset} asset The asset to patch.
         * @param {pc.AssetRegistry} assets The asset registry.
         */
        ResourceLoader.prototype.patch = function (asset, assets) {
            var handler = this._handlers[asset.type];
            if (!handler) {
                console.warn("No resource handler found for: " + asset.type);
                return;
            }
            if (handler.patch) {
                handler.patch(asset, assets);
            }
        };
        ResourceLoader.prototype.clearCache = function (url, type) {
            delete this._cache[url + type];
        };
        /**
         * @function
         * @name pc.ResourceLoader#getFromCache
         * @description Check cache for resource from a URL. If present, return the cached value.
         * @param {String} url The URL of the resource to get from the cache.
         * @param {String} type The type of the resource.
         * @returns {*} The resource loaded from the cache.
         */
        ResourceLoader.prototype.getFromCache = function (url, type) {
            if (this._cache[url + type]) {
                return this._cache[url + type];
            }
        };
        /**
         * @function
         * @name pc.ResourceLoader#destroy
         * @description Destroys the resource loader.
         */
        ResourceLoader.prototype.destroy = function () {
            this._handlers = {};
            this._requests = {};
            this._cache = {};
        };
        return ResourceLoader;
    }());
    return {
        ResourceLoader: ResourceLoader
    };
})());
//# sourceMappingURL=loader.js.map