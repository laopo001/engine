import { Application } from './application.tag';
import { Entity } from './entity.tag';
import * as components from './components';

const stringToComponent = {};

for (let x in components) {
    stringToComponent[components[x].basename] = components[x];
}
export function getAllStringToComponent() {
    stringToComponent[Application.basename] = Application;
    stringToComponent[Entity.basename] = Entity;
    return stringToComponent;
}
export { stringToComponent };