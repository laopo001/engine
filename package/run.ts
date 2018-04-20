import { Node, HPCNode } from './node';
import { getAllStringToComponent } from './string_component';
import { updateQuene } from './application.tag';
import { ScriptComponent } from './script_commponent';

let stringToComponent = getAllStringToComponent();

let i = 0;

export function run(node: HPCNode, innerContext, context, parent, cb?) {
    if (node instanceof Node) {
        var Ctor = node.type;
        if (typeof Ctor === 'string') {
            Ctor = stringToComponent[Ctor];
        }
        var props = Object.assign({}, Ctor.defaultProps, node.props);
        var c;
        c = new Ctor(props, context, innerContext, parent);
        props.ref && props.ref(c);
        let children;
        if (c instanceof ScriptComponent) {
            c.initialize()
            if (props.ref) {
                props.ref(c);
            }
            let node = c.render();
            if (Array.isArray(node)) {
                children = runChildren(node, innerContext, context, parent);
            } else {
                children = runChildren([node], innerContext, context, parent);
            }
            c.children = children;
            c.addChildDid();
            updateQuene.push(c.update.bind(c))
        } else {
            children = runChildren(c.render && c.render(), innerContext, context, c);
            c.children = children;
        }

        return c;
    } else {
        console.error('e');
    }
};
export function runChildren(nodes, innerContext, context, parent) {
    if (nodes == null) { return };
    const arr = []
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var c = run(node, innerContext, context, parent);
        c.parent = parent;
        arr.push(c);
    }
    return arr;
};

export function addScriptComponent(entity, name, init, update) {

    var script = pc.createScript(name);

    (script.prototype as any).initialize = function () {
        init();
    };
    (script.prototype as any).update = function (dt) {
        update(dt);
    };
    entity.addComponent('script');
    entity.script.create(name);
}