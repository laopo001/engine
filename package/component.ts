import { ClassAttributes, HPCNode } from './node';

export interface Component<P= {}> { }
export class Component<P> {
    props: Readonly<{ children?: HPCNode }> & Readonly<P>;
    pc: any;
    parent: null | Component;
    children: Component[] = [];
    // parent: BABYLON.TransformNode;
    constructor(props, public context: any, public innerContext) {
        this.props = props;
    }
    setJsxComponent() {
        this.pc['__jsxcomponent__'] = this;
    }
    next(cb: Function) {

    }
    getChildren() { }
}

export interface ComponentClass<P extends ClassAttributes<P>= {}> {
    new(props: P, context, innerContext): Component<P>;
    defaultProps?: Partial<P>;
}

