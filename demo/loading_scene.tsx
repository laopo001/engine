/**
 * @author dadigua
 */
import hpc, {
    loadAssetsFromUrl, HpcComponent,
    createMaterial, render, randomRange, randomEnum,
    onceTime, once, getVertexArr
} from '../package/index';
import { FirstCamera } from './first_person_camera';
import 'whatwg-fetch';
import * as TWEEN from '@tweenjs/tween.js';
var material = createMaterial({
    diffuse: new pc.Color(.3, .9, .3)
});



function formatThreeJsonVertices(json) {
    if (json.data !== undefined) {
        json = json.data;

    }
    if (json.scale !== undefined) {
        json.scale = 1.0 / json.scale;
    } else {
        json.scale = 10.0;
    }
    let scale = json.scale;
    let vertices = json.vertices,
        offset = 0;
    let zLength = vertices.length;
    let positions = [];
    let i = 0;
    while (offset < zLength) {
        let vertex = { x: 0, y: 0, z: 0 };
        vertex.x = vertices[offset++] * scale;
        vertex.y = vertices[offset++] * scale;
        vertex.z = vertices[offset++] * scale;
        i++;
        // if (i % 2 !== 0) { continue; }
        positions.push(vertex);
    }
    return positions;
}
// pc.calculateNormals()

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}

requestAnimationFrame(animate);

// let assets = loadAssetsFromUrl<pc.Asset>('./assets/models/statue/Statue_1.json', 'model')
export class LoadingScene extends HpcComponent<any> {
    loadingScene: pc.Entity;
    vertices: pc.Entity[] = [];
    container: pc.Entity;
    containerTween;
    containerposition = { x: 0, y: 0, z: 0 };
    tweenArr: any[] = [];
    positions = [];
    async componentLoaded() {
        this.loadingScene = this.app.root.findByName('loadingScene') as pc.Entity;

        let modelVertices = await fetch('./assets/models/cpac5.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices2 = await fetch('./assets/models/cpbook2.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices3 = await fetch('./assets/models/cpgame3.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices4 = await fetch('./assets/models/cpkv3.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices5 = await fetch('./assets/models/cpmovie4.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices6 = await fetch('./assets/models/qr.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))

        let arr = [modelVertices4, modelVertices, modelVertices3, modelVertices6]
        let maxCount = Math.max(...arr.map(x => x.length))
        console.log('maxCount', maxCount)
        this.generate(maxCount);
        this.container = this.app.root.findByName('container') as pc.Entity;
        this.containerTween = new TWEEN.Tween(this.containerposition).easing(TWEEN.Easing.Exponential.InOut)
        let index = 0;
        setInterval(() => {
            console.log(index % 3);
            let duration = 2000;
            this.transform(arr[index % 3], duration);
            // let target = new pc.Vec3(randomRange(-10, 10), randomRange(-10, 10), randomRange(-10, 10));
            // this.containerTween.to({ x: target.x, y: target.y, z: target.z }, Math.random() * duration + duration).start()
            index++;
        }, 4000)

    }
    generate(maxCount) {
        let temp = [];
        for (let i = 0; i < maxCount; i++) {
            let position = new pc.Vec3(randomRange(-10, 10), randomRange(-10, 10), randomRange(-10, 10))
            this.positions.push(position);
            temp.push(<entity position={position} scale={new pc.Vec3(.1, .1, .1)}  >
                <model type='sphere' material={material} isStatic />
            </entity>)
            this.tweenArr.push(
                new TWEEN.Tween(position).easing(TWEEN.Easing.Exponential.InOut)
            )
        }

        let res = this.append(this.loadingScene, <entity name='container' scale={new pc.Vec3(1, 1, 1)}>{temp}</entity>)[0].pc.children;
        this.vertices = res;
    }
    transform(targets, duration) {
        TWEEN.removeAll();
        for (let i = 0; i < this.vertices.length; i++) {
            var object = this.vertices[i];

            var target = targets[i];
            if (!target) {
                object.enabled = false;
                this.move(new pc.Vec3(0, 0, 0), object, duration, i);
            } else {
                object.enabled = true;
                this.move(target, object, duration, i);
            }
            // object.setLocalPosition(target.x, target.y, target.z)
        }
    }
    move(target, object, duration, index) {

        this.tweenArr[index].to({ x: target.x, y: target.y, z: target.z }, Math.random() * duration + duration)
            // .onUpdate(function (position) { // Called after tween.js updates 'coords'.
            //     // Move 'box' to the position described by 'coords' with a CSS translation.
            //     // console.log(arguments)
            //     object.setLocalPosition(position.x, position.y, position.z)
            // })
            .start();
    }
    update() {
        for (let i = 0; i < this.vertices.length; i++) {
            var object = this.vertices[i];
            var position = this.positions[i];
            object.setLocalPosition(position.x, position.y, position.z)
            // object.setLocalPosition(target.x, target.y, target.z)
        }
        this.container && this.container.setLocalPosition(this.containerposition.x, this.containerposition.y, this.containerposition.z)
    }
    render() {
        return <entity name='loadingScene'>
            {/* <entity name='A'  >
                <model type='box' />
            </entity> */}
            <entity name='camera' position={new pc.Vec3(0, 0, 100)} rotation={new pc.Vec3(0, 0, 0)}>
                <camera />
            </entity>
            {/* <FirstCamera /> */}
        </entity >
    }
}
