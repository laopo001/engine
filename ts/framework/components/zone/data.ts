pc.extend(pc, (() => {
    let ZoneComponentData = function () {
        this.enabled = true;
    };
    ZoneComponentData = pc.inherits(ZoneComponentData, pc.ComponentData);

    return {
        ZoneComponentData
    };
})());
