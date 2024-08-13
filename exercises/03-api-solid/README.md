# App

GymPass style app.

## RFs (Requisitos Funcionais)

DEVE SER POSSÍVEL:

- [ ] se cadastrar;
- [ ] se autenticar;
- [ ] obter o perfil de um usuário logado;
- [ ] obter o número de check-ins realizados pelo usuário logado;
- [ ] o usuário obter seu histórico de check-ins;
- [ ] o usuário buscar academias próximas;
- [ ] o usuário buscar academias pelo nome;
- [ ] o usuário realizar check-in em uma academia;
- [ ] validar o check-in de um usuário;
- [ ] cadastrar uma academia;

## RNs (Regras de Negócio)

- [ ] o usuário não pode se cadastrar com um e-mail duplicado;
- [ ] o usuário não pode fazer 2 check-ins no mesmo dia;
- [ ] o usuário não pode fazer checkin se não estiver perto (100m) da academia;
- [ ] o check-in só pode ser validado até 20 minutos após criado;
- [ ] o check-in só pode ser validado por administradores;
- [ ] a academia só pode ser cadastrada por administradores;

## RNFs (Requisitos Não Funcionais)

- [ ] a senha do usuário precisa estar criptografada;
- [ ] os dados da aplicação precisam estar persistidos em um banco de dados PostgreSQL;
- [ ] todas as listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT (JSON Web Token);
