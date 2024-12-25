import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready() // aguarda a inicialização da aplicação
  })

  afterAll(async () => {
    await app.close() // aguarda o encerramento da aplicação
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`) // cria o cabeçalho da requisição
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '(47) 9 9999-9999',
        latitude: -26.914792,
        longitude: -49.069685,
      })

    expect(response.statusCode).toEqual(201)
  })
})
