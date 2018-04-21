/**
 * @author dadigua
 */
import hpc, {
    loadAssetsFromUrl, HpcComponent,
    createMaterial, render, randomRange, randomEnum,
    onceTime, once
} from '../package/index';


var material = createMaterial({
    diffuse: new pc.Color(.3, .9, .3)
});

// pc.calculateNormals()

let assets = loadAssetsFromUrl<any>('./assets/models/A/A.json', 'model')
export class LoadingScene extends HpcComponent<any> {

    addChildDid() {
        let a = this.app.root.findByName('A') as pc.Entity;
        assets.then((res) => {
            console.log(res)
            console.log(a.model.model.meshInstances[0].mesh.indexBuffer);
            // a.model.model.meshInstances.forEach((x) => {
            //     x.renderStyle = pc.RENDERSTYLE_POINTS;
            // })
        })

    }
    render() {
        return <entity name='loadingScene'>
            <entity name='A' rotation={new pc.Vec3(90, 0, 0)}>
                <model type='model' {...{ model: assets }} />
            </entity>
            <entity position={new pc.Vec3(0, 3, 5)} rotation={new pc.Vec3(-20, 0, 0)}>
                <camera />
            </entity>
        </entity >
    }
}
