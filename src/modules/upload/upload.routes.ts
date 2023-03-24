import { FastifyInstance } from 'fastify';
import { Multipart } from '@fastify/multipart';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { ensureDir } from '@/helpers/createDir';

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const dir = ensureDir();
    const parts: AsyncIterableIterator<Multipart> = request.parts();
    for await (const part of parts) {
      if ('file' in part) {
        await pipeline(part.file, createWriteStream(`${dir}/${part.filename}`));
      } else {
        request.log.info(part.fieldname, 'files');
      }
    }
    return { message: 'files uploaded' };
  });
}
