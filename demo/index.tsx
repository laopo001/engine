/**
 * @author dadigua
 */
import hpc, { loadAssetsFromUrl, ScriptComponent } from '../package/index';
import { FirstCamera } from './first_person_camera';
var canvas = document.getElementById("root");

// set up random downwards velocity from -0.4 to -0.7
var velocityCurve = new pc.CurveSet([
    [0, 0],     // x
    [0, -0.7],  // y
    [0, 0]      // z
]);
var velocityCurve2 = new pc.CurveSet([
    [0, 0],   // x
    [0, -0.4],// y
    [0, 0]    // z
]);

// set up random rotation speed from -100 to 100 degrees per second
var rotCurve = new pc.Curve([0, 100]);
var rotCurve2 = new pc.Curve([0, -100]);

// scale is constant at 0.1
var scaleCurve = new pc.Curve([0, 0.1]);


export class Scene extends ScriptComponent<any> {
    init() {
        window['node'] = this;
        console.log(this);
    }
    render() {
        return <entity>
            <entity >
                <model type='box' />
                <light color={new pc.Color(0.3, 0.3, 0.3)} />
                <rigidbody type='dynamic' restitution={0.5} mass={1} />
                <collision type='box' halfExtents={new pc.Vec3(0.5, 0.5, 0.5)} />
            </entity>
            <entity name='floor' position={[0, -5, 0]} scale={[10, 1, 10]}>
                <model type='box' />
                <rigidbody type='static' restitution={0.5} />
                <collision type='box' halfExtents={new pc.Vec3(5, 0.5, 5)} />
            </entity>
        </entity>
    }
}

hpc.render(<application gravity={[0, -9.8, 0]}>
    <FirstCamera />
    <Scene />
</application>, canvas, { debugger: true });

{/* <entity>
<particlesystem {...{
    numParticles: 100,
    lifetime: 10,
    rate: 0.1,
    startAngle: 360,
    startAngle2: -360,
    emitterExtents: new pc.Vec3(5, 0, 0),
    velocityGraph: velocityCurve,
    velocityGraph2: velocityCurve2,
    scaleGraph: scaleCurve,
    rotationSpeedGraph: rotCurve,
    rotationSpeedGraph2: rotCurve2,
    colorMap: loadAssetsFromUrl('/assets/snowflake.png', 'texture')
}} />
</entity> */}


