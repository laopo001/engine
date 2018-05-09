pc.extend(pc, (() => {
    let AudioListenerComponentData = function () {
        // Serialized
        this.enabled = true;
    };
    AudioListenerComponentData = pc.inherits(AudioListenerComponentData, pc.ComponentData);

    return {
        AudioListenerComponentData
    };
})());
