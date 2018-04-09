import { Component, ComponentClass } from './component';
import { CameraProps } from './components';

export class Node<P> {
    constructor(public type, public props: P, public children) {
        this.props = this.props == null ? <P>{} : this.props;
        (<any>this.props).children = children;
    }
}

type ReactText = string | number;
type NodeChild = Node<any> | ReactText;
type NodeFragment = {} | Array<NodeChild | any[] | boolean>;
export type HPCNode = NodeFragment | NodeChild | string | number | boolean | null | undefined;

interface Attributes {
    name?: string;
    tag?: string;
}

export type Ref<T> = { bivarianceHack(instance: T | null): any }['bivarianceHack'];

export interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>;
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
        interface IntrinsicElements {
            camera: CameraProps;
            model: { type: string };
        }
    }

}