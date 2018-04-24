/// <reference path="../typings/index.d.ts" />

import { Application } from './application.tag';
import { HpcComponent } from './script_commponent';
import { Entity } from './entity.tag';
import { Node } from './node';
import { pc } from './playcanvas/playcanvas-latest.js'
// import { loadAssetsFromUrl, createMaterial, randomRange, randomEnum, once } from './util';
import { h } from './h';
import { render } from './render';
const hpc = {
    h
}
window['hpc'] = hpc;
window['pc'] = pc;
export {
    render, h, Application, Entity, HpcComponent, pc
};
export default hpc;
export * from './util';
export * from './components';
