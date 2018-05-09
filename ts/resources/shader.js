pc.extend(pc, (() => {
    const ShaderHandler = () => {};

    ShaderHandler.prototype = {
        load(url, callback) {
            pc.http.get(url, (err, response) => {
                if (!err) {
                    callback(null, response);
                } else {
                    callback(pc.string.format("Error loading shader resource: {0} [{1}]", url, err));
                }
            });
        },

        open(url, data) {
            return data;
        },

        patch(asset, assets) {
        }
    };

    return {
        ShaderHandler
    };
})());
