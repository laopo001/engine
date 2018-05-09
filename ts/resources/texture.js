pc.extend(pc, (() => {
    const JSON_ADDRESS_MODE = {
        "repeat": pc.ADDRESS_REPEAT,
        "clamp": pc.ADDRESS_CLAMP_TO_EDGE,
        "mirror": pc.ADDRESS_MIRRORED_REPEAT
    };

    const JSON_FILTER_MODE = {
        "nearest": pc.FILTER_NEAREST,
        "linear": pc.FILTER_LINEAR,
        "nearest_mip_nearest": pc.FILTER_NEAREST_MIPMAP_NEAREST,
        "linear_mip_nearest": pc.FILTER_LINEAR_MIPMAP_NEAREST,
        "nearest_mip_linear": pc.FILTER_NEAREST_MIPMAP_LINEAR,
        "linear_mip_linear": pc.FILTER_LINEAR_MIPMAP_LINEAR
    };

    function arrayBufferCopy(src, dst, dstByteOffset, numBytes) {
        let i;
        const dst32Offset = dstByteOffset / 4;
        const tail = (numBytes % 4);
        const src32 = new Uint32Array(src.buffer, 0, (numBytes - tail) / 4);
        const dst32 = new Uint32Array(dst.buffer);
        for (i = 0; i < src32.length; i++) {
            dst32[dst32Offset + i] = src32[i];
        }
        for (i = numBytes - tail; i < numBytes; i++) {
            dst[dstByteOffset + i] = src[i];
        }
    }

    class TextureHandler {
        constructor(device, assets, loader) {
            this._device = device;
            this._assets = assets;
            this._loader = loader;

            // by default don't try cross-origin, because some browsers send different cookies (e.g. safari) if this is set.
            this.crossOrigin = undefined;
            if (assets.prefix) {
                // ensure we send cookies if we load images.
                this.crossOrigin = 'anonymous';
            }
        }

        load(url, callback) {
            const self = this;
            let image;

            let urlWithoutParams = url.includes('?') ? url.split('?')[0] : url;

            const ext = pc.path.getExtension(urlWithoutParams).toLowerCase();
            if ((ext === '.dds') || (ext === '.crn')) {
                const options = {
                    cache: true,
                    responseType: "arraybuffer"
                };

                pc.http.get(url, options, (err, response) => {
                    if (!err) {
                        callback(null, response);
                    } else {
                        callback(err);
                    }
                });
            } else if ((ext === '.jpg') || (ext === '.jpeg') || (ext === '.gif') || (ext === '.png')) {
                image = new Image();
                // only apply cross-origin setting if this is an absolute URL, relative URLs can never be cross-origin
                if (self.crossOrigin !== undefined && pc.ABSOLUTE_URL.test(url)) {
                    image.crossOrigin = self.crossOrigin;
                }

                // Call success callback after opening Texture
                image.onload = () => {
                    callback(null, image);
                };

                // Call error callback with details.
                image.onerror = event => {
                    callback(pc.string.format("Error loading Texture from: '{0}'", url));
                };

                image.src = url;
            } else {
                const blobStart = urlWithoutParams.indexOf("blob:");
                if (blobStart >= 0) {
                    urlWithoutParams = urlWithoutParams.substr(blobStart);
                    url = urlWithoutParams;

                    image = new Image();

                    // Call success callback after opening Texture
                    image.onload = () => {
                        callback(null, image);
                    };

                    // Call error callback with details.
                    image.onerror = event => {
                        callback(pc.string.format("Error loading Texture from: '{0}'", url));
                    };

                    image.src = url;
                } else {
                    // Unsupported texture extension
                    // Use timeout because asset events can be hooked up after load gets called in some
                    // cases. For example, material loads a texture on 'add' event.
                    setTimeout(() => {
                        callback(pc.string.format("Error loading Texture: format not supported: '{0}'", ext));
                    }, 0);
                }
            }
        }

        open(url, data) {
            if (! url)
                return;

            let texture;
            const ext = pc.path.getExtension(url).toLowerCase();
            let format = null;

            // Every browser seems to pass data as an Image type. For some reason, the XDK
            // passes an HTMLImageElement. TODO: figure out why!
            // DDS textures are ArrayBuffers
            if ((data instanceof Image) || (data instanceof HTMLImageElement)) { // PNG, JPG or GIF
                const img = data;

                format = (ext === ".jpg" || ext === ".jpeg") ? pc.PIXELFORMAT_R8_G8_B8 : pc.PIXELFORMAT_R8_G8_B8_A8;
                texture = new pc.Texture(this._device, {
                    // #ifdef PROFILER
                    profilerHint: pc.TEXHINT_ASSET,
                    // #endif
                    width: img.width,
                    height: img.height,
                    format
                });
                texture.setSource(img);

            } else if (data instanceof ArrayBuffer) { // DDS or CRN
                if (ext === ".crn") {
                    // Copy loaded file into Emscripten-managed memory
                    const srcSize = data.byteLength;
                    const bytes = new Uint8Array(data);
                    const src = Module._malloc(srcSize);
                    arrayBufferCopy(bytes, Module.HEAPU8, src, srcSize);

                    // Decompress CRN to DDS (minus the header)
                    const dst = Module._crn_decompress_get_data(src, srcSize);
                    const dstSize = Module._crn_decompress_get_size(src, srcSize);

                    data = Module.HEAPU8.buffer.slice(dst, dst + dstSize);
                }

                // DDS loading
                const header = new Uint32Array(data, 0, 128 / 4);

                const width = header[4];
                const height = header[3];
                const mips = Math.max(header[7], 1);
                const isFourCc = header[20] === 4;
                const fcc = header[21];
                const bpp = header[22];
                const isCubemap = header[28] === 65024; // TODO: check by bitflag

                const FCC_DXT1 = 827611204; // DXT1
                const FCC_DXT5 = 894720068; // DXT5
                const FCC_FP32 = 116; // RGBA32f

                // non standard
                const FCC_ETC1 = 826496069;
                const FCC_PVRTC_2BPP_RGB_1 = 825438800;
                const FCC_PVRTC_2BPP_RGBA_1 = 825504336;
                const FCC_PVRTC_4BPP_RGB_1 = 825439312;
                const FCC_PVRTC_4BPP_RGBA_1 = 825504848;

                let compressed = false;
                let floating = false;
                let etc1 = false;
                let pvrtc2 = false;
                let pvrtc4 = false;
                if (isFourCc) {
                    if (fcc===FCC_DXT1) {
                        format = pc.PIXELFORMAT_DXT1;
                        compressed = true;
                    } else if (fcc===FCC_DXT5) {
                        format = pc.PIXELFORMAT_DXT5;
                        compressed = true;
                    } else if (fcc===FCC_FP32) {
                        format = pc.PIXELFORMAT_RGBA32F;
                        floating = true;
                    } else if (fcc===FCC_ETC1) {
                        format = pc.PIXELFORMAT_ETC1;
                        compressed = true;
                        etc1 = true;
                    } else if (fcc===FCC_PVRTC_2BPP_RGB_1 || fcc===FCC_PVRTC_2BPP_RGBA_1) {
                        format = fcc===FCC_PVRTC_2BPP_RGB_1? pc.PIXELFORMAT_PVRTC_2BPP_RGB_1 : pc.PIXELFORMAT_PVRTC_2BPP_RGBA_1;
                        compressed = true;
                        pvrtc2 = true;
                    } else if (fcc===FCC_PVRTC_4BPP_RGB_1 || fcc===FCC_PVRTC_4BPP_RGBA_1) {
                        format = fcc===FCC_PVRTC_4BPP_RGB_1? pc.PIXELFORMAT_PVRTC_4BPP_RGB_1 : pc.PIXELFORMAT_PVRTC_4BPP_RGBA_1;
                        compressed = true;
                        pvrtc4 = true;
                    }
                } else {
                    if (bpp===32) {
                        format = pc.PIXELFORMAT_R8_G8_B8_A8;
                    }
                }

                if (! format) {
                    // #ifdef DEBUG
                    console.error("This DDS pixel format is currently unsupported. Empty texture will be created instead.");
                    // #endif
                    texture = new pc.Texture(this._device, {
                        width: 4,
                        height: 4,
                        format: pc.PIXELFORMAT_R8_G8_B8
                    });
                    return texture;
                }

                const texOptions = {
                    // #ifdef PROFILER
                    profilerHint: pc.TEXHINT_ASSET,
                    // #endif
                    width,
                    height,
                    format,
                    cubemap: isCubemap
                };
                texture = new pc.Texture(this._device, texOptions);
                if (isCubemap) {
                    texture.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
                    texture.addressV = pc.ADDRESS_CLAMP_TO_EDGE;
                }

                let offset = 128;
                const faces = isCubemap? 6 : 1;
                let mipSize;
                const DXT_BLOCK_WIDTH = 4;
                const DXT_BLOCK_HEIGHT = 4;
                const blockSize = fcc===FCC_DXT1? 8 : 16;
                let numBlocksAcross, numBlocksDown, numBlocks;
                for (let face=0; face<faces; face++) {
                    let mipWidth = width;
                    let mipHeight = height;
                    for (let i=0; i<mips; i++) {
                        if (compressed) {
                            if (etc1) {
                                mipSize = Math.floor((mipWidth + 3) / 4) * Math.floor((mipHeight + 3) / 4) * 8;
                            } else if (pvrtc2) {
                                mipSize = Math.max(mipWidth, 16) * Math.max(mipHeight, 8) / 4;
                            } else if (pvrtc4) {
                                mipSize = Math.max(mipWidth, 8) * Math.max(mipHeight, 8) / 2;
                            } else {
                                numBlocksAcross = Math.floor((mipWidth + DXT_BLOCK_WIDTH - 1) / DXT_BLOCK_WIDTH);
                                numBlocksDown = Math.floor((mipHeight + DXT_BLOCK_HEIGHT - 1) / DXT_BLOCK_HEIGHT);
                                numBlocks = numBlocksAcross * numBlocksDown;
                                mipSize = numBlocks * blockSize;
                            }
                        } else {
                            mipSize = mipWidth * mipHeight * 4;
                        }

                        const mipBuff = floating? new Float32Array(data, offset, mipSize) : new Uint8Array(data, offset, mipSize);
                        if (!isCubemap) {
                            texture._levels[i] = mipBuff;
                        } else {
                            if (!texture._levels[i]) texture._levels[i] = [];
                            texture._levels[i][face] = mipBuff;
                        }
                        offset += floating? mipSize * 4 : mipSize;
                        mipWidth = Math.max(mipWidth * 0.5, 1);
                        mipHeight = Math.max(mipHeight * 0.5, 1);
                    }
                }

                texture.upload();
            }
            return texture;
        }

        patch({resource, name, data}, assets) {
            const texture = resource;

            if (! texture)
                return;

            if (texture.name !== name)
                texture.name = name;

            if (data.hasOwnProperty('minfilter') && texture.minFilter !== JSON_FILTER_MODE[data.minfilter])
                texture.minFilter = JSON_FILTER_MODE[data.minfilter];

            if (data.hasOwnProperty('magfilter') && texture.magFilter !== JSON_FILTER_MODE[data.magfilter])
                texture.magFilter = JSON_FILTER_MODE[data.magfilter];

            if (data.hasOwnProperty('addressu') && texture.addressU !== JSON_ADDRESS_MODE[data.addressu])
                texture.addressU = JSON_ADDRESS_MODE[data.addressu];

            if (data.hasOwnProperty('addressv') && texture.addressV !== JSON_ADDRESS_MODE[data.addressv])
                texture.addressV = JSON_ADDRESS_MODE[data.addressv];

            if (data.hasOwnProperty('mipmaps') && texture.mipmaps !== data.mipmaps)
                texture.mipmaps = data.mipmaps;

            if (data.hasOwnProperty('anisotropy') && texture.anisotropy !== data.anisotropy)
                texture.anisotropy = data.anisotropy;

            const rgbm = !!data.rgbm;
            if (data.hasOwnProperty('rgbm') && texture.rgbm !== rgbm)
                texture.rgbm = rgbm;
        }
    }

    return {
        TextureHandler
    };
})());
