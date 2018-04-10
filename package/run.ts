import { Node, HPCNode } from './node';
import { getAllStringToComponent } from './string_component';

let stringToComponent = getAllStringToComponent();

export function run(node: HPCNode, innerContext, context, parent) {
    if (node instanceof Node) {
        var Ctor = node.type;
        if (typeof Ctor === 'string') {
            Ctor = stringToComponent[Ctor];
        }
        var props = Object.assign({}, Ctor.defaultProps, node.props);
        var c = new Ctor(props, context, innerContext);
        if (props.ref) {
            props.ref(c);
        }
        runChildren(c.getChildren && c.getChildren(), innerContext, context, c);
    }
};
export function runChildren(nodes, innerContext, context, parent) {
    if (nodes == null) { return };
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var c = run(node, innerContext, context, parent);
    }
};

