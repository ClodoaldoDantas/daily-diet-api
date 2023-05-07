import { app } from './app'
import { env } from './env'

app.get('/', (request, reply) => {
  return reply.status(200).send({ message: 'Hello World 🚀' })
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('server running 🔥')
  })
