import { render } from './render';
import { h } from './h';
import { Application } from './application.tag';
import { Entity } from './entity.tag';

const hpc = {
    render, h, Application, Entity
}
window['hpc'] = hpc;
export {
    render, h, Application, Entity
};
export default hpc;