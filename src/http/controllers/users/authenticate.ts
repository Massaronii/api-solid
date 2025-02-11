import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { InvalidCredentialsError } from '@/use-cases/erros/invalid-credentials-error'
import { makeAuthenticateUseCases } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchemma = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchemma.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCases()

    const { user } = await authenticateUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'strict',
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
