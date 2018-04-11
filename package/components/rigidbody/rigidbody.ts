import { PcComponent } from '../pc.component';

interface IRigidBodyProps {
    /**
     * Controls the rate at which a body loses angular velocity over time. 
     * @type {number}
     */
    angularDamping: number;

    /**
     * Scaling factor for angular movement of the body in each axis.
     * @type {pc.Vec3}
     */
    angularFactor: pc.Vec3;

    /**
     * Defines the rotational speed of the body around each world axis. 
     * @type {pc.Vec3}
     */
    angularVelocity: pc.Vec3;

    /**
     * The friction value used when contacts occur between two bodies. A higher value
     * indicates more friction. Should be set in the range 0 to 1. Defaults to 0.5.
     * @type {number}
     */
    friction: number;

    /**
     * The collision group this body belongs to. Combine the group and the mask to
     * prevent bodies colliding with each other. Defaults to 1. 
     * @type {number}
     */
    group: number;

    /**
     * Controls the rate at which a body loses linear velocity over time.
     * Defaults to 0.
     * @type {number}
     */
    linearDamping: number;

    /**
     * Scaling factor for linear movement of the body in each axis.
     * Defaults to 1 in all axes.
     * @type {pc.Vec3}
     */
    linearFactor: pc.Vec3;

    /**
     * Defines the speed of the body in a given direction.
     * @type {pc.Vec3}
     */
    linearVelocity: pc.Vec3;

    /**
     * The collision mask sets which groups this body collides with. It is a bitfield
     * of 16 bits, the first 8 bits are reserved for engine use. Defaults to 65535.
     * @type {number}
     */
    mask: number;

    /**
     * The mass of the body. This is only relevant for {@link pc.BODYTYPE_DYNAMIC}
     * bodies, other types have infinite mass. Defaults to 1.
     * @type {number}
     */
    mass: number;

    /**
     * Influences the amount of energy lost when two rigid bodies collide. The
     * calculation multiplies the restitution values for both colliding bodies. A multiplied value of 0 means
     * that all energy is lost in the collision while a value of 1 means that no energy is lost. Should be
     * set in the range 0 to 1. Defaults to 0.
     * @type {number}
     */
    restitution: number;

    /**
     * The rigid body type determines how the body is simulated. Can be:
     * <ul>
     *     <li>pc.BODYTYPE_STATIC: infinite mass and cannot move.</li>
     *     <li>pc.BODYTYPE_DYNAMIC: simulated according to applied forces.</li>
     *     <li>pc.BODYTYPE_KINEMATIC: infinite mass and does not respond to forces but can still be moved by setting their velocity or position.</li>
     * </ul>
     * Defaults to pc.BODYTYPE_STATIC.
     * @type {string}
     */
    type: pc.rigidBodyType | 'static' | 'dynamic';
}
export type RigidBodyProps = Partial<IRigidBodyProps>

export class RigidBody extends PcComponent<RigidBodyProps> {
    static basename = 'rigidbody'
}