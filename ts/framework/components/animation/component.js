pc.extend(pc, (() => {
    /**
     * @component Animation
     * @constructor
     * @name pc.AnimationComponent
     * @classdesc The Animation Component allows an Entity to playback animations on models
     * @description Create a new AnimationComponent
     * @param {pc.AnimationComponentSystem} system The {@link pc.ComponentSystem} that created this Component
     * @param {pc.Entity} entity The Entity that this Component is attached to
     * @extends pc.Component
     * @property {Number} speed Speed multiplier for animation play back speed. 1.0 is playback at normal speed, 0.0 pauses the animation
     * @property {Boolean} loop If true the animation will restart from the beginning when it reaches the end
     * @property {Boolean} activate If true the first animation asset will begin playing when the Pack is loaded
     * @property {pc.Asset[]} assets The array of animation assets - can also be an array of asset ids.
     * @property {Number} currentTime Get or Set the current time position (in seconds) of the animation
     * @property {Number} duration Get the duration in seconds of the current animation.
     */
    let AnimationComponent = function (system, entity) {
        this.animationsIndex = { };

        // Handle changes to the 'animations' value
        this.on('set_animations', this.onSetAnimations, this);
        // Handle changes to the 'assets' value
        this.on('set_assets', this.onSetAssets, this);
        // Handle changes to the 'loop' value
        this.on('set_loop', this.onSetLoop, this);
    };
    AnimationComponent = pc.inherits(AnimationComponent, pc.Component);

    pc.extend(AnimationComponent.prototype, {
        /**
         * @function
         * @name pc.AnimationComponent#play
         * @description Start playing an animation
         * @param {String} name The name of the animation asset to begin playing.
         * @param {Number} [blendTime] The time in seconds to blend from the current
         * animation state to the start of the animation being set.
         */
        play(name, blendTime) {
            if (!this.data.animations[name]) {
                console.error(pc.string.format("Trying to play animation '{0}' which doesn't exist", name));
                return;
            }

            if (!this.enabled || !this.entity.enabled) {
                return;
            }

            blendTime = blendTime || 0;

            const data = this.data;

            data.prevAnim = data.currAnim;
            data.currAnim = name;

            if (data.model) {
                data.blending = blendTime > 0 && data.prevAnim;
                if (data.blending) {
                    // Blend from the current time of the current animation to the start of
                    // the newly specified animation over the specified blend time period.
                    data.blendTime = blendTime;
                    data.blendTimeRemaining = blendTime;
                    data.fromSkel.animation = data.animations[data.prevAnim];
                    data.fromSkel.addTime(data.skeleton._time);
                    data.toSkel.animation = data.animations[data.currAnim];
                } else {
                    data.skeleton.animation = data.animations[data.currAnim];
                }
            }

            data.playing = true;
        },

        /**
        * @function
        * @name pc.AnimationComponent#getAnimation
        * @description Return an animation
        * @param {String} name The name of the animation asset
        * @returns {pc.Animation} An Animation
        */
        getAnimation(name) {
            return this.data.animations[name];
        },

        setModel(model) {
            const data = this.data;
            if (model) {
                // Create skeletons
                const graph = model.getGraph();
                data.fromSkel = new pc.Skeleton(graph);
                data.toSkel = new pc.Skeleton(graph);
                data.skeleton = new pc.Skeleton(graph);
                data.skeleton.looping = data.loop;
                data.skeleton.setGraph(graph);
            }
            data.model = model;

            // Reset the current animation on the new model
            if (data.animations && data.currAnim && data.animations[data.currAnim]) {
                this.play(data.currAnim);
            }
        },

        loadAnimationAssets(ids) {
            if (! ids || ! ids.length)
                return;

            const self = this;
            const assets = this.system.app.assets;
            let i;
            const l = ids.length;

            const onAssetReady = ({name, resource, id}) => {
                self.animations[name] = resource;
                self.animationsIndex[id] = name;
                self.animations = self.animations; // assigning ensures set_animations event is fired
            };

            const onAssetAdd = asset => {
                asset.off('change', self.onAssetChanged, self);
                asset.on('change', self.onAssetChanged, self);

                asset.off('remove', self.onAssetRemoved, self);
                asset.on('remove', self.onAssetRemoved, self);

                if (asset.resource) {
                    onAssetReady(asset);
                } else {
                    asset.once('load', onAssetReady, self);
                    if (self.enabled && self.entity.enabled)
                        assets.load(asset);
                }
            };

            for (i = 0; i < l; i++) {
                const asset = assets.get(ids[i]);
                if (asset) {
                    onAssetAdd(asset);
                } else {
                    assets.on(`add:${ids[i]}`, onAssetAdd);
                }
            }
        },

        onAssetChanged({name, id}, attribute, newValue, oldValue) {
            if (attribute === 'resource') {
                // replace old animation with new one
                if (newValue) {
                    this.animations[name] = newValue;
                    this.animationsIndex[id] = name;

                    if (this.data.currAnim === name) {
                        // restart animation
                        if (this.data.playing && this.data.enabled && this.entity.enabled)
                            this.play(name, 0);
                    }
                } else {
                    delete this.animations[name];
                    delete this.animationsIndex[id];
                }
            }
        },

        onAssetRemoved(asset) {
            asset.off('remove', this.onAssetRemoved, this);

            if (this.animations && this.animations[asset.name]) {
                delete this.animations[asset.name];
                delete this.animationsIndex[asset.id];

                if (this.data.currAnim === asset.name)
                    this._stopCurrentAnimation();
            }
        },

        _stopCurrentAnimation() {
            this.data.currAnim = null;
            this.data.playing = false;
            if (this.data.skeleton) {
                this.data.skeleton.currentTime = 0;
                this.data.skeleton.animation = null;
            }
        },

        onSetAnimations(name, oldValue, newValue) {
            const data = this.data;

            // If we have animations _and_ a model, we can create the skeletons
            const modelComponent = this.entity.model;
            if (modelComponent) {
                const m = modelComponent.model;
                if (m && m !== data.model) {
                    this.entity.animation.setModel(m);
                }
            }

            if (! data.currAnim && data.activate && data.enabled && this.entity.enabled) {
                for (const animName in data.animations) {
                    // Set the first loaded animation as the current
                    this.play(animName, 0);
                    break;
                }
            }
        },

        onSetAssets(name, oldValue, newValue) {
            if (oldValue && oldValue.length) {
                for (let i = 0; i < oldValue.length; i++) {
                    // unsubscribe from change event for old assets
                    if (oldValue[i]) {
                        const asset = this.system.app.assets.get(oldValue[i]);
                        if (asset) {
                            asset.off('change', this.onAssetChanged, this);
                            asset.off('remove', this.onAssetRemoved, this);

                            const animName = this.animationsIndex[asset.id];

                            if (this.data.currAnim === animName)
                                this._stopCurrentAnimation();

                            delete this.animations[animName];
                            delete this.animationsIndex[asset.id];
                        }
                    }
                }
            }

            const ids = newValue.map(value => {
                if (value instanceof pc.Asset) {
                    return value.id;
                } else {
                    return value;
                }
            });

            this.loadAnimationAssets(ids);
        },

        onSetLoop(name, oldValue, newValue) {
            if (this.data.skeleton) {
                this.data.skeleton.looping = this.data.loop;
            }
        },

        onSetCurrentTime(name, oldValue, newValue) {
            this.data.skeleton.currentTime = newValue;
            this.data.skeleton.addTime(0); // update
            this.data.skeleton.updateGraph();
        },

        onEnable() {
            AnimationComponent._super.onEnable.call(this);

            // load assets if they're not loaded
            const assets = this.data.assets;
            const registry = this.system.app.assets;
            if (assets) {
                for (let i = 0, len = assets.length; i < len; i++) {
                    let asset = assets[i];
                    if (! (asset instanceof pc.Asset))
                        asset = registry.get(asset);

                    if (asset && !asset.resource)
                        registry.load(asset);
                }
            }

            if (this.data.activate && ! this.data.currAnim) {
                for (const animName in this.data.animations) {
                    this.play(animName, 0);
                    break;
                }
            }
        },

        onBeforeRemove() {
            for (let i = 0; i < this.assets.length; i++) {
                const asset = this.system.app.assets.get(this.assets[i]);
                if (! asset) continue;

                asset.off('change', this.onAssetChanged, this);
                asset.off('remove', this.onAssetRemoved, this);
            }

            delete this.data.animation;
            delete this.data.skeleton;
            delete this.data.fromSkel;
            delete this.data.toSkel;
        }
    });

    Object.defineProperties(AnimationComponent.prototype, {
        currentTime: {
            get() {
                return this.data.skeleton._time;
            },
            set(currentTime) {
                this.data.skeleton.currentTime = currentTime;
                this.data.skeleton.addTime(0);
                this.data.skeleton.updateGraph();
            }
        },

        duration: {
            get() {
                return this.data.animations[this.data.currAnim].duration;
            }
        }
    });

    return {
        AnimationComponent
    };
})());
