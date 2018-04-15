import { Application } from './application.tag';
import { ScriptComponent } from './script_commponent';
import { Entity } from './entity.tag';
import { loadAssetsFromUrl, createMaterial } from './util';
import { h } from './h';
import { render } from './render';
const hpc = {
    render, h, Application, Entity, loadAssetsFromUrl, ScriptComponent, createMaterial
}
window['hpc'] = hpc;
export {
    render, h, Application, Entity, loadAssetsFromUrl, ScriptComponent, createMaterial
};
export default hpc;
export * from './components';