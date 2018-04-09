import { Component } from './component';

interface TransformProps {
    position?: number[];
    rotation?: number[];
    scaling?: number[];
}

export class Entity extends Component<TransformProps> {
    // props: Readonly<ClassAttributes<TransformProps>> & Readonly<TransformProps>;
    _pc_inst;
    constructor(props, context, innerContext) {
        super(props, context, innerContext);
        var entity = new pc.Entity()
        let children = props.children;
        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            entity.addComponent(node.type, node.props);
        }
        innerContext.app.root.addChild(entity);
        this._pc_inst = entity;
    }
}