import { Component } from './component';

export interface ApplicationProps {

}
let application;

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
        innerContext.app = app;
        application = app;
        this.pc = app;
        super.setJsxComponent();
    }
    getChildren() {
        return this.props.children;
    }
}
export default function getApplicationInstance(){
    return application;
};