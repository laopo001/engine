import { getApplicationInstance } from './application.tag';
import { Component } from './component';
import { HPCNode } from './node';
import { runChildren } from './run';

export interface ScriptComponentProps {
    children: never;
}



export abstract class ScriptComponent<T = any> extends Component<T>{
    constructor(props, context, innerContext) {
        super(props, context, innerContext)
    }
    static isScriptComponent = true;
    next(cb: Function) {

    }
    append(parent: pc.GraphNode, ...children) {
        let res = runChildren(children, this.innerContext, this.context, parent)
        // res.forEach((x) => {
        //     parent.addChild(x.pc);
        // })
    }

    children = [];
    readonly app: pc.Application = getApplicationInstance();
    initialize() { };
    update(dt) { };
    abstract render(): HPCNode;
}