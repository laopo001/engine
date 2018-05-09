pc.extend(pc, (() => {
    let ScriptComponentData = function () {
        this.enabled = true;
    };
    ScriptComponentData = pc.inherits(ScriptComponentData, pc.ComponentData);

    return {
        ScriptComponentData
    };
})());
