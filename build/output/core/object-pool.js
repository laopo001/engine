var pc;
(function (pc) {
    var AllocatePool = /** @class */ (function () {
        function AllocatePool(constructor, size) {
            this._constructor = constructor;
            this._pool = [];
            this._count = 0;
            this._resize(size);
        }
        AllocatePool.prototype._resize = function (size) {
            if (size > this._pool.length) {
                for (var i = this._pool.length; i < size; i++) {
                    this._pool[i] = new this._constructor();
                }
            }
        };
        AllocatePool.prototype.allocate = function () {
            if (this._count >= this._pool.length) {
                this._resize(this._pool.length * 2);
            }
            return this._pool[this._count++];
        };
        AllocatePool.prototype.freeAll = function () {
            this._count = 0;
        };
        return AllocatePool;
    }());
    pc.AllocatePool = AllocatePool;
})(pc || (pc = {}));
//# sourceMappingURL=object-pool.js.map