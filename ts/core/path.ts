namespace pc {
    /**
     * @namespace pc.path
     * @description File path API
     */
    export const path = {
        /**
         * The character that separates path segments
         * @name pc.path.delimiter
         */
        delimiter: "/",

        /**
         * Join two sections of file path together, insert a delimiter if needed.
         * @param {String} one First part of path to join
         * @param {String} two Second part of path to join
         * @function
         * @name pc.path.join
         */
        /*
        join: function(one, two) {
            if(two[0] === pc.path.delimiter) {
                return two;
            }
    
            if(one && two && one[one.length - 1] !== pc.path.delimiter && two[0] !== pc.path.delimiter) {
                return one + pc.path.delimiter + two;
            }
            else {
                return one + two;
            }
        },
        */
        join(...args) {
            let index;
            const num = args.length;
            let result = args[0];

            for (index = 0; index < num - 1; ++index) {
                const one = args[index];
                const two = args[index + 1];
                if (!pc.isDefined(one) || !pc.isDefined(two)) {
                    throw new Error("undefined argument to pc.path.join");
                }
                if (two[0] === pc.path.delimiter) {
                    result = two;
                    continue;
                }

                if (one && two && one[one.length - 1] !== pc.path.delimiter && two[0] !== pc.path.delimiter) {
                    result += (pc.path.delimiter + two);
                } else {
                    result += (two);
                }
            }

            return result;
        },

        /**
         * @function
         * @name pc.path.split
         * @description Split the pathname path into a pair [head, tail] where tail is the final part of the path
         * after the last delimiter and head is everything leading up to that. tail will never contain a slash
         * @param {String} path The path to split.
         * @returns {Array} The split path which is an array of two strings, the path and the filename.
         */
        split(path) {
            const parts = path.split(pc.path.delimiter);
            const tail = parts.slice(parts.length - 1)[0];
            const head = parts.slice(0, parts.length - 1).join(pc.path.delimiter);
            return [head, tail];
        },

        /**
         * @function
         * @name pc.path.getBasename
         * @description Return the basename of the path. That is the second element of the pair returned by
         * passing path into {@link pc.path.split}.
         * @param {String} path The path to process.
         * @returns {String} The basename.
         * @example
         * pc.path.getBasename("/path/to/file.txt"); // returns "path.txt"
         * pc.path.getBasename("/path/to/dir"); // returns "dir"
         */
        getBasename(path) {
            return pc.path.split(path)[1];
        },

        /**
         * @function
         * @name pc.path.getDirectory
         * @description Get the directory name from the path. This is everything up to the final instance of pc.path.delimiter.
         * @param {String} path The path to get the directory from
         * @returns {String} The directory part of the path.
         */
        getDirectory(path) {
            const parts = path.split(pc.path.delimiter);
            return parts.slice(0, parts.length - 1).join(pc.path.delimiter);
        },

        getExtension(path) {
            const ext = path.split('?')[0].split('.').pop();
            if (ext !== path) {
                return `.${ext}`;
            } else {
                return "";
            }
        },

        isRelativePath(s) {
            return s.charAt(0) !== "/" && s.match(/:\/\//) === null;
        },

        extractPath(s) {
            let path = ".";
            const parts = s.split("/");
            let i = 0;

            if (parts.length > 1) {
                if (this.isRelativePath(s) === false) {
                    path = "";
                }
                for (i = 0; i < parts.length - 1; ++i) {
                    path += `/${parts[i]}`;
                }
            }
            return path;
        }
    }
}