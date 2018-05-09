pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.ScriptHandler
     * @classdesc ResourceHandler for loading JavaScript files dynamically
     * Two types of JavaScript files can be loaded, PlayCanvas scripts which contain calls to {@link pc.createScript},
     * or regular JavaScript files, such as third-party libraries.
     * @param {pc.Application} app The running {pc.Application}
     */
    class ScriptHandler {
        constructor(app) {
            this._app = app;
            this._scripts = { };
            this._cache = { };
        }

        load(url, callback) {
            const self = this;
            pc.script.app = this._app;

            this._loadScript(url, (err, url, extra) => {
                if (!err) {
                    if (pc.script.legacy) {
                        let Type = null;
                        // pop the type from the loading stack
                        if (ScriptHandler._types.length) {
                            Type = ScriptHandler._types.pop();
                        }

                        if (Type) {
                            // store indexed by URL
                            this._scripts[url] = Type;
                        } else {
                            Type = null;
                        }

                        // return the resource
                        callback(null, Type, extra);
                    } else {
                        const obj = { };

                        for (let i = 0; i < ScriptHandler._types.length; i++)
                            obj[ScriptHandler._types[i].name] = ScriptHandler._types[i];

                        ScriptHandler._types.length = 0;

                        callback(null, obj, extra);

                        // no cache for scripts
                        delete self._loader._cache[`${url}script`];
                    }
                } else {
                    callback(err);
                }
            });
        }

        open(url, data) {
            return data;
        }

        patch(asset, assets) { }

        _loadScript(url, callback) {
            const head = document.head;
            const element = document.createElement('script');
            this._cache[url] = element;

            // use async=false to force scripts to execute in order
            element.async = false;

            element.addEventListener('error', ({target}) => {
                callback(pc.string.format("Script: {0} failed to load", target.src));
            }, false);

            let done = false;
            element.onload = element.onreadystatechange = function () {
                if (!done && (!this.readyState || (this.readyState == "loaded" || this.readyState == "complete"))) {
                    done = true; // prevent double event firing
                    callback(null, url, element);
                }
            };
            // set the src attribute after the onload callback is set, to avoid an instant loading failing to fire the callback
            element.src = url;

            head.appendChild(element);
        }
    }

    ScriptHandler._types = [];
    ScriptHandler._push = Type => {
        if (pc.script.legacy && ScriptHandler._types.length > 0) {
            console.assert("Script Ordering Error. Contact support@playcanvas.com");
        } else {
            ScriptHandler._types.push(Type);
        }
    };

    return {
        ScriptHandler
    };
})());
