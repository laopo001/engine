pc.extend(pc, (() => {
    const tmpVecA = new pc.Vec3();

    /**
     * @private
     * @constructor
     * @name pc.Plane
     * @classdesc An infinite plane.
     * @description Create an infinite plane.
     * @param {pc.Vec3} [point] Point position on the plane. The constructor takes a reference of this parameter.
     * @param {pc.Vec3} [normal] Normal of the plane. The constructor takes a reference of this parameter.
     */
    class Plane {
        constructor(point, normal) {
            this.normal = normal || new pc.Vec3(0, 0, 1);
            this.point = point || new pc.Vec3(0, 0, 0);
        }

        /**
         * @function
         * @name pc.Plane#intersectsLine
         * @description Test if the plane intersects between two points.
         * @param {pc.Vec3} start Start position of line.
         * @param {pc.Vec3} end End position of line.
         * @param {pc.Vec3} [point] If there is an intersection, the intersection point will be copied into here.
         * @returns {Boolean} True if there is an intersection.
         */
        intersectsLine(start, end, point) {
            const d = -this.normal.dot(this.point);
            const d0 = this.normal.dot(start) + d;
            const d1 = this.normal.dot(end) + d;

            const t = d0 / (d0 - d1);
            const intersects = t >= 0 && t <= 1;
            if (intersects && point)
                point.lerp(start, end, t);

            return intersects;
        }

        /**
         * @function
         * @name pc.Plane#intersectsRay
         * @description Test if a ray intersects with the infinite plane
         * @param {pc.Ray} ray Ray to test against (direction must be normalized)
         * @param {pc.Vec3} [point] If there is an intersection, the intersection point will be copied into here
         * @returns {Boolean} True if there is an intersection
         */
        intersectsRay({origin, direction}, point) {
            const pointToOrigin = tmpVecA.sub2(this.point, origin);
            const t = this.normal.dot(pointToOrigin) / this.normal.dot(direction);
            const intersects = t >= 0;

            if (intersects && point)
                point.copy(direction).scale(t).add(origin);

            return intersects;
        }
    }

    return {
        Plane
    };
})());
