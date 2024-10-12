import { it, expect, describe, beforeEach } from 'vitest'
import { GymsRepository } from '@/repositories/gyms-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: GymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Cases', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able do create a new gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: -26.914792,
      longitude: -49.069685,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
