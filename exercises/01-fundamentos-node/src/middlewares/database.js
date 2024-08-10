import fs from "node:fs/promises";

// define o caminho para o arquivo do banco de dados
const databasePath = new URL("../../db.json", import.meta.url);

export class Database {
  // # denomina uma propriedade privada da classe
  #database = {};

  constructor() {
    // sempre ao ser instanciada, a classe irá buscar os dados do arquivo db.json
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      //se o arquivo não existir, irá chamar o método #persist() para criá-lo
      .catch(() => {
        this.#persist();
      });
  }

  #persist() {
    // cria o arquivo db.json, na raíz do projeto
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table) {
    const data = this.#database[table] ?? [];
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();

    return data;
  }
}
