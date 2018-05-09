pc.extend(pc, (() => {
    class SceneHandler {
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

            // set scene root
            const scene = this._app.scene;
            scene.root = parent;

            this._app.applySceneSettings(data.settings);

            // re-enable script initialization
            this._app.systems.script.preloading = false;

            return scene;
        }

        patch(asset, assets) {
        }
    }

    return {
        SceneHandler
    };
})());
