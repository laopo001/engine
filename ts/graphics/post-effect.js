pc.extend(pc, (() => {
    // Primitive for drawFullscreenQuad
    const primitive = {
        type: pc.PRIMITIVE_TRISTRIP,
        base: 0,
        count: 4,
        indexed: false
    };

    /**
     * @constructor
     * @name pc.PostEffect
     * @classdesc Base class for all post effects. Post effects take a a render target as input
     * apply effects to it and then render the result to an output render target or the screen
     * if no output is specified.
     * @description Creates new PostEffect
     * @param {pc.GraphicsDevice} graphicsDevice The graphics device of the application
     */
    class PostEffect {
        constructor(graphicsDevice) {
            this.device = graphicsDevice;
            this.shader = null;
            this.depthMap = null;
            this.vertexBuffer = pc.createFullscreenQuad(graphicsDevice);
            this.needsDepthBuffer = false;
        }

        /**
         * @function
         * @name pc.PostEffect#render
         * @description Render the post effect using the specified inputTarget
         * to the specified outputTarget.
         * @param {pc.RenderTarget} inputTarget The input render target
         * @param {pc.RenderTarget} outputTarget The output render target. If null then this will be the screen.
         * @param {pc.Vec4} rect (Optional) The rect of the current camera. If not specified then it will default to [0,0,1,1]
         */
        render(inputTarget, outputTarget, rect) {
        }
    }

    function createFullscreenQuad (device) {
        // Create the vertex format
        const vertexFormat = new pc.VertexFormat(device, [
            { semantic: pc.SEMANTIC_POSITION, components: 2, type: pc.TYPE_FLOAT32 }
        ]);

        // Create a vertex buffer
        const vertexBuffer = new pc.VertexBuffer(device, vertexFormat, 4);

        // Fill the vertex buffer
        const iterator = new pc.VertexIterator(vertexBuffer);
        iterator.element[pc.SEMANTIC_POSITION].set(-1.0, -1.0);
        iterator.next();
        iterator.element[pc.SEMANTIC_POSITION].set(1.0, -1.0);
        iterator.next();
        iterator.element[pc.SEMANTIC_POSITION].set(-1.0, 1.0);
        iterator.next();
        iterator.element[pc.SEMANTIC_POSITION].set(1.0, 1.0);
        iterator.end();

        return vertexBuffer;
    }

    function drawFullscreenQuad (device, target, vertexBuffer, shader, rect) {
        device.setRenderTarget(target);
        device.updateBegin();
        let w = (target !== null) ? target.width : device.width;
        let h = (target !== null) ? target.height : device.height;
        let x = 0;
        let y = 0;

        if (rect) {
            x = rect.x * w;
            y = rect.y * h;
            w *= rect.z;
            h *= rect.w;
        }

        device.setViewport(x, y, w, h);
        device.setScissor(x, y, w, h);

        const oldBlending = device.getBlending();
        const oldDepthTest = device.getDepthTest();
        const oldDepthWrite = device.getDepthWrite();
        const oldCullMode = device.getCullMode();
        const oldWR = device.writeRed;
        const oldWG = device.writeGreen;
        const oldWB = device.writeBlue;
        const oldWA = device.writeAlpha;
        device.setBlending(false);
        device.setDepthTest(false);
        device.setDepthWrite(false);
        device.setCullMode(pc.CULLFACE_BACK);
        device.setColorWrite(true, true, true, true);
        device.setVertexBuffer(vertexBuffer, 0);
        device.setShader(shader);
        device.draw(primitive);
        device.setBlending(oldBlending);
        device.setDepthTest(oldDepthTest);
        device.setDepthWrite(oldDepthWrite);
        device.setCullMode(oldCullMode);
        device.setColorWrite(oldWR, oldWG, oldWB, oldWA);
        device.updateEnd();
    }

    return {
        PostEffect,
        createFullscreenQuad,
        drawFullscreenQuad
    };
})());
