# Daily Diet API

Desafio 02 da Formação NodeJS - RocketSeat.

Em síntese, o desafio consiste em construir uma API simples que permita criar usuários e vincular refeições a estes usuários, em um banco de dados relacional.

Para começar a usar a API, execute os seguintes comandos no terminal:

```bash
npm run knex -- migrate:latest

npm run dev
```

## 1. Explicação das Rotas

Esta API possui apenas duas rotas:

- **`/user`** para cadastrar e gerenciar usuários;
- **`/meals`** para cadastrar e gerenciar as refeições vinculadas a estes usuários;
  Abaixo estarão listados os métodos HTTP e a explicação de sua funcionalidade dentro da API.

---

#### **1.1. Criar novo usuário**

- **URL**: `/user`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body Parameters**:

  - `name` (string, obrigatório)
  - `email` (string, obrigatório)
  - `password` (string, obrigatório, 8 a 20 caracteres, com letras maiúsculas e minúsculas, números e caracteres especiais)

- **Reply**:

  - **✔️ 201 Created**: Retorna o usuário criado (também estou deletando o cookie `sessionId`, para que, caso exista algum usuário logado, ele seja deslogado).
  - **❌ 400 Bad Request**: Se algum campo obrigatório estiver ausente ou inválido.

- **Request Example**:
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "Password123@"
  }
  ```

---

#### **1.2. Fazer login do usuário**

- **URL**: `/user/login`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body Parameters**:

  - `email` (string, obrigatório)
  - `password` (string, obrigatório)

- **Reply**:

  - **✔️ 200 OK**: Retorna as informações do usuário e registra um cookie no navegador com a `sessionId`, usada para identificar o usuário nas requisições.
  - **❌ 401 Unauthorized**: Se algum campo obrigatório estiver ausente ou inválido.

- **Request Example**:
  ```json
  {
    "email": "johndoe@example.com",
    "password": "Password123@"
  }
  ```

---

#### **1.3. Listar as métricas do usuário logado**

- **URL**: `/user/metrics`
- **Method**: `GET`
- **Reply**:
  - **✔️ 200 OK**: Retorna as métricas do usuário logado, caso existam refeições cadastradas.
  - **❌ 401 Unauthorized**: Se o usuário não estiver autenticado.

---

#### **1.4. Listar dados do usuário logado**

- **URL**: `/user`
- **Method**: `GET`

- **Reply**:
  - **✔️ 200 OK**: Retorna as informações do usuário, se ele estiver logado (para a validação do login, é feita uma consulta no banco de dados para verificar se o valor do cookie `sessionId` está vinculado a algum usuário).
  - **❌ 401 Unauthorized**: Se o usuário não estiver autenticado.

---

#### **1.5. Atualizar informações do usuário logado**

- **URL**: `/user`
- **Method**: `PUT`
- **Content-Type**: `application/json`
- **Body Parameters**:

  - `name` (string, opcional)
  - `email` (string, opcional)
  - `oldPassword` (string, opcional, mas pode ser obrigatória caso o usuário esteja tentando alterar a senha atual)
  - `password` (string, opcional, com as mesmas validações da criação)

- **Reply**:

  - **✔️ 200 OK**: Retorna uma mensagem indicando que as informações do usuário foram atualizadas.
  - **❌ 400 Bad Request**: Se algum campo obrigatório estiver ausente ou inválido, ou se nenhum campo for informado para atualização.
  - **❌ 401 Unauthorized**: Se não houver usuário autenticado.

- **Request Example**:
  ```json
  {
    "name": "John",
    "email": "john@example.com",
    "oldPassword": "Password123@",
    "password": "@321Password"
  }
  ```

---

#### **1.6. Deletar usuário logado**

- **URL**: `/user`
- **Method**: `DELETE`

- **Reply**:
  - **✔️ 200 OK**: Retorna uma mensagem indicando que o usuário foi deletado, e remove o cookie `sessionId`.
  - **❌ 401 Unauthorized**: Se não houver usuário autenticado.

---

#### **1.7. Criar nova refeição para o usuário logado**

- **URL**: `/meals`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Body Parameters**:

  - `name` (string, obrigatório)
  - `description` (string, opcional, nulo por padrão)
  - `date` (date, opcional, data atual por padrão)
  - `isMealOnDietPlan` (boolean, opcional, falso por padrão)

- **Reply**:

  - **✔️ 201 Created**: Retorna a refeição criada (vinculada ao usuário logado).
  - **❌ 400 Bad Request**: Se algum campo obrigatório estiver ausente ou inválido.
  - **❌ 401 Unauthorized**: Se não houver usuário autenticado.

- **Request Example**:
  ```json
  {
    "name": "Batata doce e frango",
    "description": "Refeição pra ficar monstro",
    "isMealOnDietPlan": true
  }
  ```

---

#### **1.8. Listar todas as refeições do usuário logado**

- **URL**: `/meals`
- **Method**: `GET`
- **Reply**:

  - **✔️ 200 OK**: Retorna um array de objetos, com todas as refeições que o usuário cadastrou.
  - **❌ 401 Unauthorized**: Se não houver usuário autenticado.

---

#### **1.9. Listar refeição específica pelo ID**

- **URL**: `/meals/:id`
- **Method**: `GET`
- **Reply**:

  - **✔️ 200 OK**: Retorna a refeição selecionada pelo id, se encontrada.
  - **❌ 400 Bad Request**: Se o ID da refeição não for informado
  - **❌ 401 Unauthorized**: Se não houver usuário autenticado.
  - **❌ 404 Not Found**: Se o ID da refeição for informado mas não for encontrado no banco de dados.

---

#### **1.10. Atualizar refeição específica pelo ID**

- **URL**: `/meals/:id`
- **Method**: `PUT`
- **Content-Type**: `application/json`
- **Body Parameters**:

  - `name` (string, opcional)
  - `description` (string, opcional)
  - `date` (date, opcional)
  - `isMealOnDietPlan` (boolean, opcional)

- **Reply**:

  - **✔️ 200 OK**: Retorna uma mensagem indicando que a refeição foi atualizada.
  - **❌ 400 Bad Request**: Se algum campo obrigatório estiver ausente ou inválido, ou se o ID da refeição não tiver sido informado.
  - **❌ 401 Unauthorized**: Se não houver usuário autenticado.
  - **❌ 404 Not Found**: Se o ID da refeição for informado mas não for encontrado no banco de dados.

- **Request Example**:
  ```json
  {
    "name": "Macarronada",
    "description": "Almoço no restaurante",
    "isMealOnDietPlan": false
  }
  ```

---

#### **1.11. Deletar refeição específica pelo ID**

- **URL**: `/meals/:id`
- **Method**: `DELETE`
- **Reply**:

  - **✔️ 200 OK**: Retorna uma mensagem indicando que a refeição foi deletada.
  - **❌ 400 Bad Request**: Se o ID da refeição não for informado.
  - **❌ 401 Unauthorized**: Se não houver usuário autenticado.
  - **❌ 404 Not Found**: Se o ID da refeição for informado mas não for encontrado no banco de dados.

## 2. Requisitos do Desafio

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições (sessionId)
- [x] As refeições devem ser relacionadas a um usuário.
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta
- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou
