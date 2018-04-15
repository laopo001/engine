import { Component } from './component';
import { stringToComponent } from './string_component';
import { getApplicationInstance } from './application.tag';
export interface EntityProps {
    position?: [number, number, number];
    // rotation?: [number, number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    name?: string;
    tag?: string;
    enable?: boolean;
}

function getPcParent(parent) {
    while (parent) {
        if (parent instanceof Entity) {
            return parent.pc;

        } else {
            parent = parent.parent;
        }
    }
    return getApplicationInstance().root;
}


export class Entity extends Component<EntityProps> {
    static basename = 'entity'
    readonly pc: pc.Entity;
    constructor(props, context, innerContext, parent) {
        super(props, context, innerContext);
        parent = getPcParent(parent)
        var entity = new pc.Entity()
        let children = props.children;

        let renderChildren = [];

        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            if (typeof node.type !== 'string') {
                node.type = node.type.basename;
            }
            // if(node.type==='light'){debugger;delete node.props.children}
            if (node.type === Entity.basename) {
                renderChildren.push(node);
                continue;
            }
            // entity.addComponent(node.type, node.props);
            stringToComponent[node.type].addComponent(entity, node);
        }

        if (renderChildren.length > 0) {
            // parent.addChild(entity);
            this.render = () => { return renderChildren; }
        }

        this.props.position && entity.setLocalPosition.apply(entity, this.props.position);
        this.props.rotation && entity.rotateLocal.apply(entity, this.props.rotation);
        this.props.scale && entity.setLocalScale.apply(entity, this.props.scale);



        // if (parent) {
        //     parent.pc.addChild(entity);
        // } else {
        //     innerContext.app.root.addChild(entity);
        // }
        parent.addChild(entity);

        this.pc = entity;
        this.pc['__jsxcomponent__'] = this;
    }
    render?()
}