/**
 * @author dadigua
 */
import hpc, { loadAssetsFromUrl } from '../package/index';

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

hpc.render(<application >
    <entity name='camera' position={[7.5, 5.5, 6.1]} eulerAngles={[-30, 45, 0]} >
        <camera />
    </entity>
    <entity>
        <model type='box' />
        <light color={new pc.Color(0.3, 0.3, 0.3)} />
    </entity>
    <entity>
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
    </entity>
</application>, canvas, { debugger: true });


