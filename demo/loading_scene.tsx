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
        if (i % 2 !== 0) { continue; }
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
    vertices: pc.Entity[];
    tweenArr: any[] = [];
    async componentLoaded() {
        this.loadingScene = this.app.root.findByName('loadingScene') as pc.Entity;

        let modelVertices = await fetch('./assets/models/cpac5.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices2 = await fetch('./assets/models/cpbook2.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices3 = await fetch('./assets/models/cpgame3.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices4 = await fetch('./assets/models/cpkv3.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices5 = await fetch('./assets/models/cpmovie4.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))
        let modelVertices6 = await fetch('./assets/models/qr.json').then(rssponse => rssponse.json()).then((res) => formatThreeJsonVertices(res))

        // let maxCount = Math.max(modelVertices.length, modelVertices2.length, modelVertices3.length, modelVertices4.length, modelVertices5.length, modelVertices6.length)

        // let a = this.app.root.findByName('A') as pc.Entity;
        // let { x, y, z } = a.getLocalPosition();
        // let position = { x, y, z };
        // // a.setLocalPosition(new pc.Vec3(0, 1, 0));
        // new TWEEN.Tween(position)
        // .to({ x: 10, y: 10, z: 10 }, 2000)
        // .easing(TWEEN.Easing.Exponential.InOut)
        // .onUpdate(function () { // Called after tween.js updates 'coords'.
        //     // Move 'box' to the position described by 'coords' with a CSS translation.
        //     a.setLocalPosition(position.x, position.y, position.z)
        // })
        // .start();
        let arr = [modelVertices, modelVertices3, modelVertices6]
        let maxCount = Math.max(...arr.map(x => x.length))
        // console.log(modelVertices);
        this.generate(maxCount);

        let index = 0;
        setInterval(() => {

            console.log(index % 3)
            this.transform(arr[index % 3], 2000)
            index++;
        }, 5000)

        /*
            assets.then((res) => {

            // let vertexArr = getVertexArr((res.resource as pc.Model).meshInstances[0].mesh);
            // console.log(vertexArr);
            // console.log(new pc.VertexIterator(a.model.model.meshInstances[0].mesh.vertexBuffer));
            // a.model.model.meshInstances.forEach((x) => {
            //     x.renderStyle = pc.RENDERSTYLE_POINTS;
            // })
            const nodes = (res.resource as pc.Model).meshInstances.map((meshInstances) => {
                return getVertexArr(meshInstances.mesh).map((elem, index) => {
                    if (index % 2 === 0) { return };
                    return <entity position={new pc.Vec3(elem.x, elem.y, elem.z)} scale={new pc.Vec3(5, 5, 5)}  >
                        <model type='sphere' material={material} />
                    </entity>
                });
            })
            // const nodes = vertexArr.map((elem) => {
            //     return <entity position={new pc.Vec3(elem.x, elem.y, elem.z)} scale={new pc.Vec3(5, 5, 5)}  >
            //         <model type='sphere' material={material} />
            //     </entity>
            // })
            this.append(this.loadingScene, <entity scale={new pc.Vec3(.01, .01, .01)}>{nodes}</entity>)
            // a.enabled = false;
        })
         */
    }
    generate(maxCount) {
        let temp = [];
        for (let i = 0; i < maxCount; i++) {
            let position = new pc.Vec3(randomRange(-10, 10), randomRange(-10, 10), randomRange(-10, 10))
            temp.push(<entity position={position} scale={new pc.Vec3(.1, .1, .1)}  >
                <model type='sphere' material={material} />
            </entity>)
            this.tweenArr.push(
                new TWEEN.Tween(position).easing(TWEEN.Easing.Exponential.InOut)

            )
        }

        let res = this.append(this.loadingScene, <entity scale={new pc.Vec3(1, 1, 1)}>{temp}</entity>)[0].pc.children;
        this.vertices = res;
    }
    transform(targets, duration) {
        TWEEN.removeAll();
        for (let i = 0; i < this.vertices.length; i++) {
            var object = this.vertices[i];
            object.enabled = true;
            var target = targets[i];
            if (!target) {
                object.enabled = false; continue;
            }
            // object.setLocalPosition(target.x, target.y, target.z)
            this.move(target, object, duration, i);

        }
    }
    move(target, object, duration, index) {
        // let { x, y, z } = object.getLocalPosition();
        // let position = { x, y, z };
        this.tweenArr[index].to({ x: target.x, y: target.y, z: target.z }, Math.random() * duration + duration)
            .onUpdate(function (position) { // Called after tween.js updates 'coords'.
                // Move 'box' to the position described by 'coords' with a CSS translation.
                // console.log(arguments)
                object.setLocalPosition(position.x, position.y, position.z)
            })
            .start();
        // let t = new TWEEN.Tween(position)
        //     .to({ x: target.x, y: target.y, z: target.z }, Math.random() * duration + duration)
        //     .easing(TWEEN.Easing.Exponential.InOut)
        //     .onUpdate(function () { // Called after tween.js updates 'coords'.
        //         // Move 'box' to the position described by 'coords' with a CSS translation.
        //         object.setLocalPosition(position.x, position.y, position.z)
        //     })
        //     .start();0
    }
    render() {
        return <entity name='loadingScene'>
            {/* <entity name='A'  >
                <model type='box' />
            </entity> */}
            <entity name='camera' position={new pc.Vec3(0, 0, 50)} rotation={new pc.Vec3(0, 0, 0)}>
                <camera />
            </entity>
            {/* <FirstCamera /> */}
        </entity >
    }
}
