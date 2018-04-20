/**
 * @author dadigua
 */
import hpc, {
    loadAssetsFromUrl, ScriptComponent,
    createMaterial, render, randomRange, randomEnum,
    once
} from '../package/index';
import { FirstCamera } from './first_person_camera';
var canvas = document.getElementById("root");
var material2 = createMaterial({
    // ambient: new pc.Color(0.1, 0.4, 0.1),
    diffuse: new pc.Color(0.3, 0.3, 0.3),
});

var material = new pc.StandardMaterial();
material.diffuse = new pc.Color(.3, .9, .3)

export class Scene extends ScriptComponent<any> {
    sence: pc.GraphNode;
    gamer: pc.GraphNode;
    initialize() {
        console.log(this);
        this.sence = this.app.root.findByName('scene');
        this.gamer = this.app.root.findByName('gamer');
        // this.append(this.sence, <entity name='11' scale={[1, 0.5, 1]} position={[0, 8, 0]}>
        //     <model type='box' material={material} {...{ castShadows: true }} />
        //     <rigidbody type='dynamic' restitution={0.5} mass={1} />
        //     <collision type='box' halfExtents={new pc.Vec3(0.5, 0.25, 0.5)} />
        // </entity>)
    }
    direction = 'right';
    add() {
        let r = randomEnum<number>(-1, 1);
        if (r > 0) {
            this.direction = 'right';
        } else {
            this.direction = 'left';
        }
        let { x, z } = this.gamer.getLocalPosition();
        let len = randomRange(2, 8);
        x = x - len;
        z = z + r * len;
        this.append(this.sence, <entity name='11' scale={[randomRange(2, 3.5), 0.5, randomRange(2, 3.5)]} position={[x, 5, z]}>
            <model type='box' material={material} {...{ castShadows: true }} />
            <rigidbody type='dynamic' restitution={0.5} mass={1} />
            <collision type='box' halfExtents={new pc.Vec3(0.5, 0.25, 0.5)} />
        </entity>)

    }
    @once
    collision() {
        this.add();
    }
    render() {
        return <entity name='scene'>
            <entity name='gamer' scale={[0.25, 0.5, 0.25]} position={[0, 10, 0]} {...{ castShadows: true }} >
                <model type='box' material={material} />
                <rigidbody type='dynamic' restitution={0.5} mass={1} linearFactor={new pc.Vec3(0, 1, 0)} />
                <collision type='box' halfExtents={new pc.Vec3(0.125, 0.25, 0.125)} collisionstart={this.collision.bind(this)} />
            </entity>
            <entity name='box' scale={[1, 0.5, 1]} position={[0, 5, 0]}>
                <model type='box' material={material} {...{ castShadows: true }} />
                <rigidbody type='dynamic' restitution={0.5} mass={1} linearFactor={new pc.Vec3(0, 1, 0)} />
                <collision type='box' halfExtents={new pc.Vec3(0.5, 0.25, 0.5)} />
            </entity>
            <entity name='floor' scale={[100, 0.1, 100]}>
                <model type='box' {...{ receiveShadows: true, material: material2 }} />
                <rigidbody type='static' restitution={0.5} />
                <collision type='box' halfExtents={new pc.Vec3(50, 0.05, 50)} />
            </entity>
        </entity >
    }
}

render(<application gravity={[0, -9.8, 0]}  >
    <FirstCamera />
    <Scene />
    <entity {...{ rotation: [0, 0, 10] }}  >
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




