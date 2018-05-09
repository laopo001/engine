pc.extend(pc, (() => {
    let LightComponentData = function () {
        const _props = pc._lightProps;
        const _propsDefault = pc._lightPropsDefault;
        let value;
        for (let i=0; i<_props.length; i++) {
            value = _propsDefault[i];
            if (value && value.clone) {
                this[_props[i]] = value.clone();
            } else {
                this[_props[i]] = value;
            }
        }
    };
    LightComponentData = pc.inherits(LightComponentData, pc.ComponentData);

    return {
        LightComponentData
    };
})());
