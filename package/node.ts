export class Node {
    key;
    constructor(public type, public props, public children) {
        this.props = this.props == null ? {} : this.props;
        this.props.children = children;
    }
}