import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('fetch Check-in history use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch user check-in history', async () => {
    await checkInsRepository.create({
      user_id: '01',
      gym_id: '01',
    })

    await checkInsRepository.create({
      user_id: '01',
      gym_id: '02',
    })

    const { checkIns } = await sut.execute({
      userId: '01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: '01',
      }),
      expect.objectContaining({
        gym_id: '02',
      }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        user_id: '01',
        gym_id: String(i),
      })
    }

    const { checkIns } = await sut.execute({
      userId: '01',
      page: 2,
    })

    console.log(checkIns)

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({
        gym_id: '21',
      }),
      expect.objectContaining({
        gym_id: '22',
      }),
    ])
  })
})
