import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { eq, sql } from 'drizzle-orm'
import { stringify } from 'csv-stringify/sync'
import z from 'zod'

import { db } from '../../db'
import { link } from '../../db/schemas/link'
import {
  EXAMPLE_CREATED_AT,
  EXAMPLE_LINK_ID,
  EXAMPLE_ORIGINAL_URL,
  EXAMPLE_SHORT_URL,
  LINK_DELETED_SUCCESSFULLY_MESSAGE,
  LINK_NOT_FOUND_MESSAGE,
  SHORT_URL_ALREADY_EXISTS_MESSAGE,
  SHORT_URL_VALIDATION_MESSAGE,
} from './link.constants'
import { LinkRoutes } from './routes'

const linkIdParamSchema = z.object({
  id: z.string().min(1).describe('Link ID stored in the database'),
})

const LinkBodySchema = z.object({
  originalUrl: z
    .string()
    .url()
    .describe(`Full original URL. Example: ${EXAMPLE_ORIGINAL_URL}`),
  shortUrl: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, SHORT_URL_VALIDATION_MESSAGE)
    .describe(`Short slug/URL. Example: ${EXAMPLE_SHORT_URL}`),
})

const getOriginalUrlByShortUrlQuerySchema = z.object({
  shortUrl: z
    .string()
    .min(1)
    .describe(`Registered short URL. Example: ${EXAMPLE_SHORT_URL}`),
})

const linkResponseSchema = z.object({
  id: z.string().describe('Unique link identifier'),
  originalUrl: z.string().describe('Original URL'),
  shortUrl: z.string().describe('Short URL'),
  accessCount: z.string().describe('Accumulated access count'),
  createdAt: z.date().describe('Link creation date and time'),
}).meta({
  example: {
    id: EXAMPLE_LINK_ID,
    originalUrl: EXAMPLE_ORIGINAL_URL,
    shortUrl: EXAMPLE_SHORT_URL,
    accessCount: '31',
    createdAt: EXAMPLE_CREATED_AT,
  },
})

const messageResponseSchema = z.object({
  message: z.string(),
}).meta({
  example: {
    message: LINK_NOT_FOUND_MESSAGE,
  },
})

const originalUrlResponseSchema = z.object({
  originalUrl: z.string().url(),
}).meta({
  example: {
    originalUrl: EXAMPLE_ORIGINAL_URL,
  },
})

export const linkRouter: FastifyPluginAsyncZod = async (server) => {
  server.get(
    LinkRoutes.GET_ORIGINAL_BY_SHORT_URL,
    {
      schema: {
        summary: 'Get original URL by short URL',
        description: 'Retrieves the original URL from a short URL.',
        tags: ['Links'],
        querystring: getOriginalUrlByShortUrlQuerySchema,
        response: {
          200: originalUrlResponseSchema,
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { shortUrl } = request.query

      const links = await db.select().from(link)
      const foundLink = links.find((item) => item.shortUrl === shortUrl)

      if (!foundLink) {
        return reply.status(404).send({ message: LINK_NOT_FOUND_MESSAGE })
      }

      return reply.status(200).send({ originalUrl: foundLink.originalUrl })
    }
  )

  server.get(
    LinkRoutes.LIST_ALL,
    {
      schema: {
        summary: 'List all links',
        description: 'Lists all links stored in the database.',
        tags: ['Links'],
        response: {
          200: z.array(linkResponseSchema).meta({
            example: [
              {
                id: EXAMPLE_LINK_ID,
                originalUrl: EXAMPLE_ORIGINAL_URL,
                shortUrl: EXAMPLE_SHORT_URL,
                accessCount: '31',
                createdAt: EXAMPLE_CREATED_AT,
              },
            ],
          }),
        },
      },
    },
    async (_request, reply) => {
      const links = await db.select().from(link)

      return reply.status(200).send(links)
    }
  )

  server.get(
    LinkRoutes.LIST_CSV,
    {
      schema: {
        summary: 'Export links as CSV',
        description: 'Generates and downloads all links in CSV format.',
        tags: ['Links'],
        response: {
          200: z
            .string()
            .describe('CSV content with columns: id, original_url, short_url, access_count, created_at')
            .meta({
              example: `id,original_url,short_url,access_count,created_at\n${EXAMPLE_LINK_ID},${EXAMPLE_ORIGINAL_URL},${EXAMPLE_SHORT_URL},31,${EXAMPLE_CREATED_AT}\n`,
            }),
        },
      },
    },
    async (_request, reply) => {
      const links = await db.select().from(link)

      const records = links.map((item) => ({
        id: item.id,
        original_url: item.originalUrl,
        short_url: item.shortUrl,
        access_count: item.accessCount,
        created_at: item.createdAt.toISOString(),
      }))

      const csv = stringify(records, {
        header: true,
        columns: ['id', 'original_url', 'short_url', 'access_count', 'created_at'],
      })

      return reply
        .status(200)
        .header('Content-Type', 'text/csv; charset=utf-8')
        .header('Content-Disposition', 'attachment; filename="links.csv"')
        .send(csv)
    }
  )

  server.post(
    LinkRoutes.CREATE,
    {
      schema: {
        summary: 'Create a short link',
        description: 'Creates a new short link with accessCount initialized to 0.',
        tags: ['Links'],
        body: LinkBodySchema,
        response: {
          201: linkResponseSchema,
          409: z.object({
            message: z.string(),
          }).meta({
            example: {
              message: SHORT_URL_ALREADY_EXISTS_MESSAGE,
            },
          }),
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, shortUrl } = request.body

      const links = await db.select().from(link)
      const shortUrlAlreadyExists = links.some((item) => item.shortUrl === shortUrl)

      if (shortUrlAlreadyExists) {
        return reply.status(409).send({ message: SHORT_URL_ALREADY_EXISTS_MESSAGE })
      }

      const [createdLink] = await db
        .insert(link)
        .values({
          originalUrl,
          shortUrl,
          accessCount: '0',
        })
        .returning()

      return reply.status(201).send(createdLink)
    }
  )

  server.patch(
    LinkRoutes.INCREMENT_ACCESS_BY_ID,
    {
      schema: {
        summary: 'Increment link access count',
        description: 'Increments the accessCount field by +1 for the given link ID.',
        tags: ['Links'],
        params: linkIdParamSchema,
        response: {
          200: linkResponseSchema,
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const [updatedLink] = await db
        .update(link)
        .set({
          accessCount: sql`((${link.accessCount})::int + 1)::text`,
        })
        .where(eq(link.id, id))
        .returning()

      if (!updatedLink) {
        return reply.status(404).send({ message: LINK_NOT_FOUND_MESSAGE })
      }

      return reply.status(200).send(updatedLink)
    }
  )

  server.delete(
    LinkRoutes.DELETE_BY_ID,
    {
      schema: {
        summary: 'Delete link by id',
        description: 'Deletes a link stored in the database by ID.',
        tags: ['Links'],
        params: linkIdParamSchema,
        response: {
          200: z.object({
            message: z.string(),
          }).meta({
            example: {
              message: LINK_DELETED_SUCCESSFULLY_MESSAGE,
            },
          }),
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const deletedLinks = await db
        .delete(link)
        .where(eq(link.id, id))
        .returning({ id: link.id })

      if (deletedLinks.length === 0) {
        return reply.status(404).send({ message: LINK_NOT_FOUND_MESSAGE })
      }

      return reply.status(200).send({ message: LINK_DELETED_SUCCESSFULLY_MESSAGE })
    }
  )
}
