
export class Component<P= any> {
    props: Readonly<ClassAttributes<P>> & Readonly<P>;
    type = 'Component';
    name: string;
    inst: any;
    parent: null | Component;
    children: Component[] = [];
    // parent: BABYLON.TransformNode;
    constructor(props, public context: any, public innerContext) {
        this.name = props.name;
        this.props = props;
        this.inst['__component__'] = this;
    }
    next(cb: Function) {

    }
    getChildren() { }
}

export interface ComponentClass<P extends ClassAttributes<P>= {}> {
    new(props: P, context, innerContext): Component<P>;
    defaultProps?: Partial<P>;
}

