import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './erros/max-distance-error'
import { MaxNumberOfCheckInsError } from './erros/max-numbers-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: '1',
      title: 'Gym 1',
      latitude: -27.0747279,
      longitude: -49.4889672,
      phone: '+123456789',
      description: 'Description',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to Check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: '1',
      userId: '1',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to Check in in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: '1',
      userId: '1',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    await expect(
      sut.execute({
        gymId: '1',
        userId: '1',
        userLatitude: -27.0747279,
        userLongitude: -49.4889672,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should not be able to Check in in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: '1',
      userId: '1',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    vi.setSystemTime(new Date(2022, 0, 29, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: '1',
      userId: '1',
      userLatitude: -27.0747279,
      userLongitude: -49.4889672,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not  be able to Check in on distant gym', async () => {
    gymsRepository.items.push({
      id: '2',
      title: 'Gym 2',
      latitude: new Decimal(-27.0747279),
      longitude: new Decimal(-49.4889672),
      phone: '',
      description: 'Description',
    })

    await expect(
      sut.execute({
        gymId: '2',
        userId: '1',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
