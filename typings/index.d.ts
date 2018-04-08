declare const pc: any;

interface Attributes {
    children?: any[];
    name?: string;
    tag?: string;
}

interface ClassAttributes<T> extends Attributes {
    ref?: Ref<T>;
}
// type Validator<T> = { bivarianceHack(object: T, key: string, componentName: string, ...rest: any[]): Error | null }['bivarianceHack'];

// type ValidationMap<T> = {[K in keyof T]?: Validator<T> };

type Ref<T> = { bivarianceHack(instance: T | null): any }['bivarianceHack'];

// declare global {
//     namespace JSX {
//         interface ElementAttributesProperty { props: {}; }
//         interface IntrinsicClassAttributes<T> extends ClassAttributes<T> { }
//     }
// }