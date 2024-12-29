import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateUseCase

describe('Validate Check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateUseCase(checkInsRepository)

    // await gymsRepository.create({
    //   id: '1',
    //   title: 'Gym 1',
    //   latitude: -27.0747279,
    //   longitude: -49.4889672,
    //   phone: '+123456789',
    //   description: 'Description',
    // })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to Validate the check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: '1',
      user_id: '1',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to Validate an inexistent the check in', async () => {
    await expect(
      sut.execute({
        checkInId: 'inexistent checkInId',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to Validate the check in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 1, 13, 40))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: '1',
      user_id: '1',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
