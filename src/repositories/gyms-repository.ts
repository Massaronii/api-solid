import { Gym, Prisma } from '@prisma/client'

export interface findManyNearByParams {
  latitude: number
  longitude: number
}
export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findManyNearBy(params: findManyNearByParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  findById(id: string): Promise<Gym | null>
}
