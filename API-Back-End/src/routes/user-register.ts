import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export async function registerUserRoute(app: FastifyInstance) {
  app.post('/users', {
    schema: {
      body: z.object({
        name: z.string(),
        email: z.string().email()
      })
    },
    handler: async (request, reply) => {
      const { name, email } = request.body as { name: string; email: string };

      // Salvar no banco
      const user = await prisma.user.create({
        data: { name, email }
      });

      return reply.status(201).send({ message: 'Usuário criado com sucesso', user });
    }
  });
}
