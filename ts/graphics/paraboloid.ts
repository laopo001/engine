namespace pc {
    const dpMult = 2.0;

    export function paraboloidFromCubemap(device, sourceCubemap, fixSeamsAmount, dontFlipX) {
        const chunks = pc.shaderChunks;
        const shader = chunks.createShaderFromCode(device, chunks.fullscreenQuadVS,
                                                 (sourceCubemap.fixCubemapSeams? chunks.fixCubemapSeamsStretchPS : chunks.fixCubemapSeamsNonePS) + chunks.genParaboloidPS, "genParaboloid");
        const constantTexSource = device.scope.resolve("source");
        const constantParams = device.scope.resolve("params");
        const params = new pc.Vec4();
        let size = sourceCubemap.width;
        const rgbmSource = sourceCubemap.rgbm;
        const format = sourceCubemap.format;

        size = Math.max(size, 8) * dpMult;

        const tex = new pc.Texture(device, {
            rgbm: rgbmSource,
            format,
            width: size * 2,
            height: size,
            mipmaps: false
        });

        const targ = new pc.RenderTarget(device, tex, {
            depth: false
        });

        params.x = fixSeamsAmount;
        params.y = dontFlipX? -1.0 : 1.0;
        constantTexSource.setValue(sourceCubemap);
        constantParams.setValue(params.data);
        pc.drawQuadWithShader(device, targ, shader);

        return tex;
    }

    function getDpAtlasRect(rect, mip) {

        rect.x = pc.math.clamp(mip - 2.0, 0,1) * 0.5;

        const t = mip - rect.x * 6.0;
        const i = 1.0 - rect.x;
        rect.y = Math.min(t * 0.5, 0.75) * i + rect.x;

        rect.z = (1.0 - pc.math.clamp(t, 0,1) * 0.5) * i;
        rect.w = rect.z * 0.5;

        return 1.0 / rect.z;
    }

    export function generateDpAtlas(device, sixCubemaps, dontFlipX) {
        let dp, rect;
        rect = new pc.Vec4();
        const params = new pc.Vec4();
        const size = sixCubemaps[0].width * 2 * dpMult;

        const chunks = pc.shaderChunks;
        const shader = chunks.createShaderFromCode(device, chunks.fullscreenQuadVS, chunks.dpAtlasQuadPS, "dpAtlasQuad");
        const constantTexSource = device.scope.resolve("source");
        const constantParams = device.scope.resolve("params");

        const tex = new pc.Texture(device, {
            rgbm: sixCubemaps[0].rgbm,
            format: sixCubemaps[0].format,
            width: size,
            height: size,
            mipmaps: false
        });
        const targ = new pc.RenderTarget(device, tex, {
            depth: false
        });

        const borderSize = 2; // 1 pixel from each side
        const mip0Width = size;
        const scaleFactor = (mip0Width + borderSize) / mip0Width - 1;
        let scaleAmount;
        for (let i=0; i<6; i++) {
            dp = pc.paraboloidFromCubemap(device, sixCubemaps[i], i, dontFlipX);
            constantTexSource.setValue(dp);
            scaleAmount = getDpAtlasRect(rect, i);
            params.x = scaleAmount * scaleFactor;
            params.y = params.x * 2;
            params.x += 1;
            params.y += 1;
            constantParams.setValue(params.data);
            rect.x *= size;
            rect.y *= size;
            rect.z *= size;
            rect.w *= size;
            pc.drawQuadWithShader(device, targ, shader, rect);
        }

        return tex;
    }

}
