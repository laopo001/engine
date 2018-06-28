pc.extend(pc, (function () {
    /**
     * @constructor
     * @name pc.GamePads
     * @classdesc Input handler for accessing GamePad input.
     */
    var GamePads = /** @class */ (function () {
        function GamePads() {
            this.gamepadsSupported = !!navigator.getGamepads || !!navigator.webkitGetGamepads;
            this.current = [];
            this.previous = [];
            this.deadZone = 0.25;
        }
        /**
        * @function
        * @name pc.GamePads#update
        * @description Update the current and previous state of the gamepads. This must be called every frame for wasPressed()
        * to work
        */
        GamePads.prototype.update = function () {
            var i, j, l;
            var buttons, buttonsLen;
            // move current buttons status into previous array
            for (i = 0, l = this.current.length; i < l; i++) {
                buttons = this.current[i].pad.buttons;
                buttonsLen = buttons.length;
                for (j = 0; j < buttonsLen; j++) {
                    if (this.previous[i] === undefined) {
                        this.previous[i] = [];
                    }
                    this.previous[i][j] = buttons[j].pressed;
                }
            }
            // update current
            var pads = this.poll();
            for (i = 0, l = pads.length; i < l; i++) {
                this.current[i] = pads[i];
            }
        };
        /**
        * @function
        * @name pc.GamePads#poll
        * @description Poll for the latest data from the gamepad API.
        * @returns {Object[]} An array of gamepads and mappings for the model of gamepad that is attached
        * @example
        *   var gamepads = new pc.GamePads();
        *   var pads = gamepads.poll();
        *   // pads[0] = { map: <map>, pad: <pad> }
        */
        GamePads.prototype.poll = function () {
            var pads = [];
            if (this.gamepadsSupported) {
                var padDevices = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads();
                var i = void 0;
                var len = padDevices.length;
                for (i = 0; i < len; i++) {
                    if (padDevices[i]) {
                        pads.push({
                            map: this.getMap(padDevices[i]),
                            pad: padDevices[i]
                        });
                    }
                }
            }
            return pads;
        };
        GamePads.prototype.getMap = function (_a) {
            var id = _a.id;
            for (var code in PRODUCT_CODES) {
                if (id.includes(code)) {
                    return MAPS[PRODUCT_CODES[code]];
                }
            }
            return MAPS.DEFAULT;
        };
        /**
        * @function
        * @name pc.GamePads#isPressed
        * @description Returns true if the button on the pad requested is pressed
        * @param {Number} index The index of the pad to check, use constants pc.PAD_1, pc.PAD_2, etc
        * @param {Number} button The button to test, use constants pc.PAD_FACE_1, etc
        * @returns {Boolean} True if the button is pressed
        */
        GamePads.prototype.isPressed = function (index, button) {
            if (!this.current[index]) {
                return false;
            }
            var key = this.current[index].map.buttons[button];
            return this.current[index].pad.buttons[pc[key]].pressed;
        };
        /**
        * @function
        * @name pc.GamePads#wasPressed
        * @description Returns true if the button was pressed since the last frame
        * @param {Number} index The index of the pad to check, use constants pc.PAD_1, pc.PAD_2, etc
        * @param {Number} button The button to test, use constants pc.PAD_FACE_1, etc
        * @returns {Boolean} True if the button was pressed since the last frame
        */
        GamePads.prototype.wasPressed = function (index, button) {
            if (!this.current[index]) {
                return false;
            }
            var key = this.current[index].map.buttons[button];
            var i = pc[key];
            return this.current[index].pad.buttons[i].pressed && !this.previous[index][i];
        };
        /**
        * @function
        * @name pc.GamePads#getAxis
        * @description Get the value of one of the analogue axes of the pad
        * @param {Number} index The index of the pad to check, use constants pc.PAD_1, pc.PAD_2, etc
        * @param {Number} axes The axes to get the value of, use constants pc.PAD_L_STICK_X, etc
        * @returns {Number} The value of the axis between -1 and 1.
        */
        GamePads.prototype.getAxis = function (index, axes) {
            if (!this.current[index]) {
                return false;
            }
            var key = this.current[index].map.axes[axes];
            var value = this.current[index].pad.axes[pc[key]];
            if (Math.abs(value) < this.deadZone) {
                value = 0;
            }
            return value;
        };
        return GamePads;
    }());
    var MAPS = {
        DEFAULT: {
            buttons: [
                // Face buttons
                'PAD_FACE_1',
                'PAD_FACE_2',
                'PAD_FACE_3',
                'PAD_FACE_4',
                // Shoulder buttons
                'PAD_L_SHOULDER_1',
                'PAD_R_SHOULDER_1',
                'PAD_L_SHOULDER_2',
                'PAD_R_SHOULDER_2',
                // Other buttons
                'PAD_SELECT',
                'PAD_START',
                'PAD_L_STICK_BUTTON',
                'PAD_R_STICK_BUTTON',
                // D Pad
                'PAD_UP',
                'PAD_DOWN',
                'PAD_LEFT',
                'PAD_RIGHT',
                // Vendor specific button
                'PAD_VENDOR'
            ],
            axes: [
                // Analogue Sticks
                'PAD_L_STICK_X',
                'PAD_L_STICK_Y',
                'PAD_R_STICK_X',
                'PAD_R_STICK_Y'
            ]
        },
        PS3: {
            buttons: [
                // X, O, TRI, SQ
                'PAD_FACE_1',
                'PAD_FACE_2',
                'PAD_FACE_4',
                'PAD_FACE_3',
                // Shoulder buttons
                'PAD_L_SHOULDER_1',
                'PAD_R_SHOULDER_1',
                'PAD_L_SHOULDER_2',
                'PAD_R_SHOULDER_2',
                // Other buttons
                'PAD_SELECT',
                'PAD_START',
                'PAD_L_STICK_BUTTON',
                'PAD_R_STICK_BUTTON',
                // D Pad
                'PAD_UP',
                'PAD_DOWN',
                'PAD_LEFT',
                'PAD_RIGHT',
                'PAD_VENDOR'
            ],
            axes: [
                // Analogue Sticks
                'PAD_L_STICK_X',
                'PAD_L_STICK_Y',
                'PAD_R_STICK_X',
                'PAD_R_STICK_Y'
            ]
        }
    };
    var PRODUCT_CODES = {
        'Product: 0268': 'PS3'
    };
    return {
        GamePads: GamePads
    };
})());
//# sourceMappingURL=game-pads.js.map