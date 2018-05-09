pc.extend(pc, (() => {
    class HierarchyHandler {
        constructor(app) {
            this._app = app;
        }

        load(url, callback) {
            pc.http.get(url, (err, response) => {
                if (!err) {
                    callback(null, response);
                } else {
                    callback(`Error requesting scene: ${url}`);
                }
            });
        }

        open(url, data) {
            // prevent script initialization until entire scene is open
            this._app.systems.script.preloading = true;

            const parser = new pc.SceneParser(this._app);
            const parent = parser.parse(data);

            // re-enable script initialization
            this._app.systems.script.preloading = false;

            return parent;
        }
    }

    return {
        HierarchyHandler
    };
})());
