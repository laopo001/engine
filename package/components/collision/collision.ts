import { PcComponent } from '../pc.component';

export interface ICollisionProps {
    type: string;
    halfExtents: pc.Vec3;
    radius: number;
    axis: number;
    height: number;
    asset: pc.Asset;
    model: pc.Model;
    collisionstart: (result: pc.ContactResult, self: pc.Entity) => void;
    collisionend: (result: pc.Entity, self: pc.Entity) => void;
    contact: (result: pc.ContactResult, self: pc.Entity) => void;
    triggerenter: (result: pc.Entity, self: pc.Entity) => void;
    triggerleave: (result: pc.Entity, self: pc.Entity) => void;
}
export type CollisionProps = Partial<ICollisionProps>

export class Collision extends PcComponent<CollisionProps> {
    static addComponent(entity, node) {
        let component = super.addComponent(entity, node)

        let arr = ['collisionstart', 'collisionend', 'contact', 'triggerenter', 'triggerleave']
        arr.forEach(key => {
            node.props[key] && component.on(key, function (arg) {
                node.props[key](arg, entity)
            }, entity);
        });
        return component;
    }
}