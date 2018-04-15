import { PcComponent } from '../pc.component';

export interface IModelProps {
    type: string;
    asset: pc.Asset | number;
    castShadows: boolean;
    receiveShadows: boolean;
    materialAsset: number;
    model: Promise<pc.Asset> | pc.Asset;
    mapping: {};
    castShadowsLightmap: boolean;
    lightmapped: boolean;
    lightmapSizeMultiplier: number;
    isStatic: boolean;
    meshInstances: pc.MeshInstance[];
    batchGroupId: number;
    layers: number[];
    material: Promise<pc.Material> | pc.Material;
}
export type ModelProps = Partial<IModelProps>

export class Model extends PcComponent<ModelProps> {

    static addComponent(entity: pc.Entity, node) {
        super.addComponent(entity, node)
        super.asyncAssetsSet(entity, node, 'model');

        if (node.props.material) {
            if (node.props.material instanceof Promise) {
                node.props.material.then((res) => {
                    entity.model.model.meshInstances.forEach(function (mesh) {
                        mesh.material = res;
                    });
                })
            } else {
                node.props.material && entity.model.model.meshInstances.forEach(function (mesh) {
                    mesh.material = node.props.material;
                });
            }
        }
    }
}

