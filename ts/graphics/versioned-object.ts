pc.extend(pc, (() => {
    let idCounter = 0;

    class VersionedObject {
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

    return {
        VersionedObject
    };
})());