namespace pc {
    let idCounter = 0;

    export class VersionedObject {
        version: Version;
        constructor() {
            // Increment the global object ID counter
            idCounter++;

            // Create a version for this object
            this.version = new pc.Version();

            // Set the unique object ID
            this.version.globalId = idCounter;
        }

        increment() {
            // Increment the revision number
            this.version.revision++;
        }
    }


}