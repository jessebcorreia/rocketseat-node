import { parse } from "csv";
import { createReadStream } from "node:fs";

export async function uploadCsvHandler(request, response) {
  const csvPath = new URL("../../tasks.csv", import.meta.url);

  const stream = createReadStream(csvPath); //stream de leitura

  const csvParse = parse({
    //stream de transformação
    delimiter: ",",
    skipEmptyLines: true,
    fromLine: 2,
  });

  await run(stream, csvParse);

  return response.writeHead(201).end();
}

async function run(stream, csvParse) {
  const linesParse = stream.pipe(csvParse); //conexão entre as streams leitura > transformação

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch("http://localhost:3333/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    console.log("-Origem: Stream CSV");

    await wait(1000);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
