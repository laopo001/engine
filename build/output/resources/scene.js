pc.extend(pc, (function () {
    var SceneHandler = /** @class */ (function () {
        function SceneHandler(app) {
            this._app = app;
        }
        SceneHandler.prototype.load = function (url, callback) {
            pc.http.get(url, function (err, response) {
                if (!err) {
                    callback(null, response);
                }
                else {
                    callback("Error requesting scene: " + url);
                }
            });
        };
        SceneHandler.prototype.open = function (url, data) {
            // prevent script initialization until entire scene is open
            this._app.systems.script.preloading = true;
            var parser = new pc.SceneParser(this._app);
            var parent = parser.parse(data);
            // set scene root
            var scene = this._app.scene;
            scene.root = parent;
            this._app.applySceneSettings(data.settings);
            // re-enable script initialization
            this._app.systems.script.preloading = false;
            return scene;
        };
        SceneHandler.prototype.patch = function (asset, assets) {
        };
        return SceneHandler;
    }());
    return {
        SceneHandler: SceneHandler
    };
})());
//# sourceMappingURL=scene.js.map