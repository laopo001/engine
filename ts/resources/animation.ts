pc.extend(pc, (() => {
    const AnimationHandler = () => {
    };

    AnimationHandler.prototype = {
        load(url, callback) {
            pc.http.get(url, (err, response) => {
                if (err) {
                    callback(pc.string.format("Error loading animation resource: {0} [{1}]", url, err));
                } else {
                    callback(null, response);
                }
            });
        },

        open(url, data) {
            return this[`_parseAnimationV${data.animation.version}`](data);
        },

        _parseAnimationV3({animation}) {
            const animData = animation;

            const anim = new pc.Animation();
            anim.setName(animData.name);
            anim.duration = animData.duration;

            for (let i = 0; i < animData.nodes.length; i++) {
                const node = new pc.Node();

                const n = animData.nodes[i];
                node._name = n.name;

                for (let j = 0; j < n.keys.length; j++) {
                    const k = n.keys[j];

                    const t = k.time;
                    const p = k.pos;
                    const r = k.rot;
                    const s = k.scale;
                    const pos = new pc.Vec3(p[0], p[1], p[2]);
                    const rot = new pc.Quat().setFromEulerAngles(r[0], r[1], r[2]);
                    const scl = new pc.Vec3(s[0], s[1], s[2]);

                    const key = new pc.Key(t, pos, rot, scl);

                    node._keys.push(key);
                }

                anim.addNode(node);
            }

            return anim;
        },

        _parseAnimationV4({animation}) {
            const animData = animation;

            const anim = new pc.Animation();
            anim.setName(animData.name);
            anim.duration = animData.duration;

            for (let i = 0; i < animData.nodes.length; i++) {
                const node = new pc.Node();

                const n = animData.nodes[i];
                node._name = n.name;

                const defPos = n.defaults.p;
                const defRot = n.defaults.r;
                const defScl = n.defaults.s;

                for (let j = 0; j < n.keys.length; j++) {
                    const k = n.keys[j];

                    const t = k.t;
                    const p = defPos ? defPos : k.p;
                    const r = defRot ? defRot : k.r;
                    const s = defScl ? defScl : k.s;
                    const pos = new pc.Vec3(p[0], p[1], p[2]);
                    const rot = new pc.Quat().setFromEulerAngles(r[0], r[1], r[2]);
                    const scl = new pc.Vec3(s[0], s[1], s[2]);

                    const key = new pc.Key(t, pos, rot, scl);

                    node._keys.push(key);
                }

                anim.addNode(node);
            }

            return anim;
        }
    };

    return {
        AnimationHandler
    };
})());
