pc.extend(pc, (function () {
    var SceneSettingsHandler = /** @class */ (function () {
        function SceneSettingsHandler(app) {
            this._app = app;
        }
        SceneSettingsHandler.prototype.load = function (url, callback) {
            pc.http.get(url, function (err, response) {
                if (!err) {
                    callback(null, response);
                }
                else {
                    callback("Error requesting scene: " + url);
                }
            });
        };
        SceneSettingsHandler.prototype.open = function (url, _a) {
            var settings = _a.settings;
            return settings;
        };
        return SceneSettingsHandler;
    }());
    return {
        SceneSettingsHandler: SceneSettingsHandler
    };
})());
//# sourceMappingURL=scene-settings.js.map