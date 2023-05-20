import { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'
import { prisma } from '../lib/prisma'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkUserIdExists)

  app.post('/', async (request, reply) => {
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

  app.put('/:id', async (request, reply) => {
    const user_id = String(request.headers.user_id)

    const updateMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = updateMealParamsSchema.parse(request.params)

    const meal = await prisma.meal.findFirst({
      select: {
        id: true,
      },
      where: {
        id: params.id,
        user_id,
      },
    })

    if (!meal) {
      return reply.status(403).send()
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
  })

  app.delete('/:id', async (request, reply) => {
    const user_id = String(request.headers.user_id)

    const deleteMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = deleteMealParamsSchema.parse(request.params)

    const meal = await prisma.meal.findFirst({
      select: {
        id: true,
      },
      where: {
        id: params.id,
        user_id,
      },
    })

    if (!meal) {
      return reply.status(403).send()
    }

    await prisma.meal.delete({
      where: {
        id: params.id,
      },
    })

    return reply.status(204).send()
  })

  app.get('/', async (request, reply) => {
    const user_id = String(request.headers.user_id)

    const meals = await prisma.meal.findMany({
      where: {
        user_id,
      },
    })

    return { meals }
  })

  app.get('/:id', async (request, reply) => {
    const user_id = String(request.headers.user_id)
    const getMealParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const params = getMealParamsSchema.parse(request.params)

    const meal = await prisma.meal.findFirst({
      where: {
        user_id,
        id: params.id,
      },
    })

    if (!meal) {
      return reply.status(404).send()
    }

    return { meal }
  })
}
