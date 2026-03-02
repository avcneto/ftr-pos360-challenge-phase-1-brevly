import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  jsonSchemaTransform,
  jsonSchemaTransformObject,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { env } from "@/env";
import {
  DEFAULT_CORS_ORIGIN,
  DEFAULT_HTTP_HOST,
  DOCS_ROUTE_PREFIX,
  INTERNAL_SERVER_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from "./http.constants";
import { linkRouter } from "./routers/linkRouter";
import { pingRouter } from "./routers/pingRouter";

const server = fastify();

server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.setErrorHandler((error, _request, reply) => {
  if (hasZodFastifySchemaValidationErrors(error)) {
    return reply.status(400).send({
      message: VALIDATION_ERROR_MESSAGE,
      issues: error.validation,
    });
  }

  console.error(error);

  return reply.status(500).send({
    message: INTERNAL_SERVER_ERROR_MESSAGE,
  });
});

const startServer = async () => {
  await server.register(fastifyCors, {
    origin: DEFAULT_CORS_ORIGIN,
  });

  await server.register(fastifyMultipart);

  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Brevly API",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
    transformObject: jsonSchemaTransformObject,
  });

  server.register(fastifySwaggerUi, {
    routePrefix: DOCS_ROUTE_PREFIX,
  });

  server.register(pingRouter);
  server.register(linkRouter);

  await server.listen({ port: env.PORT, host: DEFAULT_HTTP_HOST });
  console.log(`HTTP server running on http://localhost:${env.PORT}`);
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
