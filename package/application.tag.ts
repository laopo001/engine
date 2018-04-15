import { Component } from './component';

export interface ApplicationProps {
    gravity?: [number, number, number];
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
        app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
        app.setCanvasResolution(pc.RESOLUTION_AUTO);
        app.scene.ambientLight = new pc.Color(0.2, 0.2, 0.2);
        app.start();
        app.on('update', function (dt) { updateQuene.forEach((cb) => { cb(dt); }) })
        innerContext.app = app;
        this.props.gravity && app.systems.rigidbody.setGravity(this.props.gravity[0], this.props.gravity[1], this.props.gravity[2]);
        application = app;
        this.pc = app;
        this.pc['__jsxcomponent__'] = this;
        // console.log('application init',this);
    }
    render() {
        return this.props.children;
    }
}
export function getApplicationInstance() {
    return application;
};
