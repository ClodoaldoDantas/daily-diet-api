import { type FastifyReply, type FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'

export async function checkUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { user_id } = request.headers

  if (!user_id) {
    return await reply.status(401).send({ message: 'user not provided' })
  }

  const userExists = await prisma.user.findUnique({
    where: {
      id: String(user_id),
    },
  })

  if (!userExists) {
    return await reply.status(401).send({ message: 'user not exists' })
  }
}
