pc.extend(pc, (() => {
    const FolderHandler = () => {
    };

    FolderHandler.prototype = {
        load(url, callback) {
            callback(null, null);
        },

        open(url, data) {
            return data;
        }
    };

    return {
        FolderHandler
    };
})());
