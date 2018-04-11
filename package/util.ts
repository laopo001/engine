import {getApplicationInstance} from './application.tag';

export function loadAssetsFromUrl<T>(url: string, type: string) {

    return new Promise<T>(function (resolve, reject) {
        setTimeout(() => {
            getApplicationInstance().assets.loadFromUrl(url, type, function (err, asset) {
                resolve(asset);
            });
        });

    })
}

