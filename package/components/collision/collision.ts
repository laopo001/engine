import { PcComponent } from '../pc.component';

interface ICollisionProps {
    type: string;
    halfExtents: pc.Vec3;
    radius: number;
    axis: number;
    height: number;
    asset: pc.Asset;
    model: pc.Model;
}
export type CollisionProps = Partial<ICollisionProps>

export class Collision extends PcComponent<CollisionProps> {
    static basename = 'collision'
}