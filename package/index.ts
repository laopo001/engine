import { Application } from './application.tag';
import { ScriptComponent } from './script_commponent';
import { Entity } from './entity.tag';
import { loadAssetsFromUrl } from './util';
import { h } from './h';
import { render } from './render';
const hpc = {
    render, h, Application, Entity, loadAssetsFromUrl, ScriptComponent
}
window['hpc'] = hpc;
export {
    render, h, Application, Entity, loadAssetsFromUrl,ScriptComponent
};
export default hpc;
export * from './components';