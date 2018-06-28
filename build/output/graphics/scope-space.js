var pc;
(function (pc) {
    var ScopeSpace = /** @class */ (function () {
        function ScopeSpace(name) {
            // Store the name
            this.name = name;
            // Create the empty tables
            this.variables = {};
            this.namespaces = {};
        }
        ScopeSpace.prototype.resolve = function (name) {
            // Check if the ScopeId already exists
            if (this.variables.hasOwnProperty(name) === false) {
                // Create and add to the table
                this.variables[name] = new pc.ScopeId(name);
            }
            // Now return the ScopeId instance
            return this.variables[name];
        };
        ScopeSpace.prototype.getSubSpace = function (name) {
            // Check if the nested namespace already exists
            if (this.namespaces.hasOwnProperty(name) === false) {
                // Create and add to the table
                this.namespaces[name] = new pc.ScopeSpace(name);
                pc.logDEBUG("Added ScopeSpace: " + name);
            }
            // Now return the ScopeNamespace instance
            return this.namespaces[name];
        };
        return ScopeSpace;
    }());
    pc.ScopeSpace = ScopeSpace;
})(pc || (pc = {}));
//# sourceMappingURL=scope-space.js.map