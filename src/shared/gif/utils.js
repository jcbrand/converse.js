
function bitsToNum (ba) {
    return ba.reduce(function (s, n) {
        return s * 2 + n;
    }, 0);
}

function byteToBitArr (bite) {
    const a = [];
    for (let i = 7; i >= 0; i--) {
        a.push( !! (bite & (1 << i)));
    }
    return a;
}

function lzwDecode (minCodeSize, data) {
    // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
    let pos = 0; // Maybe this streaming thing should be merged with the Stream?
    function readCode (size) {
        let code = 0;
        for (let i = 0; i < size; i++) {
            if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                code |= 1 << i;
            }
            pos++;
        }
        return code;
    }

    const output = [];
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;

    let codeSize = minCodeSize + 1;
    let dict = [];

    const clear = function () {
        dict = [];
        codeSize = minCodeSize + 1;
        for (let i = 0; i < clearCode; i++) {
            dict[i] = [i];
        }
        dict[clearCode] = [];
        dict[eoiCode] = null;
    };

    let code;
    let last;

    while (true) { // eslint-disable-line no-constant-condition
        last = code;
        code = readCode(codeSize);

        if (code === clearCode) {
            clear();
            continue;
        }
        if (code === eoiCode) break;

        if (code < dict.length) {
            if (last !== clearCode) {
                dict.push(dict[last].concat(dict[code][0]));
            }
        }
        else {
            if (code !== dict.length) throw new Error('Invalid LZW code.');
            dict.push(dict[last].concat(dict[last][0]));
        }
        output.push.apply(output, dict[code]);

        if (dict.length === (1 << codeSize) && codeSize < 12) {
            // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
            codeSize++;
        }
    }
    // I don't know if this is technically an error, but some GIFs do it.
    //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
    return output;
}


// The actual parsing; returns an object with properties.
export function parseGIF (st, handler) {
    handler || (handler = {});

    // LZW (GIF-specific)
    function parseCT (entries) { // Each entry is 3 bytes, for RGB.
        const ct = [];
        for (let i = 0; i < entries; i++) {
            ct.push(st.readBytes(3));
        }
        return ct;
    }

    function readSubBlocks () {
        let size, data;
        data = '';
        do {
            size = st.readByte();
            data += st.read(size);
        } while (size !== 0);
        return data;
    }

    function parseHeader () {
        const hdr = {};
        hdr.sig = st.read(3);
        hdr.ver = st.read(3);
        if (hdr.sig !== 'GIF') throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
        hdr.width = st.readUnsigned();
        hdr.height = st.readUnsigned();

        const bits = byteToBitArr(st.readByte());
        hdr.gctFlag = bits.shift();
        hdr.colorRes = bitsToNum(bits.splice(0, 3));
        hdr.sorted = bits.shift();
        hdr.gctSize = bitsToNum(bits.splice(0, 3));

        hdr.bgColor = st.readByte();
        hdr.pixelAspectRatio = st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
        if (hdr.gctFlag) {
            hdr.gct = parseCT(1 << (hdr.gctSize + 1));
        }
        handler.hdr && handler.hdr(hdr);
    }

    function parseExt (block) {
        function parseGCExt (block) {
            st.readByte(); // blocksize, always 4
            const bits = byteToBitArr(st.readByte());
            block.reserved = bits.splice(0, 3); // Reserved; should be 000.
            block.disposalMethod = bitsToNum(bits.splice(0, 3));
            block.userInput = bits.shift();
            block.transparencyGiven = bits.shift();
            block.delayTime = st.readUnsigned();
            block.transparencyIndex = st.readByte();
            block.terminator = st.readByte();
            handler.gce && handler.gce(block);
        }

        function parseComExt (block) {
            block.comment = readSubBlocks();
            handler.com && handler.com(block);
        }

        function parsePTExt (block) {
            // No one *ever* uses this. If you use it, deal with parsing it yourself.
            st.readByte(); // blocksize, always 12
            block.ptHeader = st.readBytes(12);
            block.ptData = readSubBlocks();
            handler.pte && handler.pte(block);
        }

        function parseAppExt (block) {
            function parseNetscapeExt (block) {
                st.readByte(); // blocksize, always 3
                block.unknown = st.readByte(); // ??? Always 1? What is this?
                block.iterations = st.readUnsigned();
                block.terminator = st.readByte();
                handler.app && handler.app.NETSCAPE && handler.app.NETSCAPE(block);
            }

            function parseUnknownAppExt (block) {
                block.appData = readSubBlocks();
                // FIXME: This won't work if a handler wants to match on any identifier.
                handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
            }

            st.readByte(); // blocksize, always 11
            block.identifier = st.read(8);
            block.authCode = st.read(3);
            switch (block.identifier) {
                case 'NETSCAPE':
                    parseNetscapeExt(block);
                    break;
                default:
                    parseUnknownAppExt(block);
                    break;
            }
        }

        function parseUnknownExt (block) {
            block.data = readSubBlocks();
            handler.unknown && handler.unknown(block);
        }

        block.label = st.readByte();
        switch (block.label) {
            case 0xF9:
                block.extType = 'gce';
                parseGCExt(block);
                break;
            case 0xFE:
                block.extType = 'com';
                parseComExt(block);
                break;
            case 0x01:
                block.extType = 'pte';
                parsePTExt(block);
                break;
            case 0xFF:
                block.extType = 'app';
                parseAppExt(block);
                break;
            default:
                block.extType = 'unknown';
                parseUnknownExt(block);
                break;
        }
    }

    function parseImg (img) {
        function deinterlace (pixels, width) {
            // Of course this defeats the purpose of interlacing. And it's *probably*
            // the least efficient way it's ever been implemented. But nevertheless...
            const newPixels = new Array(pixels.length);
            const rows = pixels.length / width;
            function cpRow (toRow, fromRow) {
                const fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
            }

            // See appendix E.
            const offsets = [0, 4, 2, 1];
            const steps = [8, 8, 4, 2];

            let fromRow = 0;
            for (let pass = 0; pass < 4; pass++) {
                for (let toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                    cpRow(toRow, fromRow)
                    fromRow++;
                }
            }

            return newPixels;
        }

        img.leftPos = st.readUnsigned();
        img.topPos = st.readUnsigned();
        img.width = st.readUnsigned();
        img.height = st.readUnsigned();

        const bits = byteToBitArr(st.readByte());
        img.lctFlag = bits.shift();
        img.interlaced = bits.shift();
        img.sorted = bits.shift();
        img.reserved = bits.splice(0, 2);
        img.lctSize = bitsToNum(bits.splice(0, 3));

        if (img.lctFlag) {
            img.lct = parseCT(1 << (img.lctSize + 1));
        }

        img.lzwMinCodeSize = st.readByte();

        const lzwData = readSubBlocks();

        img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);

        if (img.interlaced) { // Move
            img.pixels = deinterlace(img.pixels, img.width);
        }

        handler.img && handler.img(img);
    }

    function parseBlock () {
        const block = {}
        block.sentinel = st.readByte();

        switch (String.fromCharCode(block.sentinel)) { // For ease of matching
            case '!':
                block.type = 'ext';
                parseExt(block);
                break;
            case ',':
                block.type = 'img';
                parseImg(block);
                break;
            case ';':
                block.type = 'eof';
                handler.eof && handler.eof(block);
                break;
            default:
                throw new Error('Unknown block: 0x' + block.sentinel.toString(16)); // TODO: Pad this with a 0.
        }

        if (block.type !== 'eof') setTimeout(parseBlock, 0);
    }

    function parse () {
        parseHeader();
        setTimeout(parseBlock, 0);
    }

    parse();
}
