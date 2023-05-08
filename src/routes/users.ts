import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      username: z.string(),
    })

    const { username } = createUserBodySchema.parse(request.body)

    const userWithSameUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (userWithSameUsername) {
      return await reply.status(409).send({ message: 'user already exists' })
    }

    await prisma.user.create({
      data: {
        username,
      },
    })

    return await reply.status(201).send()
  })
}
