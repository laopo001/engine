pc.extend(pc, (function () {
    /**
     * @constructor
     * @name pc.ScriptHandler
     * @classdesc ResourceHandler for loading JavaScript files dynamically
     * Two types of JavaScript files can be loaded, PlayCanvas scripts which contain calls to {@link pc.createScript},
     * or regular JavaScript files, such as third-party libraries.
     * @param {pc.Application} app The running {pc.Application}
     */
    var ScriptHandler = /** @class */ (function () {
        function ScriptHandler(app) {
            this._app = app;
            this._scripts = {};
            this._cache = {};
        }
        ScriptHandler.prototype.load = function (url, callback) {
            var _this = this;
            var self = this;
            pc.script.app = this._app;
            this._loadScript(url, function (err, url, extra) {
                if (!err) {
                    if (pc.script.legacy) {
                        var Type = null;
                        // pop the type from the loading stack
                        if (ScriptHandler._types.length) {
                            Type = ScriptHandler._types.pop();
                        }
                        if (Type) {
                            // store indexed by URL
                            _this._scripts[url] = Type;
                        }
                        else {
                            Type = null;
                        }
                        // return the resource
                        callback(null, Type, extra);
                    }
                    else {
                        var obj = {};
                        for (var i = 0; i < ScriptHandler._types.length; i++)
                            obj[ScriptHandler._types[i].name] = ScriptHandler._types[i];
                        ScriptHandler._types.length = 0;
                        callback(null, obj, extra);
                        // no cache for scripts
                        delete self._loader._cache[url + "script"];
                    }
                }
                else {
                    callback(err);
                }
            });
        };
        ScriptHandler.prototype.open = function (url, data) {
            return data;
        };
        ScriptHandler.prototype.patch = function (asset, assets) { };
        ScriptHandler.prototype._loadScript = function (url, callback) {
            var head = document.head;
            var element = document.createElement('script');
            this._cache[url] = element;
            // use async=false to force scripts to execute in order
            element.async = false;
            element.addEventListener('error', function (_a) {
                var target = _a.target;
                callback(pc.string.format("Script: {0} failed to load", target.src));
            }, false);
            var done = false;
            element.onload = element.onreadystatechange = function () {
                if (!done && (!this.readyState || (this.readyState == "loaded" || this.readyState == "complete"))) {
                    done = true; // prevent double event firing
                    callback(null, url, element);
                }
            };
            // set the src attribute after the onload callback is set, to avoid an instant loading failing to fire the callback
            element.src = url;
            head.appendChild(element);
        };
        return ScriptHandler;
    }());
    ScriptHandler._types = [];
    ScriptHandler._push = function (Type) {
        if (pc.script.legacy && ScriptHandler._types.length > 0) {
            console.assert("Script Ordering Error. Contact support@playcanvas.com");
        }
        else {
            ScriptHandler._types.push(Type);
        }
    };
    return {
        ScriptHandler: ScriptHandler
    };
})());
//# sourceMappingURL=script.js.map