var pc;
(function (pc) {
    var Version = /** @class */ (function () {
        function Version() {
            // Set the variables
            this.globalId = 0;
            this.revision = 0;
        }
        Version.prototype.equals = function (_a) {
            var globalId = _a.globalId, revision = _a.revision;
            return this.globalId === globalId &&
                this.revision === revision;
        };
        Version.prototype.notequals = function (_a) {
            var globalId = _a.globalId, revision = _a.revision;
            return this.globalId !== globalId ||
                this.revision !== revision;
        };
        Version.prototype.copy = function (_a) {
            var globalId = _a.globalId, revision = _a.revision;
            this.globalId = globalId;
            this.revision = revision;
        };
        Version.prototype.reset = function () {
            this.globalId = 0;
            this.revision = 0;
        };
        return Version;
    }());
    pc.Version = Version;
})(pc || (pc = {}));
//# sourceMappingURL=version.js.map