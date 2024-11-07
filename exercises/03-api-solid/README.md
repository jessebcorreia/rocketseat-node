# App

GymPass style app.

## RFs (Requisitos Funcionais)

### DEVE SER POSSÍVEL:
- [x] se cadastrar;
- [x] se autenticar;
- [x] obter o perfil de um usuário logado;
- [x] obter o número de check-ins realizados pelo usuário logado;
- [x] o usuário obter seu histórico de check-ins;
- [x] o usuário buscar academias próximas (até 10km);
- [x] o usuário buscar academias pelo nome;
- [x] o usuário realizar check-in em uma academia;
- [x] validar o check-in de um usuário;
- [x] cadastrar uma academia;

## RNs (Regras de Negócio)

- [x] o usuário não pode se cadastrar com um e-mail duplicado;
- [x] o usuário não pode fazer 2 check-ins no mesmo dia;
- [x] o usuário não pode fazer checkin se não estiver perto (100m) da academia;
- [x] o check-in só pode ser validado até 20 minutos após criado;
- [ ] o check-in só pode ser validado por administradores;
- [ ] a academia só pode ser cadastrada por administradores;

## RNFs (Requisitos Não Funcionais)

- [x] a senha do usuário precisa estar criptografada;
- [x] os dados da aplicação precisam estar persistidos em um banco de dados PostgreSQL;
- [x] todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);
