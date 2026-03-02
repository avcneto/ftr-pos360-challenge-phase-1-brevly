import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { PING_RESPONSE_MESSAGE, PING_ROUTE } from './ping.constants'
import { pingRouter } from './pingRouter'

describe('ping router', () => {
  const app = fastify()

  beforeAll(async () => {
    app.setValidatorCompiler(validatorCompiler)
    app.setSerializerCompiler(serializerCompiler)

    await app.register(pingRouter)
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return pong', async () => {
    const response = await app.inject({
      method: 'GET',
      url: PING_ROUTE,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ message: PING_RESPONSE_MESSAGE })
  })
})
