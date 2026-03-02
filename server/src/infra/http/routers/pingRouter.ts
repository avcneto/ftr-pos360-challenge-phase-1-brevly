import { error } from "console"
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"

export const pingRouter: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/ping',
    {
      schema: {
        summary: 'Ping the server',
        tags: ['Health'],
        response: {
          200: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send({ message: 'Pong' })
    }
  )
}