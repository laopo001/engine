pc.extend(pc, (() => {
    // checks if user is running IE
    const ie = ((() => {
        const ua = window.navigator.userAgent;

        const msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }

        const trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            const rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }

        return false;
    }))();

    class AudioHandler {
        constructor(manager) {
            this.manager = manager;
        }

        _isSupported(url) {
            const toMIME = {
                '.ogg': 'audio/ogg',
                '.mp3': 'audio/mpeg',
                '.wav': 'audio/x-wav',
                '.mp4a': 'audio/mp4',
                '.m4a': 'audio/mp4',
                '.mp4': 'audio/mp4',
                '.aac': 'audio/aac'
            };

            const ext = pc.path.getExtension(url);

            if (toMIME[ext]) {
                return true;
            } else {
                return false;
            }
        }

        load(url, callback) {
            const success = resource => {
                callback(null, new pc.Sound(resource));
            };

            const error = msg => {
                msg = msg || `Error loading audio url: ${url}`;
                console.warn(msg);
                callback(msg);
            };

            if (this._createSound) {
                if (!this._isSupported(url)) {
                    error(pc.string.format('Audio format for {0} not supported', url));
                    return;
                }

                this._createSound(url, success, error);
            } else {
                error(null);
            }
        }

        open(url, data) {
            return data;
        }

        /**
         * @private
         * @function
         * @name pc.SoundHandler._createSound
         * @description Loads an audio asset using an AudioContext by URL and calls success or error with the created resource or error respectively
         * @param {String} url The url of the audio asset
         * @param {Function} success Function to be called if the audio asset was loaded or if we
         * just want to continue without errors even if the audio is not loaded.
         * @param {Function} error Function to be called if there was an error while loading the audio asset
         */
        _createSound(url, success, error) {
            const manager = this.manager;

            if (! manager.context) {
                error('Audio manager has no audio context');
                return;
            }

            pc.http.get(url, (err, response) => {
                if (err) {
                    error(err);
                    return;
                }

                manager.context.decodeAudioData(response, success, error);
            });
        }

        /**
         * @private
         * @function
         * @name pc.SoundHandler._createSound
         * @description Loads an audio asset using an Audio element by URL and calls success or error with the created resource or error respectively
         * @param {String} url The url of the audio asset
         * @param {Function} success Function to be called if the audio asset was loaded or if we
         * just want to continue without errors even if the audio is not loaded.
         * @param {Function} error Function to be called if there was an error while loading the audio asset
         */
        _createSound(url, success, error) {
            let audio = null;

            try {
                audio = new Audio();
            } catch (e) {
                // Some windows platforms will report Audio as available, then throw an exception when
                // the object is created.
                error("No support for Audio element");
                return;
            }

            // audio needs to be added to the DOM for IE
            if (ie) {
                document.body.appendChild(audio);
            }

            const onReady = () => {
                audio.removeEventListener('canplaythrough', onReady);

                // remove from DOM no longer necessary
                if (ie) {
                    document.body.removeChild(audio);
                }

                success(audio);
            };

            audio.onerror = () => {
                audio.onerror = null;

                // remove from DOM no longer necessary
                if (ie) {
                    document.body.removeChild(audio);
                }

                error();
            };

            audio.addEventListener('canplaythrough', onReady);
            audio.src = url;
        }
    }

    if (pc.SoundManager.hasAudioContext()) {} else if (pc.SoundManager.hasAudio()) {}

    return {
        AudioHandler
    };
})());
