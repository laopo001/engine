namespace pc {
    const tmpRay = new pc.Ray();
    const tmpVec3 = new pc.Vec3();
    const tmpSphere = new pc.BoundingSphere();
    const tmpMat4 = new pc.Mat4();

    /**
     * @constructor
     * @name pc.OrientedBox
     * @description Create a new oriented box.
     * @classdesc Oriented Box.
     * @property {pc.Mat4} [worldTransform] The world transform of the OBB
     * @param {pc.Mat4} [worldTransform] Transform that has the orientation and position of the box. Scale is assumed to be one.
     * @param {pc.Vec3} [halfExtents] Half the distance across the box in each local axis. The constructor takes a reference of this parameter.
     */
    export class OrientedBox {
        halfExtents: pc.Vec3;
        _modelTransform: pc.Mat4;
        _aabb: BoundingBox;
        constructor(worldTransform?: pc.Mat4, halfExtents?: pc.Vec3) {
            this.halfExtents = halfExtents || new pc.Vec3(0.5, 0.5, 0.5);

            worldTransform = worldTransform || tmpMat4.setIdentity();
            this._modelTransform = worldTransform.clone().invert();
            this._aabb = new pc.BoundingBox(new pc.Vec3(), this.halfExtents);
        }

        /**
         * @function
         * @name pc.OrientedBox#intersectsRay
         * @description Test if a ray intersects with the OBB.
         * @param {pc.Ray} ray Ray to test against (direction must be normalized).
         * @param {pc.Vec3} [point] If there is an intersection, the intersection point will be copied into here.
         * @returns {Boolean} True if there is an intersection.
         */
        intersectsRay({ origin, direction }, point) {
            this._modelTransform.transformPoint(origin, tmpRay.origin);
            this._modelTransform.transformVector(direction, tmpRay.direction);

            if (point) {
                const result = this._aabb._intersectsRay(tmpRay, point);
                tmpMat4.copy(this._modelTransform).invert().transformPoint(point, point);
                return result;
            } else {
                return this._aabb._fastIntersectsRay(tmpRay);
            }
        }

        /**
         * @function
         * @name pc.OrientedBox#containsPoint
         * @description Test if a point is inside a OBB.
         * @param {pc.Vec3} point Point to test.
         * @returns {Boolean} true if the point is inside the OBB and false otherwise.
         */
        containsPoint(point) {
            this._modelTransform.transformPoint(point, tmpVec3);
            return this._aabb.containsPoint(tmpVec3);
        }

        /**
         * @function
         * @name pc.OrientedBox#intersectsBoundingSphere
         * @description Test if a Bounding Sphere is overlapping, enveloping, or inside this OBB.
         * @param {pc.BoundingSphere} sphere Bounding Sphere to test.
         * @returns {Boolean} true if the Bounding Sphere is overlapping, enveloping or inside this OBB and false otherwise.
         */
        intersectsBoundingSphere({ center, radius }) {
            this._modelTransform.transformPoint(center, tmpSphere.center);
            tmpSphere.radius = radius;

            if (this._aabb.intersectsBoundingSphere(tmpSphere)) {
                return true;
            }

            return false;
        }

        set worldTransform(value) {
            this._modelTransform.copy(value).invert();
        }
    }

}