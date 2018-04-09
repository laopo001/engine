import { run } from './run';
import { Node, HPCNode } from './node';
export function render(root: HPCNode, canvas, options) {
    // var app = new pc.Application(canvas, {
    //     mouse: new pc.Mouse(canvas),
    //     keyboard: new pc.Keyboard(window)
    // });
    // app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    // app.setCanvasResolution(pc.RESOLUTION_AUTO);
    // app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);
    run(root, {
        mouse: new pc.Mouse(canvas),
        keyboard: new pc.Keyboard(window),
        canvas: canvas,
        app: null
    }, {}, null)
};
