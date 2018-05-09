pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.VrManager
     * @classdesc Manage and update {@link pc.VrDisplay}s that are attached to this device.
     * @description Manage and update {@link pc.VrDisplay}s that are attached to this device.
     * @param {pc.Application} app The main application
     * @property {pc.VrDisplay[]} displays The list of {@link pc.VrDisplay}s that are attached to this device
     * @property {pc.VrDisplay} display The default {@link pc.VrDisplay} to be used. Usually the first in the `displays` list
     * @property {Boolean} isSupported Reports whether this device supports the WebVR API
     * @property {Boolean} usesPolyfill Reports whether this device supports the WebVR API using a polyfill
     */
    class VrManager {
        constructor(app) {
            pc.events.attach(this);

            const self = this;

            this.isSupported = VrManager.isSupported;
            this.usesPolyfill = VrManager.usesPolyfill;

            // if required initialize webvr polyfill
            if (window.InitializeWebVRPolyfill)
                window.InitializeWebVRPolyfill();

            this._index = { };
            this.displays = [ ];
            this.display = null; // primary display (usually the first in list)

            this._app = app;

            // bind functions for event callbacks
            this._onDisplayConnect = this._onDisplayConnect.bind(this);
            this._onDisplayDisconnect = this._onDisplayDisconnect.bind(this);

            self._attach();

            this._getDisplays((err, displays) => {
                if (err) {
                    // webvr not available
                    self.fire('error', err);
                } else {
                    for (let i = 0; i < displays.length; i++) {
                        self._addDisplay(displays[i]);
                    }

                    self.fire('ready', self.displays);
                }
            });
        }

        _attach() {
            window.addEventListener('vrdisplayconnect', this._onDisplayConnect);
            window.addEventListener('vrdisplaydisconnect', this._onDisplayDisconnect);
        }

        _detach() {
            window.removeEventListener('vrdisplayconnect', this._onDisplayConnect);
            window.removeEventListener('vrdisplaydisconnect', this._onDisplayDisconnect);
        }

        /**
         * @function
         * @name pc.VrManager#destroy
         * @description Remove events and clear up manager
         */
        destroy() {
            this._detach();
        }

        /**
         * @function
         * @name pc.VrManager#poll
         * @description Called once per frame to poll all attached displays
         */
        poll() {
            const l = this.displays.length;
            if (!l) return;
            for (let i = 0; i < l; i++) {
                if (this.displays[i]._camera) this.displays[i].poll();
            }
        }

        _getDisplays(callback) {
            if (navigator.getVRDisplays) {
                navigator.getVRDisplays().then(displays => {
                    if (callback) callback(null, displays);
                });
            } else {
                if (callback) callback(new Error('WebVR not supported'));
            }
        }

        _addDisplay(vrDisplay) {
            if (this._index[vrDisplay.displayId])
                return;

            const display = new pc.VrDisplay(this._app, vrDisplay);
            this._index[display.id] = display;
            this.displays.push(display);

            if (! this.display)
                this.display = display;

            this.fire('displayconnect', display);
        }

        _onDisplayConnect({detail, display}) {
            if (detail && detail.display) {
                // polyfill has different event format
                this._addDisplay(detail.display);
            } else {
                // real event API
                this._addDisplay(display);
            }

        }

        _onDisplayDisconnect(e) {
            let id;
            if (e.detail && e.detail.display) {
                // polyfill has different event format
                id = e.detail.display.displayId;
            } else {
                // real event API
                id = e.display.displayId;
            }

            const display = this._index[id];
            if (! display)
                return;

            display.destroy();

            delete this._index[display.id];

            const ind = this.displays.indexOf(display);
            this.displays.splice(ind, 1);

            if (this.display === display) {
                if (this.displays.length) {
                    this.display = this.displays[0];
                } else {
                    this.display = null;
                }
            }

            this.fire('displaydisconnect', display);
        }
    }

    /**
    * @event
    * @name pc.VrManager#displayconnect
    * @description Fired when an VR display is connected
    * @param {pc.VrDisplay} display The {@link pc.VrDisplay} that has just been connected
    * @example
    * this.app.vr.on("displayconnect", function (display) {
    *     // use `display` here
    * });
    */

    /**
    * @event
    * @name pc.VrManager#displaydisconnect
    * @description Fired when an VR display is disconnected
    * @param {pc.VrDisplay} display The {@link pc.VrDisplay} that has just been disconnected
    * @example
    * this.app.vr.on("displaydisconnect", function (display) {
    *     // `display` is no longer connected
    * });
    */

    /**
     * @static
     * @name pc.VrManager.isSupported
     * @type Boolean
     * @description Reports whether this device supports the WebVR API
     */
    VrManager.isSupported = !! navigator.getVRDisplays;

    /**
     * @static
     * @name pc.VrManager.usesPolyfill
     * @type Boolean
     * @description Reports whether this device supports the WebVR API using a polyfill
     */
    VrManager.usesPolyfill = !! window.InitializeWebVRPolyfill;

    return {
        VrManager
    };
})());
