import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

import { PING_RESPONSE_MESSAGE, PING_ROUTE } from './ping.constants'

const pingResponseSchema = z.object({
  message: z.string().describe('Health check response message'),
}).meta({
  example: {
    message: PING_RESPONSE_MESSAGE,
  },
})

export const pingRouter: FastifyPluginAsyncZod = async (server) => {
  server.get(
    PING_ROUTE,
    {
      schema: {
        summary: 'Ping the server',
        description: 'Checks if the API server is running and responsive.',
        tags: ['Health'],
        response: {
          200: pingResponseSchema,
        },
      },
    },
    async (request, reply) => {
      return reply.status(200).send({ message: PING_RESPONSE_MESSAGE })
    }
  )
}