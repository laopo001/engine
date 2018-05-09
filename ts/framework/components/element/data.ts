pc.extend(pc, (() => {
    let ElementComponentData = function () {
        this.enabled = true;
    };
    ElementComponentData = pc.inherits(ElementComponentData, pc.ComponentData);

    return {
        ElementComponentData
    };
})());
