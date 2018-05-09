// String.startsWith polyfill
if (! String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: true,
        writable: true,
        value(str) {
            const that = this;
            for (let i = 0, ceil = str.length; i < ceil; i++)
                if (that[i] !== str[i]) return false;
            return true;
        }
    });
}

// String.endsWith polyfill
if (! String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        enumerable: false,
        configurable: true,
        writable: true,
        value(str) {
            const that = this;
            for (let i = 0, ceil = str.length; i < ceil; i++)
                if (that[i + that.length - ceil] !== str[i])
                    return false;
            return true;
        }
    });
}

if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}
