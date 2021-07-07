
export default class Stream {

    constructor (data) {
        this.data = data;
        this.len = this.data.length;
        this.pos = 0;
    }

    readByte () {
        if (this.pos >= this.data.length) {
            throw new Error('Attempted to read past end of stream.');
        }
        if (this.data instanceof Uint8Array)
            return this.data[this.pos++];
        else
            return this.data.charCodeAt(this.pos++) & 0xFF;
    }

    readBytes (n) {
        const bytes = [];
        for (let i = 0; i < n; i++) {
            bytes.push(this.readByte());
        }
        return bytes;
    }

    read (n) {
        let s = '';
        for (let i = 0; i < n; i++) {
            s += String.fromCharCode(this.readByte());
        }
        return s;
    }

    readUnsigned () { // Little-endian.
        const a = this.readBytes(2);
        return (a[1] << 8) + a[0];
    }
}
