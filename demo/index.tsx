/**
 * @author dadigua
 */
import hpc, {
    loadAssetsFromUrl, ScriptComponent,
    createMaterial, render, randomRange, randomEnum,
    onceTime, once
} from '../package/index';
import { FirstCamera } from './first_person_camera';
var canvas = document.getElementById("root");
var material2 = createMaterial({
    // ambient: new pc.Color(0.1, 0.4, 0.1),
    diffuse: new pc.Color(0.3, 0.3, 0.3),
});
var material = createMaterial({
    diffuse: new pc.Color(.3, .9, .3)
});

export class Scene extends ScriptComponent<any> {
    sence: pc.GraphNode;
    gamer: pc.Entity;
    currBox: pc.Entity;
    state = '';
    addChildDid() {
        console.log(this);
        this.sence = this.app.root.findByName('scene');
        this.gamer = this.app.root.findByName('gamer') as pc.Entity;


        let level = 0;
        let timer;
        let oldScale;
        const down = () => {
            if (this.state !== 'start') { return; }
            console.log('down');
            oldScale = this.currBox.getLocalScale();
            timer = setInterval(() => {
                let { x, y, z } = this.currBox.getLocalScale();
                y = y - 0.01;
                if (y >= 0.25) {
                    const vec3 = new pc.Vec3(x, y, z);
                    this.currBox.setLocalScale(vec3);
                    this.currBox.collision.halfExtents = vec3.clone().mul(new pc.Vec3(0.5, 0.5, 0.5))
                    level++;
                } else {
                    clearInterval(timer);
                }
            }, 100);
        }
        const up = () => {
            console.log('up', level);
            if (timer) {
                clearInterval(timer);
                this.gamer.rigidbody.linearFactor = new pc.Vec3(1, 1, 1);
                if (this.direction === 'right') {
                    this.gamer.rigidbody.applyImpulse(level * -1, level, 0);
                } else {
                    this.gamer.rigidbody.applyImpulse(0, level, level * -1);
                }

                // this.gamer.collision.inst.setLinearVelocity(new BABYLON.Vector3(-1 * level / 2, level, (this.direction === 'right' ? 1 : -1) * level / 2));
                this.currBox.setLocalScale(oldScale);
                level = 0;
            }
            timer = null;
        }
        window.addEventListener('mousedown', down);
        window.addEventListener('mouseup', up);
    }
    direction = 'right';
    add() {
        const material = createMaterial({
            diffuse: new pc.Color(Math.random(), Math.random(), Math.random())
        });
        let r = randomEnum<number>(-1, 1);
        let { x, z } = this.gamer.getLocalPosition();
        let len = randomRange(2, 4);

        if (r > 0) {
            this.direction = 'right';
            x = x - len;
        } else {
            this.direction = 'left';
            z = z + r * len;
        }
        console.log(this.direction)
        let scaleVec3 = new pc.Vec3(randomRange(1, 3), 0.5, randomRange(1, 3));
        this.append(this.sence, <entity tag='box' scale={scaleVec3} position={new pc.Vec3(x, 3, z)}>
            <model type='box' material={material} {...{ castShadows: true }} />
            <rigidbody type='dynamic' restitution={0.5} mass={1} angularFactor={new pc.Vec3(0, 0, 0)} linearFactor={new pc.Vec3(0, 1, 0)} />
            <collision type='box' halfExtents={scaleVec3.clone().mul(new pc.Vec3(0.5, 0.5, 0.5))} />
        </entity>)

    }
    @onceTime(500)
    collision(result: pc.ContactResult, self: pc.Entity) {
        if (this.currBox === result.other || !result.other.tags.has('box')) { return; }
        this.add();
        this.state = 'start';
        this.currBox = result.other;
        // this.gamer.rigidbody.linearFactor = new pc.Vec3(0, 0, 0);
        this.gamer.rigidbody.linearVelocity = this.gamer.rigidbody.linearVelocity.mul(new pc.Vec3(0, 0, 0));
    }
    render() {
        return <entity name='scene'>
            <entity name='gamer' scale={new pc.Vec3(0.25, 0.5, 0.25)} position={new pc.Vec3(0, 10, 0)} {...{ castShadows: true }} >
                <model type='box' material={material} />
                <rigidbody type='dynamic' restitution={0.5} mass={1} angularFactor={new pc.Vec3(0, 0, 0)} linearFactor={new pc.Vec3(0, 1, 0)} />
                <collision type='box' halfExtents={new pc.Vec3(0.125, 0.25, 0.125)} collisionstart={this.collision.bind(this)} />
            </entity>
            <entity tag='box' scale={new pc.Vec3(1, 0.5, 1)} position={new pc.Vec3(0, 5, 0)}>
                <model type='box' material={material} {...{ castShadows: true }} />
                <rigidbody type='dynamic' restitution={0.5} mass={1} angularFactor={new pc.Vec3(0, 0, 0)} linearFactor={new pc.Vec3(0, 1, 0)} />
                <collision type='box' halfExtents={new pc.Vec3(0.5, 0.25, 0.5)} />
            </entity>
            <entity name='floor' scale={new pc.Vec3(100, 0.1, 100)}>
                <model type='box' {...{ receiveShadows: true, material: material2 }} />
                <rigidbody type='static' restitution={0.5} />
                <collision type='box' halfExtents={new pc.Vec3(50, 0.05, 50)} />
            </entity>
        </entity >
    }
}

render(<application gravity={new pc.Vec3(0, -9.8, 0)}  >
    <FirstCamera />
    <Scene />
    <entity {...{ rotation: new pc.Vec3(0, 0, 10) }}  >
        <light {...{
            type: "directional",
            color: new pc.Color(1, 1, 1),
            castShadows: true,
            intensity: 1,
            shadowBias: 0.2,
            normalOffsetBias: 0.2,
            shadowResolution: 1024,
            shadowDistance: 16,
            shadowType: pc.SHADOW_PCF3
        }} />
    </entity>
</application>, canvas, { debugger: true });
