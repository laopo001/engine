namespace pc {
    /**
     * @private
     * @function
     * @name pc.hashCode
     * @description Calculates simple hash value of a string. Designed for performance, not perfect.
     * @param {String} str String
     * @returns {Number} Hash value
     */
    export function hashCode(str: string): number {
        let hash = 0;
        if (str.length === 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }
}