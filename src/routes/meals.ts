import { type FastifyInstance } from 'fastify'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', { preHandler: [checkUserIdExists] }, async (request, reply) => {
    const user_id = String(request.headers.user_id)

    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      created_at: z.string(),
      in_diet: z.boolean(),
    })

    const { name, description, created_at, in_diet } =
      createMealBodySchema.parse(request.body)

    await prisma.meal.create({
      data: {
        name,
        description,
        created_at: new Date(created_at),
        in_diet,
        user_id,
      },
    })

    return reply.status(201).send()
  })

  app.put(
    '/:id',
    { preHandler: [checkUserIdExists] },
    async (request, reply) => {
      const user_id = String(request.headers.user_id)

      const updateMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const params = updateMealParamsSchema.parse(request.params)

      const meal = await prisma.meal.findFirst({
        where: {
          id: params.id,
          user_id,
        },
      })

      if (!meal) {
        return reply
          .status(401)
          .send({ message: 'Meal not found for this user' })
      }

      const updateMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        created_at: z.string(),
        in_diet: z.boolean(),
      })

      const { name, description, created_at, in_diet } =
        updateMealBodySchema.parse(request.body)

      await prisma.meal.update({
        data: {
          name,
          description,
          created_at: new Date(created_at),
          in_diet,
        },
        where: {
          id: params.id,
        },
      })

      return reply.status(204).send()
    },
  )
}
