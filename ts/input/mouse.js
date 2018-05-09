pc.extend(pc, (() => {
    /**
     * @constructor
     * @name pc.MouseEvent
     * @classdesc MouseEvent object that is passed to events 'mousemove', 'mouseup', 'mousedown' and 'mousewheel'.
     * @description Create an new MouseEvent
     * @param {pc.Mouse} mouse The Mouse device that is firing this event
     * @param {MouseEvent} event The original browser event that fired
     * @property {Number} x The x co-ordinate of the mouse pointer relative to the element pc.Mouse is attached to
     * @property {Number} y The y co-ordinate of the mouse pointer relative to the element pc.Mouse is attached to
     * @property {Number} dx The change in x co-ordinate since the last mouse event
     * @property {Number} dy The change in y co-ordinate since the last mouse event
     * @property {Number} button The mouse button associated with this event. Can be:
     * <ul>
     *     <li>{@link pc.MOUSEBUTTON_LEFT}</li>
     *     <li>{@link pc.MOUSEBUTTON_MIDDLE}</li>
     *     <li>{@link pc.MOUSEBUTTON_RIGHT}</li>
     * </ul>
     * @property {Number} wheel A value representing the amount the mouse wheel has moved, only valid for {@link mousemove} events
     * @property {Element} element The element that the mouse was fired from
     * @property {Boolean} ctrlKey True if the ctrl key was pressed when this event was fired
     * @property {Boolean} shiftKey True if the shift key was pressed when this event was fired
     * @property {Boolean} altKey True if the alt key was pressed when this event was fired
     * @property {Boolean} metaKey True if the meta key was pressed when this event was fired
     * @property {MouseEvent} event The original browser event
     * @since 0.88.0
     */
    const MouseEvent = function (mouse, event) {
        let coords = {
            x: 0,
            y: 0
        };

        if (event) {
            if (event instanceof MouseEvent) {
                throw Error("Expected MouseEvent");
            }
            coords = mouse._getTargetCoords(event);
        } else {
            event = { };
        }

        if (coords) {
            this.x = coords.x;
            this.y = coords.y;
        } else if (pc.Mouse.isPointerLocked()) {
            this.x = 0;
            this.y = 0;
        } else {
            return;
        }

        // FF uses 'detail' and returns a value in 'no. of lines' to scroll
        // WebKit and Opera use 'wheelDelta', WebKit goes in multiples of 120 per wheel notch
        if (event.detail) {
            this.wheel = -1 * event.detail;
        } else if (event.wheelDelta) {
            this.wheel = event.wheelDelta / 120;
        } else {
            this.wheel = 0;
        }

        // Get the movement delta in this event
        if (pc.Mouse.isPointerLocked()) {
            this.dx = event.movementX || event.webkitMovementX || event.mozMovementX || 0;
            this.dy = event.movementY || event.webkitMovementY || event.mozMovementY || 0;
        } else {
            this.dx = this.x - mouse._lastX;
            this.dy = this.y - mouse._lastY;
        }

        if (event.type === 'mousedown' || event.type === 'mouseup') {
            this.button = event.button;
        } else {
            this.button = pc.MOUSEBUTTON_NONE;
        }
        this.buttons = mouse._buttons.slice(0);
        this.element = event.target;

        this.ctrlKey = event.ctrlKey || false;
        this.altKey = event.altKey || false;
        this.shiftKey = event.shiftKey || false;
        this.metaKey = event.metaKey || false;

        this.event = event;
    };

    // Events Documentation
    /**
    * @event
    * @name pc.Mouse#mousemove
    * @description Fired when the mouse is moved
    * @param {pc.MouseEvent} event The MouseEvent object
    */

    /**
    * @event
    * @name pc.Mouse#mousedown
    * @description Fired when a mouse button is pressed
    * @param {pc.MouseEvent} event The MouseEvent object
    */

    /**
    * @event
    * @name pc.Mouse#mouseup
    * @description Fired when a mouse button is released
    * @param {pc.MouseEvent} event The MouseEvent object
    */

    /**
    * @event
    * @name pc.Mouse#mousewheel
    * @description Fired when a mouse wheel is moved
    * @param {pc.MouseEvent} event The MouseEvent object
    */

    /**
     * @constructor
     * @name pc.Mouse
     * @classdesc A Mouse Device, bound to a DOM Element.
     * @description Create a new Mouse device
     * @param {Element} [element] The Element that the mouse events are attached to
     */
    class Mouse {
        constructor(element) {
            // Clear the mouse state
            this._lastX      = 0;
            this._lastY      = 0;
            this._buttons      = [false,false,false];
            this._lastbuttons  = [false, false, false];


            // Setup event handlers so they are bound to the correct 'this'
            this._upHandler = this._handleUp.bind(this);
            this._downHandler = this._handleDown.bind(this);
            this._moveHandler = this._handleMove.bind(this);
            this._wheelHandler = this._handleWheel.bind(this);
            this._contextMenuHandler = event => {
                event.preventDefault();
            };

            this._target = null;
            this._attached = false;

            this.attach(element);

            // Add events
            pc.events.attach(this);
        }

        /**
         * @function
         * @name pc.Mouse#attach
         * @description Attach mouse events to an Element.
         * @param {Element} element The DOM element to attach the mouse to.
         */
        attach(element) {
            this._target = element;

            if (this._attached) return;
            this._attached = true;

            window.addEventListener("mouseup", this._upHandler, false);
            window.addEventListener("mousedown", this._downHandler, false);
            window.addEventListener("mousemove", this._moveHandler, false);
            window.addEventListener("mousewheel", this._wheelHandler, false); // WekKit
            window.addEventListener("DOMMouseScroll", this._wheelHandler, false); // Gecko
        }

        /**
         * @function
         * @name pc.Mouse#detach
         * @description Remove mouse events from the element that it is attached to
         */
        detach() {
            if (! this._attached) return;
            this._attached = false;

            window.removeEventListener("mouseup", this._upHandler);
            window.removeEventListener("mousedown", this._downHandler);
            window.removeEventListener("mousemove", this._moveHandler);
            window.removeEventListener("mousewheel", this._wheelHandler); // WekKit
            window.removeEventListener("DOMMouseScroll", this._wheelHandler); // Gecko
        }

        /**
         * @function
         * @name pc.Mouse#disableContextMenu
         * @description Disable the context menu usually activated with right-click
         */
        disableContextMenu() {
            if (! this._target) return;
            this._target.addEventListener("contextmenu", this._contextMenuHandler);
        }

        /**
         * @function
         * @name pc.Mouse#enableContextMenu
         * @description Enable the context menu usually activated with right-click. This option is active by default.
         */
        enableContextMenu() {
            if (! this._target) return;
            this._target.removeEventListener("contextmenu", this._contextMenuHandler);
        }

        /**
        * @function
        * @name pc.Mouse#enablePointerLock
        * @description Request that the browser hides the mouse cursor and locks the mouse to the element.
        * Allowing raw access to mouse movement input without risking the mouse exiting the element.
        * Notes: <br />
        * <ul>
        * <li>In some browsers this will only work when the browser is running in fullscreen mode. See {@link pc.Application#enableFullscreen}
        * <li>Enabling pointer lock can only be initiated by a user action e.g. in the event handler for a mouse or keyboard input.
        * </ul>
        * @param {Function} [success] Function called if the request for mouse lock is successful.
        * @param {Function} [error] Function called if the request for mouse lock is unsuccessful.
        */
        enablePointerLock(success, error) {
            if (! document.body.requestPointerLock) {
                if (error)
                    error();

                return;
            }

            const s = () => {
                success();
                document.removeEventListener('pointerlockchange', s);
            };
            const e = () => {
                error();
                document.removeEventListener('pointerlockerror', e);
            };

            if (success) {
                document.addEventListener('pointerlockchange', s, false);
            }

            if (error) {
                document.addEventListener('pointerlockerror', e, false);
            }

            document.body.requestPointerLock();
        }

        /**
        * @function
        * @name pc.Mouse#disablePointerLock
        * @description Return control of the mouse cursor to the user
        * @param {Function} [success] Function called when the mouse lock is disabled
        */
        disablePointerLock(success) {
            if (! document.exitPointerLock) {
                return;
            }

            const s = () => {
                success();
                document.removeEventListener('pointerlockchange', s);
            };
            if (success) {
                document.addEventListener('pointerlockchange', s, false);
            }
            document.exitPointerLock();
        }

        /**
         * @function
         * @name pc.Mouse#update
         * @description Update method, should be called once per frame
         */
        update() {
            // Copy current button state
            this._lastbuttons[0] = this._buttons[0];
            this._lastbuttons[1] = this._buttons[1];
            this._lastbuttons[2] = this._buttons[2];
        }

        /**
         * @function
         * @name pc.Mouse#isPressed
         * @description Returns true if the mouse button is currently pressed
         * @param {Number} button The mouse button to test. Can be:
         * <ul>
         *     <li>{@link pc.MOUSEBUTTON_LEFT}</li>
         *     <li>{@link pc.MOUSEBUTTON_MIDDLE}</li>
         *     <li>{@link pc.MOUSEBUTTON_RIGHT}</li>
         * </ul>
         * @returns {Boolean} True if the mouse button is current pressed
         */
        isPressed(button) {
            return this._buttons[button];
        }

        /**
         * @function
         * @name pc.Mouse#wasPressed
         * @description Returns true if the mouse button was pressed this frame (since the last call to update).
         * @param {Number} button The mouse button to test. Can be:
         * <ul>
         *     <li>{@link pc.MOUSEBUTTON_LEFT}</li>
         *     <li>{@link pc.MOUSEBUTTON_MIDDLE}</li>
         *     <li>{@link pc.MOUSEBUTTON_RIGHT}</li>
         * </ul>
         * @returns {Boolean} True if the mouse button was pressed since the last update
         */
        wasPressed(button) {
            return (this._buttons[button] && !this._lastbuttons[button]);
        }

        /**
         * @function
         * @name pc.Mouse#wasReleased
         * @description Returns true if the mouse button was released this frame (since the last call to update).
         * @param {Number} button The mouse button to test. Can be:
         * <ul>
         *     <li>{@link pc.MOUSEBUTTON_LEFT}</li>
         *     <li>{@link pc.MOUSEBUTTON_MIDDLE}</li>
         *     <li>{@link pc.MOUSEBUTTON_RIGHT}</li>
         * </ul>
         * @returns {Boolean} True if the mouse button was released since the last update
         */
        wasReleased(button) {
            return (!this._buttons[button] && this._lastbuttons[button]);
        }

        _handleUp(event) {
            // disable released button
            this._buttons[event.button] = false;

            const e = new MouseEvent(this, event);
            if (! e.event) return;

            // send 'mouseup' event
            this.fire(pc.EVENT_MOUSEUP, e);
        }

        _handleDown(event) {
            // Store which button has affected
            this._buttons[event.button] = true;

            const e = new MouseEvent(this, event);
            if (! e.event) return;

            this.fire(pc.EVENT_MOUSEDOWN, e);
        }

        _handleMove(event) {
            const e = new MouseEvent(this, event);
            if (! e.event) return;

            this.fire(pc.EVENT_MOUSEMOVE, e);

            // Store the last offset position to calculate deltas
            this._lastX = e.x;
            this._lastY = e.y;
        }

        _handleWheel(event) {
            const e = new MouseEvent(this, event);
            if (! e.event) return;

            this.fire(pc.EVENT_MOUSEWHEEL, e);
        }

        _getTargetCoords({clientX, clientY}) {
            const rect = this._target.getBoundingClientRect();
            const left = Math.floor(rect.left);
            const top = Math.floor(rect.top);

            // mouse is outside of canvas
            if (clientX < left ||
                clientX >= left + this._target.clientWidth ||
                clientY < top ||
                clientY >= top + this._target.clientHeight) {

                return null;
            }

            return {
                x: clientX - left,
                y: clientY - top
            };
        }
    }

    /**
    * @function
    * @name pc.Mouse.isPointerLocked
    * @description Check if the mouse pointer has been locked, using {@link pc.Mouse#enabledPointerLock}
    * @returns {Boolean} True if locked
    */
    Mouse.isPointerLocked = () => !!(document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement);

    // Apply PointerLock shims
    ((() => {
        // Old API
        if (typeof navigator === 'undefined' || typeof document === 'undefined') {
            // Not running in a browser
            return;
        }

        navigator.pointer = navigator.pointer || navigator.webkitPointer || navigator.mozPointer;

        // Events
        const pointerlockchange = () => {
            const e = document.createEvent('CustomEvent');
            e.initCustomEvent('pointerlockchange', true, false, null);
            document.dispatchEvent(e);
        };

        const pointerlockerror = () => {
            const e = document.createEvent('CustomEvent');
            e.initCustomEvent('pointerlockerror', true, false, null);
            document.dispatchEvent(e);
        };

        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlocklost', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlocklost', pointerlockchange, false);

        document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
        document.addEventListener('mozpointerlockerror', pointerlockerror, false);

        // requestPointerLock
        if (Element.prototype.mozRequestPointerLock) {
            // FF requires a new function for some reason
            Element.prototype.requestPointerLock = function () {
                this.mozRequestPointerLock();
            };
        } else {
            Element.prototype.requestPointerLock = Element.prototype.requestPointerLock || Element.prototype.webkitRequestPointerLock || Element.prototype.mozRequestPointerLock;
        }

        if (!Element.prototype.requestPointerLock && navigator.pointer) {
            Element.prototype.requestPointerLock = function () {
                const el = this;
                document.pointerLockElement = el;
                navigator.pointer.lock(el, pointerlockchange, pointerlockerror);
            };
        }

        // exitPointerLock
        document.exitPointerLock = document.exitPointerLock || document.webkitExitPointerLock || document.mozExitPointerLock;
        if (!document.exitPointerLock) {
            document.exitPointerLock = () => {
                if (navigator.pointer) {
                    document.pointerLockElement = null;
                    navigator.pointer.unlock();
                }
            };
        }
    }))();


    // Public Interface
    return {
        Mouse,
        MouseEvent
    };
})());
