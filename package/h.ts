import { Node } from './node';

export function h(type, props?, ...children) {
    const newChildren = [];
    for (let i = 0; i < children.length; i++) {
        let item = children[i];
        if (typeof item === 'boolean') {
            newChildren.push(null);
        } else if (Array.isArray(item)) {
            addChild(newChildren, item);
        } else {
            newChildren.push(item);
        }
    }
    return new Node(type, props, newChildren);
}

function addChild(newChildren, item) {
    var x;
    while (item.length !== 0) {
        x = item.pop()
        if (Array.isArray(x)) {
            addChild(newChildren, x);
        }
        else {
            newChildren.push(x);
        }
    }
}