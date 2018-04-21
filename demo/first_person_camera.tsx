import hpc, { loadAssetsFromUrl, HpcComponent } from '../package/index';

export class FirstCamera extends HpcComponent<{ speed?: number }> {
    static defaultProps = {
        speed: 10
    }
    ex;
    ey;
    entity: pc.GraphNode
    addChildDid() {
        this.entity = this.app.root.findByName('camera');
        // Camera euler angle rotation around x and y axes
        var eulers = this.entity.getLocalEulerAngles()
        this.ex = eulers.x;
        this.ey = eulers.y;
        // Disabling the context menu stops the browser displaying a menu when
        // you right-click the page
        var mouse = this.app.mouse;
        mouse.disableContextMenu();
        mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this);
        mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    }
    update(dt) {
        this.entity.setLocalEulerAngles(this.ex, this.ey, 0);
        // Update the camera's position
        var keyboard = this.app.keyboard;
        var forwards = keyboard.isPressed(pc.KEY_UP) || keyboard.isPressed(pc.KEY_W);
        var backwards = keyboard.isPressed(pc.KEY_DOWN) || keyboard.isPressed(pc.KEY_S);
        var left = keyboard.isPressed(pc.KEY_LEFT) || keyboard.isPressed(pc.KEY_A);
        var right = keyboard.isPressed(pc.KEY_RIGHT) || keyboard.isPressed(pc.KEY_D);

        if (forwards) {
            this.entity.translateLocal(0, 0, -this.props.speed * dt);
        } else if (backwards) {
            this.entity.translateLocal(0, 0, this.props.speed * dt);
        }

        if (left) {
            this.entity.translateLocal(-this.props.speed * dt, 0, 0);
        } else if (right) {
            this.entity.translateLocal(this.props.speed * dt, 0, 0);
        }
    }

    onMouseMove(event) {
        if (pc.Mouse.isPointerLocked()) {
            this.ex -= event.dy / 5;
            this.ex = pc.math.clamp(this.ex, -90, 90);
            this.ey -= event.dx / 5;
        }
    }
    onMouseDown() {
        if (!pc.Mouse.isPointerLocked()) {
            this.app.mouse.enablePointerLock();
        }
    }
    render() {
        return <entity name='camera' position={new pc.Vec3(5, 5, 5)} rotation={new pc.Vec3(-30, 45, 0)} >
            <camera />
        </entity>
    }
}