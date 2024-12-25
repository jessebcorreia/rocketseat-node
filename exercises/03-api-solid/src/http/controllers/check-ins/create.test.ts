import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (e2e)', () => {
  beforeAll(async () => {
    await app.ready() // aguarda a inicialização da aplicação
  })

  afterAll(async () => {
    await app.close() // aguarda o encerramento da aplicação
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        latitude: -26.914792,
        longitude: -49.069685,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`) // cria o cabeçalho da requisição
      .send({
        latitude: -26.914792,
        longitude: -49.069685,
      })

    expect(response.statusCode).toEqual(201)
  })
})
