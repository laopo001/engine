import { Component } from './component';
import { stringToComponent } from './string_component';
export interface EntityProps {
    position?: [number, number, number];
    rotation?: [number, number, number, number];
    eulerAngles?: [number, number, number];
    scale?: [number, number, number];
    name?: string;
    tag?: string;
}

export class Entity extends Component<EntityProps> {
    static basename = 'entity'
    // props: Readonly<ClassAttributes<TransformProps>> & Readonly<TransformProps>;
    _pc_inst;
    constructor(props, context, innerContext) {
        super(props, context, innerContext);
        var entity = new pc.Entity()
        let children = props.children;
        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            if (typeof node.type !== 'string') {
                node.type = node.type.basename;
            }
            // entity.addComponent(node.type, node.props);
            stringToComponent[node.type].addComponent(entity, node);
        }
        innerContext.app.root.addChild(entity);
        this.props.position && entity.setLocalPosition.apply(entity, this.props.position);
        this.props.eulerAngles && entity.setLocalEulerAngles.apply(entity, this.props.eulerAngles);
        this.props.scale && entity.setLocalScale.apply(entity, this.props.scale);
        this._pc_inst = entity;
    }
}