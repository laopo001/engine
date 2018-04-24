import { run } from './run';
import { Node, HPCNode } from './node';
export function render(root: HPCNode, canvas, options) {
    const app = run(root, {
        mouse: new pc.Mouse(canvas),
        keyboard: new pc.Keyboard(window as any),
        canvas: canvas,
        app: null
    }, {}, null)
    console.log('application init');
};

