import { Component, ComponentClass } from './component';
import { CameraProps, PcComponentProps, ModelProps, LightProps, ParticleSystemProps, RigidBodyProps, CollisionProps } from './components';
import { ApplicationProps } from './application.tag';
import { EntityProps, Entity } from './entity.tag';


export class Node<P> {
    constructor(public type, public props: P, public children) {
        this.props = this.props == null ? <P>{} : this.props;
        (<any>this.props).children = children;
    }
}

type TextNode = string | number;
type NodeChild = Node<any> | TextNode;
type NodeFragment = {} | Array<NodeChild | any[] | boolean>;
export type HPCNode = NodeFragment | NodeChild | string | number | boolean | null | undefined;

interface Attributes {
    // name?: string;
    // tag?: string;
}

export type Ref<T> = { bivarianceHack(instance: T | null): any }['bivarianceHack'];

export interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>;
}

interface IElements {
    camera: CameraProps;
    model: ModelProps;
    light: LightProps;
    particlesystem: ParticleSystemProps;
    rigidbody: RigidBodyProps;
    collision: CollisionProps;
}

type pc<T> = {
    [K in keyof T]: PcComponentProps & T[K];
}

declare global {
    namespace JSX {

        interface Element extends Node<any> { }
        interface ElementClass extends Component<any> {
            render?(): HPCNode;
        }
        interface ElementAttributesProperty { props: {} }
        interface ElementChildrenAttribute { children: {}; }
        interface IntrinsicAttributes extends Attributes { }
        interface IntrinsicClassAttributes<T> extends ClassAttributes<T> { }
        interface IntrinsicElements extends pc<IElements> {
            application: ApplicationProps & Readonly<{ children?: HPCNode }>;
            entity: EntityProps & Readonly<{ children?: HPCNode }> & ClassAttributes<Entity>;
        }
    }

}