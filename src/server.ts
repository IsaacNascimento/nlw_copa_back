import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";
import { z } from "zod";
import ShortUniqueId from 'short-unique-id';

const prisma = new PrismaClient({
  log: ["query"],
});

const bootstrap = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  fastify.get("/pools/count", async () => {
    const pools = await prisma.pool.count();

    return { count: pools };
  });

  fastify.get("/users/count", async () => {
    const usersQuantity = await prisma.user.count();

    return { usersQuantity };
  });

  fastify.get("/guesses/count", async () => {
    const guessesQuantity = await prisma.guess.count();

    return { guessesQuantity };
  });

  fastify.post("/pools", async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string(),
    });

    try {
      const { title } = createPoolBody.parse(request.body);

      const generateID = new ShortUniqueId({length: 6});
      const code = String(generateID()).toUpperCase();
     
      await prisma.pool.create({
        data: {
          title,
          code,
        }
      })

      return reply.status(201).send({ code });

    } catch (error) {
      return `The Title field cannot be null - ${error}`;
    }
  });

  await fastify.listen({ port: 3333, host: "0.0.0.0" });
};

bootstrap();
