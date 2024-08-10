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

  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }

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

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => {
      return row.id === id;
    });

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => {
      return row.id === id;
    });

    console.log(rowIndex);
    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
    }
  }
}
