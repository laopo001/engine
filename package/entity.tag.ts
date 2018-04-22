import { Component } from './component';
import { stringToComponent } from './string_component';
import { HpcComponent } from './script_commponent';
import { getApplicationInstance } from './application.tag';
import { KEY } from './config';
export interface EntityProps {
    position?: pc.Vec3;
    // rotation?: [number, number, number, number];
    rotation?: pc.Vec3;
    scale?: pc.Vec3;
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
        entity.name = props.name;
        props.tag && props.tag.split(' ').filter(x => x !== '').forEach((x) => {
            entity.tags.add(x);
        })
        this.props.position && entity.setLocalPosition(this.props.position);
        this.props.rotation && entity.rotateLocal(this.props.rotation);
        this.props.scale && entity.setLocalScale(this.props.scale);

        let children = props.children;

        let renderChildren = [];

        for (let i = 0; i < children.length; i++) {
            let node = children[i];
            if (node == null) {
                continue;
            }
            if (node.type === Entity.basename || node.type.isHpcComponent) {
                renderChildren.push(node);
                continue;
            }
            if (typeof node.type !== 'string') {
                node.type = node.type.basename;
            }
            // if(node.type==='light'){debugger;delete node.props.children}
            // entity.addComponent(node.type, node.props);
            stringToComponent[node.type].addComponent(entity, node);
        }

        if (renderChildren.length > 0) {
            // parent.addChild(entity);
            this.render = () => { return renderChildren; }
        }




        // if (parent) {
        //     parent.pc.addChild(entity);
        // } else {
        //     innerContext.app.root.addChild(entity);
        // }
        parent.addChild(entity);

        this.pc = entity;
        this.pc[KEY] = this;
    }
    render?()
}