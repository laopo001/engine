import { PcComponent } from '../pc.component';

interface IModelProps {
    type: string;
    asset: pc.Asset | number;
    castShadows: boolean;
    receiveShadows: boolean;
    materialAsset: number;
    model: Promise<pc.Asset>;
    mapping: {};
    castShadowsLightmap: boolean;
    lightmapped: boolean;
    lightmapSizeMultiplier: number;
    isStatic: boolean;
    meshInstances: pc.MeshInstance[];
    batchGroupId: number;
    layers: number[];
}
export type ModelProps = Partial<IModelProps>

export class Model extends PcComponent<ModelProps> {
    static basename = 'model'
    static addComponent(entity, node) {
        super.addComponent(entity, node)
        // props.model && props.model.then((asset) => {
        //     entity.model.model = asset.resource;
        // })
        super.asyncAssetsSet(entity, node, 'model')
        // console.log(1)
    }
}