/// <reference path="../typings/index.d.ts" />
import './playcanvas/playcanvas-latest.js'
import { Application } from './application.tag';
import { HpcComponent } from './script_commponent';
import { Entity } from './entity.tag';
import { Node } from './node';
// import { loadAssetsFromUrl, createMaterial, randomRange, randomEnum, once } from './util';
import { h } from './h';
import { render } from './render';
const hpc = {
    h
}
window['hpc'] = hpc;
const pc = window['pc'];
export {
    render, h, Application, Entity, HpcComponent, pc
};
export default hpc;
export * from './util';
export * from './components';
