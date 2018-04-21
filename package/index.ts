import { Application } from './application.tag';
import { HpcComponent } from './script_commponent';
import { Entity } from './entity.tag';
// import { loadAssetsFromUrl, createMaterial, randomRange, randomEnum, once } from './util';
import { h } from './h';
import { render } from './render';
const hpc = {
    h
}
window['hpc'] = hpc;
export {
    render, h, Application, Entity, HpcComponent
};
export default hpc;
export * from './util';
export * from './components';