import { getApplicationInstance } from './application.tag';
import { Component } from './component';
import { HPCNode } from './node';

export abstract class ScriptComponent<T=any> extends Component<T>{
    constructor(props, context, innerContext) {
        super(props, context, innerContext)
    }
    static isScriptComponent = true;
    readonly entity: pc.Entity;
    next(cb: Function) {

    }
    readonly app: pc.Application = getApplicationInstance();
    init() { };
    update(dt) { };
    abstract render():HPCNode;
}