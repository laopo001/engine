pc.extend(pc, (() => {
    class SceneSettingsHandler {
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

        open(url, {settings}) {
            return settings;
        }
    }

    return {
        SceneSettingsHandler
    };
})());
