import { Application } from './application.tag';
import { ScriptComponent } from './script_commponent';
import { Entity } from './entity.tag';
import { loadAssetsFromUrl, createMaterial, randomRange, randomEnum, once } from './util';
import { h } from './h';
import { render } from './render';
const hpc = {
    h
}
window['hpc'] = hpc;
export {
    render, h, Application, Entity, loadAssetsFromUrl, ScriptComponent, createMaterial, randomRange, randomEnum, once
};
export default hpc;
export * from './components';