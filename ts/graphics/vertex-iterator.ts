namespace pc {
    function VertexIteratorSetter(buffer, {dataType, offset, numComponents}) {
        this.index = 0;

        switch (dataType) {
            case pc.TYPE_INT8:
                this.array = new Int8Array(buffer, offset);
                break;
            case pc.TYPE_UINT8:
                this.array = new Uint8Array(buffer, offset);
                break;
            case pc.TYPE_INT16:
                this.array = new Int16Array(buffer, offset);
                break;
            case pc.TYPE_UINT16:
                this.array = new Uint16Array(buffer, offset);
                break;
            case pc.TYPE_INT32:
                this.array = new Int32Array(buffer, offset);
                break;
            case pc.TYPE_UINT32:
                this.array = new Uint32Array(buffer, offset);
                break;
            case pc.TYPE_FLOAT32:
                this.array = new Float32Array(buffer, offset);
                break;
        }

        // Methods
        switch (numComponents) {
            case 1: this.set = VertexIteratorSetter_set1; break;
            case 2: this.set = VertexIteratorSetter_set2; break;
            case 3: this.set = VertexIteratorSetter_set3; break;
            case 4: this.set = VertexIteratorSetter_set4; break;
        }
    }

    function VertexIteratorSetter_set1(a) {
        this.array[this.index] = a;
    }

    function VertexIteratorSetter_set2(a, b) {
        this.array[this.index] = a;
        this.array[this.index + 1] = b;
    }

    function VertexIteratorSetter_set3(a, b, c) {
        this.array[this.index] = a;
        this.array[this.index + 1] = b;
        this.array[this.index + 2] = c;
    }

    function VertexIteratorSetter_set4(a, b, c, d) {
        this.array[this.index] = a;
        this.array[this.index + 1] = b;
        this.array[this.index + 2] = c;
        this.array[this.index + 3] = d;
    }

    /**
     * @constructor
     * @name pc.VertexIterator
     * @classdesc A vertex iterator simplifies the process of writing vertex data to a vertex buffer.
     * @description Returns a new pc.VertexIterator object.
     * @param {pc.VertexBuffer} vertexBuffer The vertex buffer to be iterated.
     */
    export class VertexIterator {
        vertexBuffer: any;
        buffer: any;
        setters: any[];
        element: {};
        constructor(vertexBuffer) {
            // Store the vertex buffer
            this.vertexBuffer = vertexBuffer;

            // Lock the vertex buffer
            this.buffer = this.vertexBuffer.lock();

            // Create an empty list
            this.setters = [];
            this.element = {};

            // Add a new 'setter' function for each element
            const vertexFormat = this.vertexBuffer.getFormat();
            for (let i = 0; i < vertexFormat.elements.length; i++) {
                const vertexElement = vertexFormat.elements[i];
                this.setters[i] = new VertexIteratorSetter(this.buffer, vertexElement);
                this.element[vertexElement.name] = this.setters[i];
            }
        }

        /**
         * @function
         * @name pc.VertexIterator#next
         * @description Moves the vertex iterator on to the next vertex.
         * @example
         * var iterator = new pc.VertexIterator(vertexBuffer);
         * iterator.element[pc.SEMANTIC_POSTIION].set(-0.9, -0.9, 0.0);
         * iterator.element[pc.SEMANTIC_COLOR].set(255, 0, 0, 255);
         * iterator.next();
         * iterator.element[pc.SEMANTIC_POSTIION].set(0.9, -0.9, 0.0);
         * iterator.element[pc.SEMANTIC_COLOR].set(0, 255, 0, 255);
         * iterator.next();
         * iterator.element[pc.SEMANTIC_POSTIION].set(0.0, 0.9, 0.0);
         * iterator.element[pc.SEMANTIC_COLOR].set(0, 0, 255, 255);
         * iterator.end();
         */
        next() {
            let i = 0;
            const setters = this.setters;
            const numSetters = this.setters.length;
            const vertexFormat = this.vertexBuffer.getFormat();
            while (i < numSetters) {
                const setter = setters[i++];
                // BYTES_PER_ELEMENT is on the instance and constructor for Chrome, Safari and Firefox
                // but just the constructor for Opera
                setter.index += vertexFormat.size / setter.array.constructor.BYTES_PER_ELEMENT;
            }
        }

        /**
         * @function
         * @name pc.VertexIterator#end
         * @description Notifies the vertex buffer being iterated that writes are complete. Internally
         * the vertex buffer is unlocked and vertex data is uploaded to video memory.
         * @example
         * var iterator = new pc.VertexIterator(vertexBuffer);
         * iterator.element[pc.SEMANTIC_POSTIION].set(-0.9, -0.9, 0.0);
         * iterator.element[pc.SEMANTIC_COLOR].set(255, 0, 0, 255);
         * iterator.next();
         * iterator.element[pc.SEMANTIC_POSTIION].set(0.9, -0.9, 0.0);
         * iterator.element[pc.SEMANTIC_COLOR].set(0, 255, 0, 255);
         * iterator.next();
         * iterator.element[pc.SEMANTIC_POSTIION].set(0.0, 0.9, 0.0);
         * iterator.element[pc.SEMANTIC_COLOR].set(0, 0, 255, 255);
         * iterator.end();
         */
        end() {
            // Unlock the vertex buffer
            this.vertexBuffer.unlock();
        }
    }

}
