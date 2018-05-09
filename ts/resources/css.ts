pc.extend(pc, (() => {
    const CssHandler = () => {};

    CssHandler.prototype = {
        load(url, callback) {
            pc.http.get(url, (err, response) => {
                if (!err) {
                    callback(null, response);
                } else {
                    callback(pc.string.format("Error loading css resource: {0} [{1}]", url, err));
                }
            });
        },

        open(url, data) {
            return data;
        },

        patch(asset, assets) {
        }
    };

    /**
     * @function
     * @name pc.createStyle
     * @description Creates a &lt;style&gt; DOM element from a string that contains CSS
     * @param {String} cssString A string that contains valid CSS
     * @example
     * var css = 'body {height: 100;}';
     * var style = pc.createStyle(css);
     * document.head.appendChild(style);
     * @returns {Element} The style DOM element
     */
    const createStyle = cssString => {
        const result = document.createElement('style');
        result.type = 'text/css';
        if (result.styleSheet) {
            result.styleSheet.cssText = cssString;
        } else {
            result.appendChild(document.createTextNode(cssString));
        }

        return result;
    };

    return {
        CssHandler,
        createStyle
    };
})());
