import { getApplicationInstance } from './application.tag';
import { updateQuene } from './application.tag';

export function loadAssetsFromUrl<T>(url: string, type: string) {

    return new Promise<T>(function (resolve, reject) {
        setTimeout(() => {
            getApplicationInstance().assets.loadFromUrl(url, type, function (err, asset) {
                resolve(asset);
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
