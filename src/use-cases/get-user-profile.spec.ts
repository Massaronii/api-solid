import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import bcrypt from 'bcryptjs'
import { ResourceNotFound } from './erros/resource-not-found'
import { GetUserProfileUseCase } from './get-user-profile'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await bcrypt.hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })
    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('John Doe')
  })

  it('should not be able to get user profile with wrong user id', async () => {
    await expect(
      sut.execute({
        userId: 'non-existent-user-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
