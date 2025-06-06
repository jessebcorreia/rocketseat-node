import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready() // aguarda a inicialização da aplicação
  })

  afterAll(async () => {
    await app.close() // aguarda o encerramento da aplicação
  })

  it('should be able to search gyms by title', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`) // cria o cabeçalho da requisição
      .send({
        title: 'JavaScript Gym',
        description: 'Some description',
        phone: '(11) 9 9999-9999',
        latitude: -26.914792,
        longitude: -49.069685,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`) // cria o cabeçalho da requisição
      .send({
        title: 'TypeScript Gym',
        description: 'Another description',
        phone: '(00) 8 8888-8888',
        latitude: -26.914792,
        longitude: -49.069685,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        q: 'JavaScript',
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
