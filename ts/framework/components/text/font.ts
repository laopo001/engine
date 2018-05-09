pc.extend(pc, (() => {
    pc.FONT_MSDF = 'msdf';

    /**
     * @constructor
     * @name pc.Font
     * @classdesc Represents the resource of a font asset.
     * @param {pc.Texture[]} textures The font textures
     * @param {Object} data The font data
     * @property {Number} intensity The font intensity
     * @property {pc.Texture[]} textures The font textures
     */
    class Font {
        constructor(textures, data) {
            this.type = pc.FONT_MSDF;

            this.em = 1;

            // atlas texture
            this.textures = textures;

            // intensity
            this.intensity = 0.0;

            // json data
            this._data = null;
            this.data = data;
        }

        get data() {
            return this._data;
        }

        set data(value) {
            this._data = value;
            if (! value)
                return;

            if (this._data.intensity !== undefined) {
                this.intensity = this._data.intensity;
            }

            if (! this._data.info)
                this._data.info = {};

            // check if we need to migrate to version 2
            if (! this._data.version || this._data.version < 2) {
                this._data.info.maps = [{
                    width: this._data.info.width,
                    height: this._data.info.height
                }];

                if (this._data.chars) {
                    for (const key in this._data.chars) {
                        this._data.chars[key].map = 0;
                    }
                }
            }
        }
    }

    Font.prototype = {
    };

    return {
        FONT_MSDF: pc.FONT_MSDF,
        Font
    };
})());
