pc.extend(pc, ((() => {
    const shaderChunks = {};

    const attrib2Semantic = {
        vertex_position: pc.SEMANTIC_POSITION,
        vertex_normal: pc.SEMANTIC_NORMAL,
        vertex_tangent: pc.SEMANTIC_TANGENT,
        vertex_texCoord0: pc.SEMANTIC_TEXCOORD0,
        vertex_texCoord1: pc.SEMANTIC_TEXCOORD1,
        vertex_texCoord2: pc.SEMANTIC_TEXCOORD2,
        vertex_texCoord3: pc.SEMANTIC_TEXCOORD3,
        vertex_texCoord4: pc.SEMANTIC_TEXCOORD4,
        vertex_texCoord5: pc.SEMANTIC_TEXCOORD5,
        vertex_texCoord6: pc.SEMANTIC_TEXCOORD6,
        vertex_texCoord7: pc.SEMANTIC_TEXCOORD7,
        vertex_color: pc.SEMANTIC_COLOR,
        vertex_boneIndices: pc.SEMANTIC_BLENDINDICES,
        vertex_boneWeights: pc.SEMANTIC_BLENDWEIGHT
    };

    shaderChunks.collectAttribs = vsCode => {
        const attribs = {};
        let attrs = 0;

        let found = vsCode.indexOf("attribute");
        while (found >= 0) {
            if (found > 0 && vsCode[found-1]==="/") break;
            const endOfLine = vsCode.indexOf(';', found);
            const startOfAttribName = vsCode.lastIndexOf(' ', endOfLine);
            const attribName = vsCode.substr(startOfAttribName + 1, endOfLine - (startOfAttribName + 1));

            const semantic = attrib2Semantic[attribName];
            if (semantic!==undefined) {
                attribs[attribName] = semantic;
            } else {
                attribs[attribName] = `ATTR${attrs}`;
                attrs++;
            }

            found = vsCode.indexOf("attribute", found + 1);
        }
        return attribs;
    };


    shaderChunks.createShader = function(device, vsName, psName, useTransformFeedback) {
        let vsCode = shaderChunks[vsName];
        let psCode = `${pc.programlib.precisionCode(device)}\n${shaderChunks[psName]}`;
        const attribs = this.collectAttribs(vsCode);

        if (device.webgl2) {
            vsCode = pc.programlib.versionCode(device) + this.gles3VS + vsCode;
            psCode = pc.programlib.versionCode(device) + this.gles3PS + psCode;
        }

        return new pc.Shader(device, {
            attributes: attribs,
            vshader: vsCode,
            fshader: psCode,
            useTransformFeedback
        });
    };

    shaderChunks.createShaderFromCode = function(device, vsCode, psCode, uName, useTransformFeedback) {
        const shaderCache = device.programLib._cache;
        const cached = shaderCache[uName];
        if (cached !== undefined) return cached;

        psCode = `${pc.programlib.precisionCode(device)}\n${psCode || pc.programlib.dummyFragmentCode()}`;
        const attribs = this.collectAttribs(vsCode);

        if (device.webgl2) {
            vsCode = pc.programlib.versionCode(device) + this.gles3VS + vsCode;
            psCode = pc.programlib.versionCode(device) + this.gles3PS + psCode;
        }

        shaderCache[uName] = new pc.Shader(device, {
            attributes: attribs,
            vshader: vsCode,
            fshader: psCode,
            useTransformFeedback
        });
        return shaderCache[uName];
    };

    return {
        shaderChunks
    };
})()));
