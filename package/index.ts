import { Application } from './application.tag';
import { Entity } from './entity.tag';
import { loadAssetsFromUrl } from './util';
import { h } from './h';
import { render } from './render';
const hpc = {
    render, h, Application, Entity, loadAssetsFromUrl
}
window['hpc'] = hpc;
export {
    render, h, Application, Entity, loadAssetsFromUrl
};
export default hpc;
export * from './components';