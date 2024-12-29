import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get user metrics use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check ins count from metrics', async () => {
    await checkInsRepository.create({
      user_id: '01',
      gym_id: '01',
    })

    await checkInsRepository.create({
      user_id: '01',
      gym_id: '02',
    })

    const { checkInsCount } = await sut.execute({
      userId: '01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
