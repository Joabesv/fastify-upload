import { FastifyInstance } from 'fastify';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const parts = request.files();
    for await (const part of parts) {
      await pipeline(part.file, createWriteStream(`./tmp/${part.filename}`));
    }
    return { message: 'files uploaded' };
  });
}
