import { Node, HPCNode } from './node';
import { getAllStringToComponent } from './string_component';


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
        cb && cb(c);
        if (Ctor.isScriptComponent) {
            if (props.ref) {
                props.ref(c);
            }
            let res = c.render()
            if (Array.isArray(res)) { console.error('ScriptComponent must return a entity'); return; }
            // res.props = (x) => {
            //     // c.ref.entity = x;
            //     c.entity = x;
            //     c.entity.addComponent('script');

            // }
            run(res, innerContext, context, parent, function (x) {
                c.entity = x.pc;
                // console.log(Ctor.name)
                var script = pc.createScript(Ctor.name.toString() + i);

                (script.prototype as any).initialize = function () {
                    c.init();
                };
                (script.prototype as any).update = function (dt) {
                    c.update(dt);
                };


                c.entity.addComponent('script');
                c.entity.script.create(Ctor.name.toString() + i);
                i++;
            });
        } else {
            // c.parent = parent;
            runChildren(c.render && c.render(), innerContext, context, Ctor.basename === 'entity' ? c : undefined);
        }

    }
};
export function runChildren(nodes, innerContext, context, parent) {
    if (nodes == null) { return };
    for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var c = run(node, innerContext, context, parent);
    }
};

