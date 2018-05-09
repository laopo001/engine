namespace pc {
    // Public interface
   export  class ProgramLibrary {
       _device: any;
       _cache: {};
       _generators: {};
       _isClearingCache: boolean;
        constructor(device) {
            this._device = device;
            this._cache = {};
            this._generators = {};
            this._isClearingCache = false;
        }

        register(name, generator) {
            if (!this.isRegistered(name)) {
                this._generators[name] = generator;
            }
        }

        unregister(name) {
            if (this.isRegistered(name)) {
                delete this._generators[name];
            }
        }

        isRegistered(name) {
            const generator = this._generators[name];
            return (generator !== undefined);
        }

        getProgram(name, options) {
            const generator = this._generators[name];
            if (generator === undefined) {
                logERROR(`No program library functions registered for: ${name}`);
                return null;
            }
            const gd = this._device;
            const key = generator.generateKey(gd, options); // TODO: gd is never used in generateKey(), remove?
            let shader = this._cache[key];
            if (!shader) {
                const shaderDefinition = generator.createShaderDefinition(gd, options);
                shader = this._cache[key] = new pc.Shader(gd, shaderDefinition);
            }
            return shader;
        }

        clearCache() {
            const cache = this._cache;
            this._isClearingCache = true;
            for (const key in cache) {
                if (cache.hasOwnProperty(key)) {
                    cache[key].destroy();
                }
            }
            this._cache = {};
            this._isClearingCache = false;
        }

        removeFromCache(shader) {
            if (this._isClearingCache) return; // don't delete by one when clearing whole cache
            const cache = this._cache;
            for (const key in cache) {
                if (cache.hasOwnProperty(key)) {
                    if (cache[key]===shader) {
                        delete cache[key];
                        break;
                    }
                }
            }
        }
    }

}
