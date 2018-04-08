import { Component } from './component';

interface ApplicationProps {
    // name: string;
    // children: any;
    dev?: string;
    xxx: number;
}

export class Application extends Component<ApplicationProps> {
    _pc_inst;
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
        this._pc_inst = app;
    }
    getChildren() {
        return this.props.children;
    }
    getPC() {
        return this.props;
    }
}