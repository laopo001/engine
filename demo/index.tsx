/**
 * @author dadigua
 */
import hpc, {
    loadAssetsFromUrl, HpcComponent,
    createMaterial, render, randomRange, randomEnum,
    onceTime, once
} from '../package/index';
import { FirstCamera } from './first_person_camera';
import { Scene } from './sence';
import { LoadingScene } from './loading_scene';
var canvas = document.getElementById("root");



class App extends HpcComponent {
    render() {
        return <application gravity={new pc.Vec3(0, -9.8, 0)}  >
            <LoadingScene />
            {/* <Scene /> */}
            {/* <FirstCamera /> */}
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
        </application>
    }
}

render(<App />, canvas, { debugger: true });
