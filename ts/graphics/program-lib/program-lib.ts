namespace pc {
    export const programlib = {
        gammaCode(value) {
            if (value === pc.GAMMA_SRGB || value === pc.GAMMA_SRGBFAST) {
                return pc.shaderChunks.gamma2_2PS;
            } else if (value === pc.GAMMA_SRGBHDR) {
                return `#define HDR\n${pc.shaderChunks.gamma2_2PS}`;
            }
            return pc.shaderChunks.gamma1_0PS;
        },

        tonemapCode(value) {
            if (value === pc.TONEMAP_FILMIC) {
                return pc.shaderChunks.tonemappingFilmicPS;
            } else if (value === pc.TONEMAP_LINEAR) {
                return pc.shaderChunks.tonemappingLinearPS;
            } else if (value === pc.TONEMAP_HEJL) {
                return pc.shaderChunks.tonemappingHejlPS;
            } else if (value === pc.TONEMAP_ACES) {
                return pc.shaderChunks.tonemappingAcesPS;
            } else if (value === pc.TONEMAP_ACES2) {
                return pc.shaderChunks.tonemappingAces2PS;
            }
            return pc.shaderChunks.tonemappingNonePS;
        },

        fogCode(value) {
            if (value === 'linear') {
                return pc.shaderChunks.fogLinearPS;
            } else if (value === 'exp') {
                return pc.shaderChunks.fogExpPS;
            } else if (value === 'exp2') {
                return pc.shaderChunks.fogExp2PS;
            } else {
                return pc.shaderChunks.fogNonePS;
            }
        },

        skinCode(device, chunks?) {
            if (!chunks) chunks = pc.shaderChunks;
            if (device.supportsBoneTextures) {
                return chunks.skinTexVS;
            } else {
                return `#define BONE_LIMIT ${device.getBoneLimit()}\n${chunks.skinConstVS}`;
            }
        },

        precisionCode({ precision, webgl2 }) {
            let pcode = `precision ${precision} float;\n`;
            if (webgl2) {
                pcode += `#ifdef GL2\nprecision ${precision} sampler2DShadow;\n#endif\n`;
            }
            return pcode;
        },

        versionCode({ webgl2 }) {
            return webgl2 ? "#version 300 es\n" : "";
        },

        dummyFragmentCode() {
            return "void main(void) {gl_FragColor = vec4(0.0);}";
        },

        begin() {
            return 'void main(void)\n{\n';
        },

        end() {
            return '}\n';
        },
        skybox,
        standard
    };
}
