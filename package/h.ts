import { Node } from './node';

export function h(type, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var newChildren = [];
    var obj = { index: 0 };
    for (var i = 0; i < children.length; i++) {
        var item = children[i];
        if (typeof item === 'boolean') {
            newChildren.push(null);
        }
        else if (Array.isArray(item)) {
            addChild(newChildren, item);
        }
        else {
            newChildren.push(item);
        }
    }
    return new Node(type, props, newChildren);
}
function addChild(newChildren, item) {
    var x;
    while (x = item.pop()) {
        if (Array.isArray(x)) {
            addChild(newChildren, x);
        }
        else {
            newChildren.push(x);
        }
    }
}