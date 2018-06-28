var pc;
(function (pc) {
    var tmpVecA = new pc.Vec3();
    var tmpVecB = new pc.Vec3();
    var tmpVecC = new pc.Vec3();
    var tmpVecD = new pc.Vec3();
    var tmpVecE = new pc.Vec3();
    /**
     * @constructor
     * @name pc.BoundingBox
     * @description Create a new axis-aligned bounding box.
     * @classdesc Axis-Aligned Bounding Box.
     * @param {pc.Vec3} [center] Center of box. The constructor takes a reference of this parameter.
     * @param {pc.Vec3} [halfExtents] Half the distance across the box in each axis. The constructor takes a reference of this parameter.
     */
    var BoundingBox = /** @class */ (function () {
        function BoundingBox(center, halfExtents) {
            this.center = center || new pc.Vec3(0, 0, 0);
            this.halfExtents = halfExtents || new pc.Vec3(0.5, 0.5, 0.5);
            this._min = new pc.Vec3();
            this._max = new pc.Vec3();
        }
        /**
         * @function
         * @name pc.BoundingBox#add
         * @description Combines two bounding boxes into one, enclosing both.
         * @param {pc.BoundingBox} other Bounding box to add.
         */
        BoundingBox.prototype.add = function (_a) {
            var center = _a.center, halfExtents = _a.halfExtents;
            var tc = this.center.data;
            var tcx = tc[0];
            var tcy = tc[1];
            var tcz = tc[2];
            var th = this.halfExtents.data;
            var thx = th[0];
            var thy = th[1];
            var thz = th[2];
            var tminx = tcx - thx;
            var tmaxx = tcx + thx;
            var tminy = tcy - thy;
            var tmaxy = tcy + thy;
            var tminz = tcz - thz;
            var tmaxz = tcz + thz;
            var oc = center.data;
            var ocx = oc[0];
            var ocy = oc[1];
            var ocz = oc[2];
            var oh = halfExtents.data;
            var ohx = oh[0];
            var ohy = oh[1];
            var ohz = oh[2];
            var ominx = ocx - ohx;
            var omaxx = ocx + ohx;
            var ominy = ocy - ohy;
            var omaxy = ocy + ohy;
            var ominz = ocz - ohz;
            var omaxz = ocz + ohz;
            if (ominx < tminx)
                tminx = ominx;
            if (omaxx > tmaxx)
                tmaxx = omaxx;
            if (ominy < tminy)
                tminy = ominy;
            if (omaxy > tmaxy)
                tmaxy = omaxy;
            if (ominz < tminz)
                tminz = ominz;
            if (omaxz > tmaxz)
                tmaxz = omaxz;
            tc[0] = (tminx + tmaxx) * 0.5;
            tc[1] = (tminy + tmaxy) * 0.5;
            tc[2] = (tminz + tmaxz) * 0.5;
            th[0] = (tmaxx - tminx) * 0.5;
            th[1] = (tmaxy - tminy) * 0.5;
            th[2] = (tmaxz - tminz) * 0.5;
        };
        BoundingBox.prototype.copy = function (_a) {
            var center = _a.center, halfExtents = _a.halfExtents, type = _a.type;
            this.center.copy(center);
            this.halfExtents.copy(halfExtents);
            this.type = type;
        };
        BoundingBox.prototype.clone = function () {
            return new pc.BoundingBox(this.center.clone(), this.halfExtents.clone());
        };
        /**
         * @function
         * @name pc.BoundingBox#intersects
         * @description Test whether two axis-aligned bounding boxes intersect.
         * @param {pc.BoundingBox} other Bounding box to test against.
         * @returns {Boolean} True if there is an intersection.
         */
        BoundingBox.prototype.intersects = function (other) {
            var aMax = this.getMax();
            var aMin = this.getMin();
            var bMax = other.getMax();
            var bMin = other.getMin();
            return (aMin.x <= bMax.x) && (aMax.x >= bMin.x) &&
                (aMin.y <= bMax.y) && (aMax.y >= bMin.y) &&
                (aMin.z <= bMax.z) && (aMax.z >= bMin.z);
        };
        BoundingBox.prototype._intersectsRay = function (_a, point) {
            var origin = _a.origin, direction = _a.direction;
            var tMin = tmpVecA.copy(this.getMin()).sub(origin).data;
            var tMax = tmpVecB.copy(this.getMax()).sub(origin).data;
            var dir = direction.data;
            // Ensure that we are not dividing it by zero
            for (var i = 0; i < 3; i++) {
                if (dir[i] === 0) {
                    tMin[i] = tMin[i] < 0 ? -Number.MAX_VALUE : Number.MAX_VALUE;
                    tMax[i] = tMax[i] < 0 ? -Number.MAX_VALUE : Number.MAX_VALUE;
                }
                else {
                    tMin[i] /= dir[i];
                    tMax[i] /= dir[i];
                }
            }
            var realMin = tmpVecC.set(Math.min(tMin[0], tMax[0]), Math.min(tMin[1], tMax[1]), Math.min(tMin[2], tMax[2])).data;
            var realMax = tmpVecD.set(Math.max(tMin[0], tMax[0]), Math.max(tMin[1], tMax[1]), Math.max(tMin[2], tMax[2])).data;
            var minMax = Math.min(Math.min(realMax[0], realMax[1]), realMax[2]);
            var maxMin = Math.max(Math.max(realMin[0], realMin[1]), realMin[2]);
            var intersects = minMax >= maxMin && maxMin >= 0;
            if (intersects)
                point.copy(direction).scale(maxMin).add(origin);
            return intersects;
        };
        BoundingBox.prototype._fastIntersectsRay = function (_a) {
            var direction = _a.direction, origin = _a.origin;
            var diff = tmpVecA;
            var cross = tmpVecB;
            var prod = tmpVecC;
            var absDiff = tmpVecD;
            var absDir = tmpVecE;
            var rayDir = direction;
            diff.sub2(origin, this.center);
            absDiff.set(Math.abs(diff.x), Math.abs(diff.y), Math.abs(diff.z));
            prod.mul2(diff, rayDir);
            if (absDiff.x > this.halfExtents.x && prod.x >= 0)
                return false;
            if (absDiff.y > this.halfExtents.y && prod.y >= 0)
                return false;
            if (absDiff.z > this.halfExtents.z && prod.z >= 0)
                return false;
            absDir.set(Math.abs(rayDir.x), Math.abs(rayDir.y), Math.abs(rayDir.z));
            cross.cross(rayDir, diff);
            cross.set(Math.abs(cross.x), Math.abs(cross.y), Math.abs(cross.z));
            if (cross.x > this.halfExtents.y * absDir.z + this.halfExtents.z * absDir.y)
                return false;
            if (cross.y > this.halfExtents.x * absDir.z + this.halfExtents.z * absDir.x)
                return false;
            if (cross.z > this.halfExtents.x * absDir.y + this.halfExtents.y * absDir.x)
                return false;
            return true;
        };
        /**
         * @function
         * @name pc.BoundingBox#intersectsRay
         * @description Test if a ray intersects with the AABB.
         * @param {pc.Ray} ray Ray to test against (direction must be normalized).
         * @param {pc.Vec3} [point] If there is an intersection, the intersection point will be copied into here.
         * @returns {Boolean} True if there is an intersection.
         */
        BoundingBox.prototype.intersectsRay = function (ray, point) {
            if (point) {
                return this._intersectsRay(ray, point);
            }
            else {
                return this._fastIntersectsRay(ray);
            }
        };
        BoundingBox.prototype.setMinMax = function (min, max) {
            this.center.add2(max, min).scale(0.5);
            this.halfExtents.sub2(max, min).scale(0.5);
        };
        /**
         * @function
         * @name pc.BoundingBox#getMin
         * @description Return the minimum corner of the AABB.
         * @returns {pc.Vec3} minimum corner.
         */
        BoundingBox.prototype.getMin = function () {
            return this._min.copy(this.center).sub(this.halfExtents);
        };
        /**
         * @function
         * @name pc.BoundingBox#getMax
         * @description Return the maximum corner of the AABB.
         * @returns {pc.Vec3} maximum corner.
         */
        BoundingBox.prototype.getMax = function () {
            return this._max.copy(this.center).add(this.halfExtents);
        };
        /**
         * @function
         * @name pc.BoundingBox#containsPoint
         * @description Test if a point is inside a AABB.
         * @param {pc.Vec3} point Point to test.
         * @returns {Boolean} true if the point is inside the AABB and false otherwise.
         */
        BoundingBox.prototype.containsPoint = function (_a) {
            var data = _a.data;
            var min = this.getMin();
            var max = this.getMax();
            var i;
            for (i = 0; i < 3; ++i) {
                if (data[i] < min.data[i] || data[i] > max.data[i])
                    return false;
            }
            return true;
        };
        /**
         * @function
         * @name pc.BoundingBox#setFromTransformedAabb
         * @description Set an AABB to enclose the specified AABB if it were to be
         * transformed by the specified 4x4 matrix.
         * @param {pc.BoundingBox} aabb Box to transform and enclose
         * @param {pc.Mat4} m Transformation matrix to apply to source AABB.
         */
        BoundingBox.prototype.setFromTransformedAabb = function (_a, m) {
            var center = _a.center, halfExtents = _a.halfExtents;
            var bc = this.center;
            var br = this.halfExtents;
            var ac = center.data;
            var ar = halfExtents.data;
            m = m.data;
            var mx0 = m[0];
            var mx1 = m[4];
            var mx2 = m[8];
            var my0 = m[1];
            var my1 = m[5];
            var my2 = m[9];
            var mz0 = m[2];
            var mz1 = m[6];
            var mz2 = m[10];
            var mx0a = Math.abs(mx0);
            var mx1a = Math.abs(mx1);
            var mx2a = Math.abs(mx2);
            var my0a = Math.abs(my0);
            var my1a = Math.abs(my1);
            var my2a = Math.abs(my2);
            var mz0a = Math.abs(mz0);
            var mz1a = Math.abs(mz1);
            var mz2a = Math.abs(mz2);
            bc.set(m[12] + mx0 * ac[0] + mx1 * ac[1] + mx2 * ac[2], m[13] + my0 * ac[0] + my1 * ac[1] + my2 * ac[2], m[14] + mz0 * ac[0] + mz1 * ac[1] + mz2 * ac[2]);
            br.set(mx0a * ar[0] + mx1a * ar[1] + mx2a * ar[2], my0a * ar[0] + my1a * ar[1] + my2a * ar[2], mz0a * ar[0] + mz1a * ar[1] + mz2a * ar[2]);
        };
        BoundingBox.prototype.compute = function (vertices) {
            var min = tmpVecA.set(vertices[0], vertices[1], vertices[2]);
            var max = tmpVecB.set(vertices[0], vertices[1], vertices[2]);
            var numVerts = vertices.length / 3;
            for (var i = 1; i < numVerts; i++) {
                var x = vertices[i * 3 + 0];
                var y = vertices[i * 3 + 1];
                var z = vertices[i * 3 + 2];
                if (x < min.x)
                    min.x = x;
                if (y < min.y)
                    min.y = y;
                if (z < min.z)
                    min.z = z;
                if (x > max.x)
                    max.x = x;
                if (y > max.y)
                    max.y = y;
                if (z > max.z)
                    max.z = z;
            }
            this.setMinMax(min, max);
        };
        /**
         * @function
         * @name pc.BoundingBox#intersectsBoundingSphere
         * @description Test if a Bounding Sphere is overlapping, enveloping, or inside this AABB.
         * @param {pc.BoundingSphere} sphere Bounding Sphere to test.
         * @returns {Boolean} true if the Bounding Sphere is overlapping, enveloping, or inside the AABB and false otherwise.
         */
        BoundingBox.prototype.intersectsBoundingSphere = function (sphere) {
            var sq = this._distanceToBoundingSphereSq(sphere);
            if (sq <= sphere.radius * sphere.radius) {
                return true;
            }
            return false;
        };
        BoundingBox.prototype._distanceToBoundingSphereSq = function (_a) {
            var center = _a.center;
            var boxMin = this.getMin();
            var boxMax = this.getMax();
            var sq = 0;
            for (var i = 0; i < 3; ++i) {
                var out = 0;
                var pn = center.data[i];
                var bMin = boxMin.data[i];
                var bMax = boxMax.data[i];
                var val = 0;
                if (pn < bMin) {
                    val = (bMin - pn);
                    out += val * val;
                }
                if (pn > bMax) {
                    val = (pn - bMax);
                    out += val * val;
                }
                sq += out;
            }
            return sq;
        };
        return BoundingBox;
    }());
    pc.BoundingBox = BoundingBox;
})(pc || (pc = {}));
//# sourceMappingURL=bounding-box.js.map