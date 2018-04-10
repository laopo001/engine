import { Component } from '../component';

export interface PcComponentProps {
    enable?: boolean;
    children?: never;
}

export class PcComponent<T> extends Component<T & PcComponentProps> {
    basename: string;
    isPcComponent() {
        return true;
    }
    static addComponent(entity, node, ...keys) {
        let obj = {};
        for (let key in node.props) {
            !keys.includes(key) && (obj[key] = node.props[key]);
        }
        entity.addComponent(node.type, obj);
    }
    static asyncAssetsSet(entity, node, ...keys) {
        keys.forEach((key) => {
            node.props[key] && node.props[key].then((asset) => {
                entity[node.type][key] = asset.resource;
            })
        })
        // props[] && props.colorMap.then((asset) => {
        //     entity.particlesystem.colorMap = asset.resource;
        // })
    }
}