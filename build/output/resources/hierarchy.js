pc.extend(pc, (function () {
    var HierarchyHandler = /** @class */ (function () {
        function HierarchyHandler(app) {
            this._app = app;
        }
        HierarchyHandler.prototype.load = function (url, callback) {
            pc.http.get(url, function (err, response) {
                if (!err) {
                    callback(null, response);
                }
                else {
                    callback("Error requesting scene: " + url);
                }
            });
        };
        HierarchyHandler.prototype.open = function (url, data) {
            // prevent script initialization until entire scene is open
            this._app.systems.script.preloading = true;
            var parser = new pc.SceneParser(this._app);
            var parent = parser.parse(data);
            // re-enable script initialization
            this._app.systems.script.preloading = false;
            return parent;
        };
        return HierarchyHandler;
    }());
    return {
        HierarchyHandler: HierarchyHandler
    };
})());
//# sourceMappingURL=hierarchy.js.map