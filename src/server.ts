import { app } from './app'

app.get('/', (request, reply) => {
  return reply.status(200).send({ message: 'Hello World 🚀' })
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('server running 🔥')
  })
