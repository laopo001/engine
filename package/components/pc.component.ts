import { Component } from '../component';

export interface PcComponentProps {
    enable?: boolean;
    children?: never;
}

export class PcComponent<T> extends Component<T & PcComponentProps> {
    pc;
    isPcComponent() {
        return true;
    }
    static addComponent(entity: pc.Entity, node, ...keys) {
        keys.push('children');
        let obj = {};
        for (let key in node.props) {
            !keys.includes(key) && (obj[key] = node.props[key]);
        }
        return entity.addComponent(node.type, obj);
    }
    static asyncAssetsSet(entity, node, ...keys) {
        keys.forEach((key) => {
            let res = node.props[key];
            if (res) {
                if (res instanceof Promise) {
                    res.then((asset) => {
                        entity[node.type][key] = asset.resource;
                    })
                } else {
                    entity[node.type][key] = res.resource;
                }
            }
        })
        // props[] && props.colorMap.then((asset) => {
        //     entity.particlesystem.colorMap = asset.resource;
        // })
    }
    static get basename() {
        return this.name.toLowerCase();
    }
}