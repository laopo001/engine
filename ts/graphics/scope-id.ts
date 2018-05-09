namespace pc {
    export class ScopeId {
        name: any;
        value: any;
        versionObject: any;
        constructor(name) {
            // Set the name
            this.name = name;

            // Set the default value
            this.value = null;

            // Create the version object
            this.versionObject = new pc.VersionedObject();
        }

        setValue(value) {
            // Set the new value
            this.value = value;

            // Increment the revision
            this.versionObject.increment();
        }

        getValue(value) {
            return this.value;
        }
    }

}