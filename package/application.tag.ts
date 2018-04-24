import { Component } from './component';
import { KEY } from './config';
import { Node } from './node';
export interface ApplicationProps {
    gravity?: pc.Vec3;
    ambientLight?: pc.Color;
}
let application;

export const updateQuene = [];

export class Application extends Component<ApplicationProps> {
    static basename = 'application'
    constructor(props, context, innerContext) {
        super(props, context, innerContext);
        innerContext.canvas.focus();
        var app = new pc.Application(innerContext.canvas, {
            mouse: innerContext.mouse,
            keyboard: innerContext.keyboard
        })
        application = app;
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);
        app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);
        app.start();
        app.on('update', function (dt) { updateQuene.forEach((cb) => { cb(dt); }) })
        innerContext.app = app;
        this.props.gravity && app.systems.rigidbody.setGravity(this.props.gravity);
     
        this.pc = app;
        this.pc[KEY] = this;
        // console.log('application init',this);
    }
    render() {
        return this.props.children;
    }
}
export function getApplicationInstance() {
    return application;
};
