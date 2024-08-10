import { Transform } from "node:stream";
import http from "node:http";

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const buf = Number(chunk.toString());
    const transformed = String(buf * -1);

    console.log(transformed);

    callback(null, Buffer.from(transformed));
  }
}

const server = http.createServer(async (req, res) => {
  const buffers = [];

  for await (const chunk of req) {
    buffers.push(chunk);
  }

  const fullStreamContent = Buffer.concat(buffers).toString();

  console.log(fullStreamContent);

  return res.end(fullStreamContent);

  //req.pipe(new InverseNumberStream()).pipe(res);
});

server.listen(3334);
