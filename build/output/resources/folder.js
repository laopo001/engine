pc.extend(pc, (function () {
    var FolderHandler = function () {
    };
    FolderHandler.prototype = {
        load: function (url, callback) {
            callback(null, null);
        },
        open: function (url, data) {
            return data;
        }
    };
    return {
        FolderHandler: FolderHandler
    };
})());
//# sourceMappingURL=folder.js.map