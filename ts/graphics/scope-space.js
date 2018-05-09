pc.extend(pc, (() => {
    class ScopeSpace {
        constructor(name) {
            // Store the name
            this.name = name;

            // Create the empty tables
            this.variables = {};
            this.namespaces = {};
        }

        resolve(name) {
            // Check if the ScopeId already exists
            if (this.variables.hasOwnProperty(name) === false) {

                // Create and add to the table
                this.variables[name] = new pc.ScopeId(name);
            }

            // Now return the ScopeId instance
            return this.variables[name];
        }

        getSubSpace(name) {
            // Check if the nested namespace already exists
            if (this.namespaces.hasOwnProperty(name) === false) {

                // Create and add to the table
                this.namespaces[name] = new pc.ScopeSpace(name);

                logDEBUG(`Added ScopeSpace: ${name}`);
            }

            // Now return the ScopeNamespace instance
            return this.namespaces[name];
        }
    }

    return {
        ScopeSpace
    };
})());