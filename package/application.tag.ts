export class Application {
    _pc_inst;
    constructor(private props, private context, private innerContext) {
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