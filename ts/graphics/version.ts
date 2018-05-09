namespace pc {
    export class Version {
        globalId: number;
        revision: number;
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
}
