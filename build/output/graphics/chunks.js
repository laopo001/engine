var pc;
(function (pc) {
    var attrib2Semantic = {
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
    pc.shaderChunks = {
        fullscreenQuadVS: '',
        precisionTestPS: '',
        fixCubemapSeamsStretchPS: '',
        precisionTest2PS: '',
        fixCubemapSeamsNonePS: '',
        outputTex2DPS: '',
        genParaboloidPS: '',
        dpAtlasQuadPS: '',
        prefilterCubemapPS: '',
        rgbmPS: '',
        outputCubemapPS: '',
        fullscreenQuadPS: '',
        gamma2_2PS: '',
        gamma1_0PS: '',
        tonemappingFilmicPS: '',
        tonemappingAces2PS: '',
        tonemappingLinearPS: '',
        tonemappingHejlPS: '',
        tonemappingAcesPS: '',
        tonemappingNonePS: '',
        fogLinearPS: '',
        fogExpPS: '',
        fogExp2PS: '',
        fogNonePS: '',
        skyboxVS: '',
        envMultiplyPS: '',
        envConstPS: '',
        skyboxHDRPS: '',
        baseVS: '',
        shadowCoordVS: '',
        instancingVS: '',
        viewNormalVS: '',
        tangentBinormalVS: '',
        transformVS: '',
        startVS: '',
        normalVS: '',
        extensionVS: '',
        gles3VS: '',
        gles3PS: '',
        extensionPS: '',
        alphaTestPS: '',
        fresnelSimplePS: '',
        packDepthPS: '',
        storeEVSMPS: '',
        basePS: '',
        TBNfastPS: '',
        TBNPS: '',
        normalXYPS: '',
        normalXYZPS: '',
        normalMapFloatTBNfastPS: '',
        normalMapFloatPS: '',
        normalMapPS: '',
        normalVertexPS: '',
        cubeMapProjectBoxPS: '',
        cubeMapProjectNonePS: '',
        specularAaToksvigFloatPS: '',
        specularAaToksvigPS: '',
        specularAaNonePS: '',
        fresnelSchlickPS: '',
        fresnelComplexPS: '',
        parallaxPS: '',
        aoVertPS: '',
        aoTexPS: '',
        aoSpecOccSimplePS: '',
        aoSpecOccConstSimplePS: '',
        aoSpecOccPS: '',
        aoSpecOccConstPS: '',
        reflectionPrefilteredCubeLodPS: '',
        reflectionPrefilteredCubePS: '',
        reflectionCubePS: '',
        reflectionSpherePS: '',
        reflectionSphereLowPS: '',
        reflectionDpAtlasPS: '',
        refractionPS: '',
        shadowStandardPS: '',
        shadowStandardGL2PS: '',
        shadowVSM_commonPS: '',
        shadowVSM8PS: '',
        shadowEVSMPS: '',
        shadowEVSMnPS: '',
        biasConstPS: '',
        shadowCoordPS: '',
        shadowCommonPS: '',
        shadowCoordPerspZbufferPS: '',
        shadowStandardVSPS: '',
        shadowStandardGL2VSPS: '',
        shadowVSMVSPS: '',
        lightDiffuseLambertPS: '',
        lightSpecularPhongPS: '',
        lightSpecularBlinnPS: '',
        combineDiffuseSpecularPS: '',
        combineDiffuseSpecularNoConservePS: '',
        combineDiffuseSpecularOldPS: '',
        combineDiffuseSpecularNoReflPS: '',
        combineDiffuseSpecularNoReflSeparateAmbientPS: '',
        combineDiffusePS: '',
        lightmapDirPS: '',
        lightmapSinglePS: '',
        ambientSHPS: '',
        ambientPrefilteredCubeLodPS: '',
        ambientPrefilteredCubePS: '',
        ambientConstantPS: '',
        msdfPS: '',
        viewDirPS: '',
        reflDirPS: '',
        startPS: '',
        endPS: '',
        outputAlphaPS: '',
        outputAlphaPremulPS: '',
        outputAlphaOpaquePS: '',
        lightDirPointPS: '',
        falloffLinearPS: '',
        falloffInvSquaredPS: '',
        spotPS: '',
        cookiePS: '',
        transformDeclVS: '',
        transformSkinnedVS: '',
        collectAttribs: function (vsCode) {
            var attribs = {};
            var attrs = 0;
            var found = vsCode.indexOf("attribute");
            while (found >= 0) {
                if (found > 0 && vsCode[found - 1] === "/")
                    break;
                var endOfLine = vsCode.indexOf(';', found);
                var startOfAttribName = vsCode.lastIndexOf(' ', endOfLine);
                var attribName = vsCode.substr(startOfAttribName + 1, endOfLine - (startOfAttribName + 1));
                var semantic = attrib2Semantic[attribName];
                if (semantic !== undefined) {
                    attribs[attribName] = semantic;
                }
                else {
                    attribs[attribName] = "ATTR" + attrs;
                    attrs++;
                }
                found = vsCode.indexOf("attribute", found + 1);
            }
            return attribs;
        },
        createShader: function (device, vsName, psName, useTransformFeedback) {
            var vsCode = pc.shaderChunks[vsName];
            var psCode = pc.programlib.precisionCode(device) + "\n" + pc.shaderChunks[psName];
            var attribs = this.collectAttribs(vsCode);
            if (device.webgl2) {
                vsCode = pc.programlib.versionCode(device) + this.gles3VS + vsCode;
                psCode = pc.programlib.versionCode(device) + this.gles3PS + psCode;
            }
            return new pc.Shader(device, {
                attributes: attribs,
                vshader: vsCode,
                fshader: psCode,
                useTransformFeedback: useTransformFeedback
            });
        },
        createShaderFromCode: function (device, vsCode, psCode, uName, useTransformFeedback) {
            var shaderCache = device.programLib._cache;
            var cached = shaderCache[uName];
            if (cached !== undefined)
                return cached;
            psCode = pc.programlib.precisionCode(device) + "\n" + (psCode || pc.programlib.dummyFragmentCode());
            var attribs = this.collectAttribs(vsCode);
            if (device.webgl2) {
                vsCode = pc.programlib.versionCode(device) + this.gles3VS + vsCode;
                psCode = pc.programlib.versionCode(device) + this.gles3PS + psCode;
            }
            shaderCache[uName] = new pc.Shader(device, {
                attributes: attribs,
                vshader: vsCode,
                fshader: psCode,
                useTransformFeedback: useTransformFeedback
            });
            return shaderCache[uName];
        }
    };
})(pc || (pc = {}));
//# sourceMappingURL=chunks.js.map