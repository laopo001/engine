import { getApplicationInstance } from './application.tag';
import { Component } from './component';
import { HPCNode } from './node';
import { runChildren } from './run';
import { getHpc } from './util';
export interface ScriptComponentProps {
    // children: never;
}



export abstract class HpcComponent<T = any> extends Component<T>{
    constructor(props, context, innerContext) {
        super(props, context, innerContext)
    }
    static isHpcComponent = true;
    next(cb: Function) {

    }
    append(parent: pc.GraphNode, ...children) {

        return runChildren(children, this.innerContext, this.context, getHpc(parent), true)
        // res.forEach((x) => {
        //     parent.addChild(x.pc);
        // })
    }

    _children = [];
    get children() {
        if (this._children.length === 0) {
            return null;
        } else if (this._children.length === 1) {
            return this._children[0];
        } else if (this._children.length > 1) {
            return this._children;
        }
    }
    readonly app: pc.Application = getApplicationInstance();
    initialize() { };
    componentLoaded() { };
    applicationLoaded() { };
    update(dt) { };
    abstract render(): HPCNode;
}