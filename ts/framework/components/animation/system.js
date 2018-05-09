pc.extend(pc, (() => {
    const _schema = [
        'enabled',
        'assets',
        'speed',
        'loop',
        'activate',
        'animations',
        'skeleton',
        'model',
        'prevAnim',
        'currAnim',
        'fromSkel',
        'toSkel',
        'blending',
        'blendTimeRemaining',
        'playing'
    ];

    /**
     * @constructor
     * @name pc.AnimationComponentSystem
     * @classdesc The AnimationComponentSystem manages creating and deleting AnimationComponents
     * @description Create an AnimationComponentSystem
     * @param {pc.Application} app The application managing this system.
     * @extends pc.ComponentSystem
     */
    let AnimationComponentSystem = function AnimationComponentSystem (app) {
        this.id = 'animation';
        this.description = "Specifies the animation assets that can run on the model specified by the Entity's model Component.";

        app.systems.add(this.id, this);

        this.ComponentType = pc.AnimationComponent;
        this.DataType = pc.AnimationComponentData;

        this.schema = _schema;

        this.on('beforeremove', this.onBeforeRemove, this);
        this.on('update', this.onUpdate, this);

        pc.ComponentSystem.on('update', this.onUpdate, this);
    };
    AnimationComponentSystem = pc.inherits(AnimationComponentSystem, pc.ComponentSystem);

    pc.Component._buildAccessors(pc.AnimationComponent.prototype, _schema);

    pc.extend(AnimationComponentSystem.prototype, {
        initializeComponentData(component, data, properties) {
            properties = ['activate', 'enabled', 'loop', 'speed', 'assets'];
            AnimationComponentSystem._super.initializeComponentData.call(this, component, data, properties);
        },

        cloneComponent({animation}, clone) {
            let key;
            this.addComponent(clone, {});

            clone.animation.data.assets = pc.extend([], animation.assets);
            clone.animation.data.speed = animation.speed;
            clone.animation.data.loop = animation.loop;
            clone.animation.data.activate = animation.activate;
            clone.animation.data.enabled = animation.enabled;

            const clonedAnimations = { };
            const animations = animation.animations;
            for (key in animations) {
                if (animations.hasOwnProperty(key)) {
                    clonedAnimations[key] = animations[key];
                }
            }
            clone.animation.animations = clonedAnimations;

            const clonedAnimationsIndex = { };
            const animationsIndex = animation.animationsIndex;
            for (key in animationsIndex) {
                if (animationsIndex.hasOwnProperty(key)) {
                    clonedAnimationsIndex[key] = animationsIndex[key];
                }
            }
            clone.animation.animationsIndex = clonedAnimationsIndex;
        },

        onBeforeRemove(entity, component) {
            component.onBeforeRemove();
        },

        onUpdate(dt) {
            const components = this.store;

            for (const id in components) {
                if (components.hasOwnProperty(id)) {
                    const component = components[id];
                    const componentData = component.data;
                    if (componentData.enabled && componentData.playing && component.entity.enabled) {
                        const skeleton = componentData.skeleton;
                        if (skeleton !== null && componentData.model !== null) {
                            if (componentData.blending) {
                                componentData.blendTimeRemaining -= dt;
                                if (componentData.blendTimeRemaining < 0.0) {
                                    componentData.blendTimeRemaining = 0.0;
                                }
                                const alpha = 1.0 - (componentData.blendTimeRemaining / componentData.blendTime);
                                skeleton.blend(componentData.fromSkel, componentData.toSkel, alpha);
                            } else {
                                // Advance the animation, interpolating keyframes at each animated node in
                                // skeleton
                                const delta = dt * componentData.speed;
                                skeleton.addTime(delta);
                                if ((skeleton._time === skeleton._animation.duration) && !componentData.loop) {
                                    componentData.playing = false;
                                }
                            }

                            if (componentData.blending && (componentData.blendTimeRemaining === 0.0)) {
                                componentData.blending = false;
                                skeleton.animation = componentData.toSkel._animation;
                            }

                            skeleton.updateGraph();
                        }
                    }
                }
            }
        }
    });

    return {
        AnimationComponentSystem
    };
})());
