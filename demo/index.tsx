/**
 * @author dadigua
 */
import hpc, { loadAssetsFromUrl, ScriptComponent, createMaterial } from '../package/index';
import { FirstCamera } from './first_person_camera';
var canvas = document.getElementById("root");
var material2 = createMaterial({
    // ambient: new pc.Color(0.1, 0.4, 0.1),
    diffuse: new pc.Color(0.3, 0.3, 0.3),
});

var material = new pc.StandardMaterial();
material.diffuse = new pc.Color(.3, .3, .3)

export class Scene extends ScriptComponent<any> {
    init() {
        window['node'] = this;
        // console.log(this);
    }
    update() {

    }
    render() {
        return <entity name='scene'>
            <entity name='gamer' scale={[0.25, 0.5, 0.25]} position={[0, 10, 0]} {...{ castShadows: true }} >
                <model type='box' material={material} />
                <rigidbody type='dynamic' restitution={0.5} mass={1} />
                <collision type='box' halfExtents={new pc.Vec3(0.125, 0.25, 0.125)} collisionstart={(x, self) => {
                    console.log(x, self, this);
                }} />
            </entity>
            <entity name='box' scale={[1, 0.5, 1]} position={[0, 5, 0]}>
                <model type='box' material={material} {...{ castShadows: true }} />
                <rigidbody type='dynamic' restitution={0.5} mass={1} />
                <collision type='box' halfExtents={new pc.Vec3(0.5, 0.25, 0.5)} />
            </entity>
            <entity name='floor' scale={[100, 0.1, 100]}>
                <model type='box' {...{ receiveShadows: true, material: material2 }} />
                <rigidbody type='static' restitution={0.5} linearFactor={new pc.Vec3(0, 1, 0)} />
                <collision type='box' halfExtents={new pc.Vec3(5, 0.05, 5)} />
            </entity>
        </entity >
    }
}

hpc.render(<application gravity={[0, -9.8, 0]}  >
    <FirstCamera />
    <Scene />
    <entity {...{ rotation: [0, 0, 45] }}  >
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




