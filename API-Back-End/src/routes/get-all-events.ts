import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllEventsRoute(app: FastifyInstance) {
    app.get('/events', async (request, reply) => {
        const events = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' } // se quiser por ordem de criação
        });

        return reply.send({ events });
    });
}
