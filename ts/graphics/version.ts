pc.extend(pc, (() => {
    class Version {
        constructor() {
            // Set the variables
            this.globalId = 0;
            this.revision = 0;
        }

        equals({globalId, revision}) {
            return this.globalId === globalId &&
                   this.revision === revision;
        }

        notequals({globalId, revision}) {
            return this.globalId !== globalId ||
                   this.revision !== revision;
        }

        copy({globalId, revision}) {
            this.globalId = globalId;
            this.revision = revision;
        }

        reset() {
            this.globalId = 0;
            this.revision = 0;
        }
    }

    return {
        Version
    };
})());