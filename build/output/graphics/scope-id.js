var pc;
(function (pc) {
    var ScopeId = /** @class */ (function () {
        function ScopeId(name) {
            // Set the name
            this.name = name;
            // Set the default value
            this.value = null;
            // Create the version object
            this.versionObject = new pc.VersionedObject();
        }
        ScopeId.prototype.setValue = function (value) {
            // Set the new value
            this.value = value;
            // Increment the revision
            this.versionObject.increment();
        };
        ScopeId.prototype.getValue = function (value) {
            return this.value;
        };
        return ScopeId;
    }());
    pc.ScopeId = ScopeId;
})(pc || (pc = {}));
//# sourceMappingURL=scope-id.js.map