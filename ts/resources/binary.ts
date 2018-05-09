pc.extend(pc, (() => {
    const BinaryHandler = () => {

    };

    BinaryHandler.prototype = {
        load(url, callback) {
            pc.http.get(url, {responseType: pc.Http.ResponseType.ARRAY_BUFFER}, (err, response) => {
                if (!err) {
                    callback(null, response);
                } else {
                    callback(pc.string.format("Error loading binary resource: {0} [{1}]", url, err));
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
        BinaryHandler
    };
})());
