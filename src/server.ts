import Fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import cors from "@fastify/cors";

const prisma = new PrismaClient({
  log: ["query"],
});

const bootstrap = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  })

  fastify.get("/pools/count", async () => {
    const pools = await prisma.pool.count();

    return { count: pools };
  });

  await fastify.listen({ port: 3333, host: '0.0.0.0' });
};

bootstrap();
