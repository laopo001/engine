pc.extend(pc, (() => {
    const HtmlHandler = () => {};

    HtmlHandler.prototype = {
        load(url, callback) {
            pc.http.get(url, (err, response) => {
                if (!err) {
                    callback(null, response);
                } else {
                    callback(pc.string.format("Error loading html resource: {0} [{1}]", url, err));
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
        HtmlHandler
    };
})());
