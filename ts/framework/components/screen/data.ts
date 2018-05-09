pc.extend(pc, (() => {
    let ScreenComponentData = function () {
        this.enabled = true;
    };
    ScreenComponentData = pc.inherits(ScreenComponentData, pc.ComponentData);

    return {
        ScreenComponentData
    };
})());
