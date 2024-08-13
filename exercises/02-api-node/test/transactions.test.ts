import {
  it,
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
  beforeEach,
} from 'vitest'
import { execSync } from 'node:child_process' // permite executar comandos no terminal dentro da aplicação node
import requestSupertest from 'supertest'
import { app } from '../src/app'

describe('transactions routes', () => {
  beforeAll(async () => {
    // beforeAll: executa um bloco de código (uma única vez), ANTES da execução de todos os testes
    // beforeEach: executa um bloco de código sempre ANTES da execução de cada teste
    await app.ready()
  })

  beforeEach(() => {
    // a cada teste, apaga o banco de dados e cria novamente
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  afterAll(async () => {
    // os mesmos conceitos se aplicam ao afterAll() e afterEach(). Neste caso, estou fechando o servidor e liberando espaço na memória
    await app.close()
  })

  test('user can create a new transaction', async () => {
    // O supertest, nomeado como 'requestSupertest' precisa receber como argumento o (servidor node)
    const response = await requestSupertest(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })
    // .expect(201) - também poderia ser utilizada dessa forma, ao final .expect

    expect(response.statusCode).toEqual(201)
  })

  it('should be able to list all transactions', async () => {
    // a sintaxe it possui a mesma função de test
    // para listar uma transação, eu preciso antes ter criado uma para gerar o sessionId
    // os testes precisam estar isolados (não posso depender de outro teste para executar este)
    // então, eu executo novamente a rota para criar uma nova transação

    const createTransactionResponse = await requestSupertest(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    // const cookies = createTransactionResponse.header.cookies
    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await requestSupertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    // validação do objeto de resposta (não preciso especificar todas as propriedades do objeto)
    // eu preciso especificar body.transactions, pela forma como estou retornando a resposta da requisição
    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({ title: 'New Transaction', amount: 5000 }),
    ])
  })

  it('should be able to get a specific transaction', async () => {
    // verificar comentários do teste anterior

    const createTransactionResponse = await requestSupertest(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie') ?? []

    const listTransactionsResponse = await requestSupertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const { id: transactionId } = listTransactionsResponse.body.transactions[0]

    const getTransactionByIdResponse = await requestSupertest(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies) // define o cabeçalho da requisição, inserindo o cookie para que seja listado pela query
      .expect(200)

    expect(getTransactionByIdResponse.body.transaction).toEqual(
      expect.objectContaining({ title: 'New Transaction', amount: 5000 }),
    )
  })

  it('should be able to list get the summary of transactions', async () => {
    // verificar comentários do teste para listar todas as transações

    const createCreditTransactionResponse = await requestSupertest(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createCreditTransactionResponse.get('Set-Cookie') ?? []

    const createDebitTransactionResponse = await requestSupertest(app.server)
      .post('/transactions')
      .set('Cookie', cookies) // define os cookies no cabeçalho da requisição (se houver sessionId no cabeçalho, a requisição irá vincular o lançamento ao usuário)
      .send({
        title: 'New Transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await requestSupertest(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    expect(summaryResponse.body.summary).toEqual(
      expect.objectContaining({ amount: 3000 }),
    )
  })
})
