pc.extend(pc, ((() => {
    // Draws shaded full-screen quad in a single call
    let _postEffectQuadVB = null;
    const _postEffectQuadDraw = {
        type: pc.PRIMITIVE_TRISTRIP,
        base: 0,
        count: 4,
        indexed: false
    };

    function drawQuadWithShader(device, target, shader, rect, scissorRect, useBlend) {
        if (_postEffectQuadVB === null) {
            const vertexFormat = new pc.VertexFormat(device, [{
                semantic: pc.SEMANTIC_POSITION,
                components: 2,
                type: pc.TYPE_FLOAT32
            }]);
            _postEffectQuadVB = new pc.VertexBuffer(device, vertexFormat, 4);

            const iterator = new pc.VertexIterator(_postEffectQuadVB);
            iterator.element[pc.SEMANTIC_POSITION].set(-1.0, -1.0);
            iterator.next();
            iterator.element[pc.SEMANTIC_POSITION].set(1.0, -1.0);
            iterator.next();
            iterator.element[pc.SEMANTIC_POSITION].set(-1.0, 1.0);
            iterator.next();
            iterator.element[pc.SEMANTIC_POSITION].set(1.0, 1.0);
            iterator.end();
        }

        const oldRt = device.renderTarget;
        device.setRenderTarget(target);
        device.updateBegin();
        let x, y, w, h;
        let sx, sy, sw, sh;
        if (!rect) {
            w = target ? target.width : device.width;
            h = target ? target.height : device.height;
            x = 0;
            y = 0;
        } else {
            x = rect.x;
            y = rect.y;
            w = rect.z;
            h = rect.w;
        }

        if (!scissorRect) {
            sx = x;
            sy = y;
            sw = w;
            sh = h;
        } else {
            sx = scissorRect.x;
            sy = scissorRect.y;
            sw = scissorRect.z;
            sh = scissorRect.w;
        }

        device.setViewport(x, y, w, h);
        device.setScissor(sx, sy, sw, sh);

        const oldDepthTest = device.getDepthTest();
        const oldDepthWrite = device.getDepthWrite();
        const oldCull = device.getCullMode();
        device.setDepthTest(false);
        device.setDepthWrite(false);
        device.setCullMode(pc.CULLFACE_NONE);
        if (!useBlend) device.setBlending(false);
        device.setVertexBuffer(_postEffectQuadVB, 0);
        device.setShader(shader);
        device.draw(_postEffectQuadDraw);
        device.setDepthTest(oldDepthTest);
        device.setDepthWrite(oldDepthWrite);
        device.setCullMode(oldCull);
        device.updateEnd();

        device.setRenderTarget(oldRt);
        device.updateBegin();
    }

    function destroyPostEffectQuad() {
        _postEffectQuadVB = null;
    }

    return {
        drawQuadWithShader,
        destroyPostEffectQuad
    };
})()));

