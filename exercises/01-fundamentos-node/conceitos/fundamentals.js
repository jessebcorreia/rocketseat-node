import { Readable, Writable, Transform } from "node:stream";

class OneToHundredStream extends Readable {
  index = 1;

  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 100) {
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));
        this.push(buf);
      }
    }, 100);
  }
}

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    const buf = Number(chunk.toString());
    console.log(buf * 10);
    callback();
  }
}

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const buf = Number(chunk.toString());
    const transformed = String(buf * -1);
    callback(null, Buffer.from(transformed));
  }
}

new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream());
