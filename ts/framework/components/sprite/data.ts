pc.extend(pc, (() => {
    let SpriteComponentData = function () {
        this.enabled = true;
    };
    SpriteComponentData = pc.inherits(SpriteComponentData, pc.ComponentData);

    return {
        SpriteComponentData
    };
})());
