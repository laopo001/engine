// Shim the Fullscreen API

((() => {

    if (typeof document === 'undefined') {
        // Not running in a browser
        return;
    }

    // Events
    const fullscreenchange = ({target}) => {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent('fullscreenchange', true, false, null);
        target.dispatchEvent(e);
    };

    const fullscreenerror = ({target}) => {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent('fullscreenerror', true, false, null);
        target.dispatchEvent(e);
    };

    document.addEventListener('webkitfullscreenchange', fullscreenchange, false);
    document.addEventListener('mozfullscreenchange', fullscreenchange, false);
    document.addEventListener('MSFullscreenChange', fullscreenchange, false);
    document.addEventListener('webkitfullscreenerror', fullscreenerror, false);
    document.addEventListener('mozfullscreenerror', fullscreenerror, false);
    document.addEventListener('MSFullscreenError', fullscreenerror, false);

    if ((Element as any).prototype.mozRequestFullScreen) {
        // FF requires a new function for some reason
        Element.prototype.requestFullscreen = function () {
            this.mozRequestFullScreen();
        };
    } else {
        Element.prototype.requestFullscreen = Element.prototype.requestFullscreen || Element.prototype.webkitRequestFullscreen || (Element as any).prototype.msRequestFullscreen;
    }

    document.exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || (document as any).mozCancelFullScreen || (document as any).msExitFullscreen;

    if (!document.hasOwnProperty('fullscreenElement')) {
        Object.defineProperty(document, 'fullscreenElement', {
            enumerable: true,
            configurable: false,
            get() {
                return document.webkitCurrentFullScreenElement || document.webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement;
            }
        });
    }

    if (!document.hasOwnProperty('fullscreenEnabled')) {
        Object.defineProperty(document, 'fullscreenEnabled', {
            enumerable: true,
            configurable: false,
            get() {
                return document.webkitFullscreenEnabled || (document as any).mozFullScreenEnabled || (document as any).msFullscreenEnabled;
            }
        });
    }
})());
