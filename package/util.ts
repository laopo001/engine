import { getApplicationInstance } from './application.tag';
import { updateQuene } from './application.tag';
import { KEY } from './config';

export function loadAssetsFromUrl<T>(url: string, type: string) {
    return new Promise<T>(function (resolve, reject) {
        setTimeout(() => {
            getApplicationInstance().assets.loadFromUrl(url, type, function (err, asset) {
                if (err) {
                    reject(err);
                } else {
                    resolve(asset);
                }

            });
        });

    })
}

export function createMaterial(colors) {
    var material = new pc.StandardMaterial();
    for (var param in colors) {
        material[param] = colors[param];
    }
    material.update();
    return material;
}

export function addUpdateListen(cb) {
    updateQuene.push(cb);
}

export function randomRange(a, b): number {
    let min = a, max = b;
    if (a > b) {
        max = a; min = b;
    }
    let subtraction = max - min;
    return min + subtraction * Math.random();
}

export function randomEnum<T = any>(...arg): T {
    let len = arg.length;
    let random = Math.random() * len;
    for (let i = 0; i < len; i++) {
        if (random >= i && random < i + 1) {
            return arg[i];
        }
    }
}
export function once(target, key, descriptor) {
    let oldValue = descriptor.value;
    let cout = 0;
    let newValue = function (...args) {
        let res;
        if (cout === 0) {
            res = oldValue.apply(this, args)
        }
        cout++;
        return res;
    }
    descriptor.value = newValue;
}

export function onceTime(time) {
    return function (target, key, descriptor) {
        let oldValue = descriptor.value;
        let cout = 0;
        let newValue = function (...args) {
            let res;
            if (cout === 0) {
                res = oldValue.apply(this, args)
            }
            setTimeout(function () { cout = 0; }, time)
            cout++;
            return res;
        }
        descriptor.value = newValue;

    }
}

export function getVertexArr(mesh: pc.Mesh) {
    let buffer = mesh.vertexBuffer;
    let iterator = new pc.VertexIterator(buffer);
    let arr = [];
    // Iterate though all verticles 
    for (let i = 0; i < buffer.getNumVertices(); i++) {
        // Current vertex's position
        var posSem = iterator.element[pc.SEMANTIC_POSITION];

        // Get position
        var posX = posSem.array[posSem.index];
        var posY = posSem.array[posSem.index + 1];
        var posZ = posSem.array[posSem.index + 2];
        arr.push({ x: posX, y: posY, z: posZ });
        // Move to the next vertex
        iterator.next();
    }

    iterator.end();
    return arr;
}

export function getHpc(pc) {
    return pc[KEY];
}