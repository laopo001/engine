pc.extend(pc, (() => {
    let targetX, targetY;
    const vecA = new pc.Vec3();
    const vecB = new pc.Vec3();

    const _pq = new pc.Vec3();
    const _pa = new pc.Vec3();
    const _pb = new pc.Vec3();
    const _pc = new pc.Vec3();
    const _pd = new pc.Vec3();
    const _m = new pc.Vec3();
    const _sct = new pc.Vec3();

    // Given line pq and ccw corners of a quad, return whether the line
    // intersects it. (from Real-Time Collision Detection book)
    const intersectLineQuad = (p, q, corners) => {
        _pq.sub2(q, p);
        _pa.sub2(corners[0], p);
        _pb.sub2(corners[1], p);
        _pc.sub2(corners[2], p);

        // Determine which triangle to test against by testing against diagonal first
        _m.cross(_pc, _pq);
        const v = _pa.dot(_m);
        if (v >= 0) {
            // Test intersection against triangle abc
            if (-_pb.dot(_m) < 0)
                return false;

            if (scalarTriple(_pq, _pb, _pa) < 0)
                return false;
        } else {
            // Test intersection against triangle dac
            _pd.sub2(corners[3], p);
            if (_pd.dot(_m) < 0)
                return false;

            if (scalarTriple(_pq, _pa, _pd) < 0)
                return false;
        }

        return true;
    };

    // pi x p2 * p3
    var scalarTriple = (p1, p2, p3) => _sct.cross(p1, p2).dot(p3);

    /**
     * @constructor
     * @name pc.ElementInputEvent
     * @classdesc Represents an input event fired on a {@link pc.ElementComponent}. When an event is raised
     * on an ElementComponent it bubbles up to its parent ElementComponents unless we call stopPropagation().
     * @description Create an instance of a pc.ElementInputEvent.
     * @param {MouseEvent|TouchEvent} event The MouseEvent or TouchEvent that was originally raised.
     * @param {pc.ElementComponent} element The ElementComponent that this event was originally raised on.
     * @property {MouseEvent|TouchEvent} event The MouseEvent or TouchEvent that was originally raised.
     * @property {pc.ElementComponent} element The ElementComponent that this event was originally raised on.
     */
    class ElementInputEvent {
        constructor(event, element) {
            this.event = event;
            this.element = element;
            this._stopPropagation = false;
        }

        /**
         * @function
         * @name pc.ElementInputEvent#stopPropagation
         * @description Stop propagation of the event to parent {@link pc.ElementComponent}s. This also stops propagation of the event to other event listeners of the original DOM Event.
         */
        stopPropagation() {
            this._stopPropagation = true;
            this.event.stopImmediatePropagation();
            this.event.stopPropagation();
        }
    }

    /**
     * @constructor
     * @name pc.ElementMouseEvent
     * @classdesc Represents a Mouse event fired on a {@link pc.ElementComponent}.
     * @extends pc.ElementInputEvent
     * @description Create an instance of a pc.ElementMouseEvent.
     * @param {MouseEvent} event The MouseEvent that was originally raised.
     * @param {pc.ElementComponent} element The ElementComponent that this event was originally raised on.
     * @param {Number} x The x coordinate
     * @param {Number} y The y coordinate
     * @param {Number} lastX The last x coordinate
     * @param {Number} lastY The last y coordinate
     * @property {Boolean} ctrlKey Whether the ctrl key was pressed
     * @property {Boolean} altKey Whether the alt key was pressed
     * @property {Boolean} shiftKey Whether the shift key was pressed
     * @property {Boolean} metaKey Whether the meta key was pressed
     * @property {Number} button The mouse button
     * @property {Number} dx The amount of horizontal movement of the cursor
     * @property {Number} dy The amount of vertical movement of the cursor
     * @property {Number} wheel The amount of the wheel movement
     */
    let ElementMouseEvent = function (event, element, x, y, lastX, lastY) {
        this.x = x;
        this.y = y;

        this.ctrlKey = event.ctrlKey || false;
        this.altKey = event.altKey || false;
        this.shiftKey = event.shiftKey || false;
        this.metaKey = event.metaKey || false;

        this.button = event.button;

        if (pc.Mouse.isPointerLocked()) {
            this.dx = event.movementX || event.webkitMovementX || event.mozMovementX || 0;
            this.dy = event.movementY || event.webkitMovementY || event.mozMovementY || 0;
        } else {
            this.dx = x - lastX;
            this.dy = y - lastY;
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
    };

    ElementMouseEvent = pc.inherits(ElementMouseEvent, ElementInputEvent);

    /**
     * @constructor
     * @name pc.ElementTouchEvent
     * @classdesc Represents a TouchEvent fired on a {@link pc.ElementComponent}.
     * @extends pc.ElementInputEvent
     * @description Create an instance of a pc.ElementTouchEvent.
     * @param {TouchEvent} event The TouchEvent that was originally raised.
     * @param {pc.ElementComponent} element The ElementComponent that this event was originally raised on.
     * @param {pc.ElementInput} input The pc.ElementInput instance
     * @property {Touch[]} touches The Touch objects representing all current points of contact with the surface, regardless of target or changed status.
     * @property {Touch[]} changedTouches The Touch objects representing individual points of contact whose states changed between the previous touch event and this one.
     */
    let ElementTouchEvent = function({touches, changedTouches}, element, input) {
        this.touches = touches;
        this.changedTouches = changedTouches;
    };

    ElementTouchEvent = pc.inherits(ElementTouchEvent, ElementInputEvent);

    /**
     * @constructor
     * @name pc.ElementInput
     * @classdesc Handles mouse and touch events for {@link pc.ElementComponent}s. When input events
     * occur on an ElementComponent this fires the appropriate events on the ElementComponent.
     * @description Create a new pc.ElementInput instance.
     * @param {Element} domElement The DOM element
     */
    class ElementInput {
        constructor(domElement) {
            this._app = null;
            this._attached = false;
            this._target = null;

            this._lastX = 0;
            this._lastY = 0;

            this._upHandler = this._handleUp.bind(this);
            this._downHandler = this._handleDown.bind(this);
            this._moveHandler = this._handleMove.bind(this);
            this._wheelHandler = this._handleWheel.bind(this);
            this._touchstartHandler = this._handleTouchStart.bind(this);
            this._touchendHandler = this._handleTouchEnd.bind(this);
            this._touchcancelHandler = this._touchendHandler;
            this._touchmoveHandler = this._handleTouchMove.bind(this);

            this._elements = [];
            this._hoveredElement = null;
            this._pressedElement = null;
            this._touchedElements = {};

            if ('ontouchstart' in window) {
                this._clickedEntities = {};
            }

            this.attach(domElement);
        }

        /**
         * @function
         * @name pc.ElementInput#attach
         * @description Attach mouse and touch events to a DOM element.
         * @param {Element} domElement The DOM element
         */
        attach(domElement) {
            if (this._attached) {
                this._attached = false;
                this.detach();
            }

            this._target = domElement;
            this._attached = true;

            window.addEventListener('mouseup', this._upHandler, {passive: true});
            window.addEventListener('mousedown', this._downHandler, {passive: true});
            window.addEventListener('mousemove', this._moveHandler, {passive: true});
            window.addEventListener('mousewheel', this._wheelHandler, {passive: true});
            window.addEventListener('DOMMouseScroll', this._wheelHandler, {passive: true});

            if ('ontouchstart' in window) {
                this._target.addEventListener('touchstart', this._touchstartHandler, {passive: true});
                this._target.addEventListener('touchend', this._touchendHandler, {passive: true});
                this._target.addEventListener('touchmove', this._touchmoveHandler, false);
                this._target.addEventListener('touchcancel', this._touchcancelHandler, {passive: true});
            }
        }

        /**
         * @function
         * @name pc.ElementInput#detach
         * @description Remove mouse and touch events from the DOM element that it is attached to
         */
        detach() {
            if (! this._attached) return;
            this._attached = false;

            window.removeEventListener('mouseup', this._upHandler, false);
            window.removeEventListener('mousedown', this._downHandler, false);
            window.removeEventListener('mousemove', this._moveHandler, false);
            window.removeEventListener('mousewheel', this._wheelHandler, false);
            window.removeEventListener('DOMMouseScroll', this._wheelHandler, false);

            this._target.removeEventListener('touchstart', this._touchstartHandler, false);
            this._target.removeEventListener('touchend', this._touchendHandler, false);
            this._target.removeEventListener('touchmove', this._touchmoveHandler, false);
            this._target.removeEventListener('touchcancel', this._touchcancelHandler, false);

            this._target = null;
        }

        /**
         * @function
         * @name pc.ElementInput#addElement
         * @description Add a {@link pc.ElementComponent} to the internal list of ElementComponents that are being checked for input.
         * @param {pc.ElementComponent} element The ElementComponent
         */
        addElement(element) {
            if (!this._elements.includes(element))
                this._elements.push(element);
        }

        /**
         * @function
         * @name pc.ElementInput#removeElement
         * @description Remove a {@link pc.ElementComponent} from the internal list of ElementComponents that are being checked for input.
         * @param {pc.ElementComponent} element The ElementComponent
         */
        removeElement(element) {
            const idx = this._elements.indexOf(element);
            if (idx !== -1)
                this._elements.splice(idx, 1);
        }

        _handleUp(event) {
            if (pc.Mouse.isPointerLocked())
                return;

            this._calcMouseCoords(event);
            if (targetX === null)
                return;

            this._onElementMouseEvent(event);
        }

        _handleDown(event) {
            if (pc.Mouse.isPointerLocked())
                return;

            this._calcMouseCoords(event);
            if (targetX === null)
                return;

            this._onElementMouseEvent(event);
        }

        _handleMove(event) {
            this._calcMouseCoords(event);
            if (targetX === null)
                return;

            this._onElementMouseEvent(event);

            this._lastX = targetX;
            this._lastY = targetY;
        }

        _handleWheel(event) {
            this._calcMouseCoords(event);
            if (targetX === null)
                return;

            this._onElementMouseEvent(event);
        }

        _handleTouchStart(event) {
            const cameras = this.app.systems.camera.cameras;

            // check cameras from last to front
            // so that elements that are drawn above others
            // receive events first
            for (let i = cameras.length - 1; i >= 0; i--) {
                const camera = cameras[i];

                let done = 0;
                for (var j = 0, len = event.changedTouches.length; j < len; j++) {
                    if (this._touchedElements[event.changedTouches[j].identifier]) {
                        done++;
                        continue;
                    }

                    const coords = this._calcTouchCoords(event.changedTouches[j]);

                    const element = this._getTargetElement(camera, coords.x, coords.y);
                    if (element) {
                        done++;
                        this._touchedElements[event.changedTouches[j].identifier] = element;
                        this._fireEvent(event.type, new ElementTouchEvent(event, element, this));
                    }
                }

                if (done === len) {
                    break;
                }
            }
        }

        _handleTouchEnd(event) {
            const cameras = this.app.systems.camera.cameras;

            // clear clicked entities first then store each clicked entity
            // in _clickedEntities so that we don't fire another click
            // on it in this handler or in the mouseup handler which is
            // fired later
            for (const key in this._clickedEntities) {
                delete this._clickedEntities[key];
            }

            for (let i = 0, len = event.changedTouches.length; i < len; i++) {
                const touch = event.changedTouches[i];
                const element = this._touchedElements[touch.identifier];
                if (! element)
                    continue;

                delete this._touchedElements[touch.identifier];

                this._fireEvent(event.type, new ElementTouchEvent(event, element, this));

                // check if touch was released over previously touch
                // element in order to fire click event
                if (event.touches.length === 0) {
                    const coords = this._calcTouchCoords(touch);

                    for (let c = cameras.length - 1; c >= 0; c--) {
                        const hovered = this._getTargetElement(cameras[c], coords.x, coords.y);
                        if (hovered === element) {

                            if (! this._clickedEntities[element.entity.getGuid()]) {
                                this._fireEvent('click', new ElementTouchEvent(event, element, this));
                                this._clickedEntities[element.entity.getGuid()] = true;
                            }

                        }
                    }
                }
            }
        }

        _handleTouchMove(event) {
            // call preventDefault to avoid issues in Chrome Android:
            // http://wilsonpage.co.uk/touch-events-in-chrome-android/
            event.preventDefault();

            for (let i = 0, len = event.changedTouches.length; i < len; i++) {
                const element = this._touchedElements[event.changedTouches[i].identifier];
                if (element) {
                    this._fireEvent(event.type, new ElementTouchEvent(event, element, this));
                }
            }
        }

        _onElementMouseEvent(event) {
            let element;

            const hovered = this._hoveredElement;
            this._hoveredElement = null;

            const cameras = this.app.systems.camera.cameras;

            // check cameras from last to front
            // so that elements that are drawn above others
            // receive events first
            for (let i = cameras.length - 1; i >= 0; i--) {
                const camera = cameras[i];

                element = this._getTargetElement(camera, targetX, targetY);
                if (element)
                    break;
            }

            // fire mouse event
            if (element) {
                this._fireEvent(event.type, new ElementMouseEvent(event, element, targetX, targetY, this._lastX, this._lastY));

                this._hoveredElement = element;

                if (event.type === pc.EVENT_MOUSEDOWN) {
                    this._pressedElement = element;
                }
            }

            if (hovered !== this._hoveredElement) {

                // mouseleave event
                if (hovered) {
                    this._fireEvent('mouseleave', new ElementMouseEvent(event, hovered, targetX, targetY, this._lastX, this._lastY));
                }

                // mouseenter event
                if (this._hoveredElement) {
                    this._fireEvent('mouseenter', new ElementMouseEvent(event, this._hoveredElement, targetX, targetY, this._lastX, this._lastY));
                }
            }

            if (event.type === pc.EVENT_MOUSEUP && this._pressedElement) {
                // click event
                if (this._pressedElement === this._hoveredElement) {
                    this._pressedElement = null;

                    // fire click event if it hasn't been fired already by the touchup handler
                    if (!this._clickedEntities || !this._clickedEntities[this._hoveredElement.entity.getGuid()]) {
                        this._fireEvent('click', new ElementMouseEvent(event, this._hoveredElement, targetX, targetY, this._lastX, this._lastY));
                    }
                } else {
                    this._pressedElement = null;
                }
            }
        }

        _fireEvent(name, evt) {
            let element = evt.element;
            while (true) {
                element.fire(name, evt);
                if (evt._stopPropagation)
                    break;

                if (! element.entity.parent)
                    break;

                element = element.entity.parent.element;
                if (! element)
                    break;
            }

        }

        _calcMouseCoords({clientX, clientY}) {
            const rect = this._target.getBoundingClientRect();
            const left = Math.floor(rect.left);
            const top = Math.floor(rect.top);

            // mouse is outside of canvas
            if (clientX < left ||
                clientX >= left + this._target.clientWidth ||
                clientY < top ||
                clientY >= top + this._target.clientHeight) {

                targetX = null;
                targetY = null;
            } else {
                // calculate coords and scale them to the graphicsDevice size
                targetX = (clientX - left);
                targetY = (clientY - top);
            }
        }

        _calcTouchCoords(touch) {
            let totalOffsetX = 0;
            let totalOffsetY = 0;
            let target = touch.target;
            while (!(target instanceof HTMLElement)) {
                target = target.parentNode;
            }
            let currentElement = target;

            do {
                totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
                totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
                currentElement = currentElement.offsetParent;
            } while (currentElement);

            // calculate coords and scale them to the graphicsDevice size
            return {
                x: (touch.pageX - totalOffsetX),
                y: (touch.pageY - totalOffsetY)
            };
        }

        _sortElements({screen, drawOrder}, {screen, drawOrder}) {
            if (screen && ! screen)
                return -1;
            if (!screen && screen)
                return 1;
            if (! screen && ! screen)
                return 0;

            if (screen.screen.screenSpace && ! screen.screen.screenSpace)
                return -1;
            if (screen.screen.screenSpace && ! screen.screen.screenSpace)
                return 1;
            return drawOrder - drawOrder;
        }

        _getTargetElement(camera, x, y) {
            let result = null;

            // sort elements
            this._elements.sort(this._sortElements);

            for (let i = 0, len = this._elements.length; i < len; i++) {
                const element = this._elements[i];

                // scale x, y based on the camera's rect

                if (element.screen && element.screen.screen.screenSpace) {
                    // 2D screen
                    if (this._checkElement2d(x, y, element, camera)) {
                        result = element;
                        break;
                    }
                } else {
                    // 3d
                    if (this._checkElement3d(x, y, element, camera)) {
                        result = element;
                        break;
                    }
                }
            }

            return result;
        }

        _checkElement2d(x, y, element, {rect}) {
            const sw = this.app.graphicsDevice.width;
            const sh = this.app.graphicsDevice.height;

            const cameraWidth = rect.z * sw;
            const cameraHeight = rect.w * sh;
            const cameraLeft = rect.x * sw;
            const cameraRight = cameraLeft + cameraWidth;
            // camera bottom (origin is bottom left of window)
            const cameraBottom = (1 - rect.y) * sh;
            const cameraTop = cameraBottom - cameraHeight;

            let _x = x * sw / this._target.clientWidth;
            let _y = y * sh / this._target.clientHeight;

            // check window coords are within camera rect
            if (_x >= cameraLeft && _x <= cameraRight &&
                _y <= cameraBottom && _y >= cameraTop) {

                // limit window coords to camera rect coords
                _x = sw * (_x - cameraLeft) / cameraWidth;
                _y = sh * (_y - cameraTop) / cameraHeight;

                // reverse _y
                _y = sh - _y;

                const screenCorners = element.screenCorners;
                vecA.set(_x, _y, 1);
                vecB.set(_x, _y, -1);

                if (intersectLineQuad(vecA, vecB, screenCorners)) {
                    return true;
                }
            }

            return false;
        }

        _checkElement3d(x, y, element, camera) {
            const sw = this._target.clientWidth;
            const sh = this._target.clientHeight;

            const cameraWidth = camera.rect.z * sw;
            const cameraHeight = camera.rect.w * sh;
            const cameraLeft = camera.rect.x * sw;
            const cameraRight = cameraLeft + cameraWidth;
            // camera bottom - origin is bottom left of window
            const cameraBottom = (1 - camera.rect.y) * sh;
            const cameraTop = cameraBottom - cameraHeight;

            let _x = x;
            let _y = y;

            // check window coords are within camera rect
            if (x >= cameraLeft && x <= cameraRight &&
                y <= cameraBottom && _y >= cameraTop) {

                // limit window coords to camera rect coords
                _x = sw * (_x - cameraLeft) / cameraWidth;
                _y = sh * (_y - (cameraTop)) / cameraHeight;

                // 3D screen
                const worldCorners = element.worldCorners;
                const start = camera.entity.getPosition();
                const end = vecA;
                camera.screenToWorld(_x, _y, camera.farClip, end);

                if (intersectLineQuad(start, end, worldCorners)) {
                    return true;
                }
            }

            return false;
        }

        get app() {
            return this._app || pc.app;
        }

        set app(value) {
            this._app = value;
        }
    }

    return {
        ElementInput,
        ElementInputEvent,
        ElementMouseEvent,
        ElementTouchEvent
    };
})());
