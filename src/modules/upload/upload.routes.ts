import { FastifyInstance } from 'fastify';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { ensureDir } from '@/helpers/createDir';
import { s3Client } from '@/integration/s3';
import { config } from '@/config/env';

export async function uploadRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const dir = ensureDir();
    const parts = request.parts();
    for await (const part of parts) {
      if ('file' in part) {
        await pipeline(part.file, createWriteStream(`${dir}/${part.filename}`));
      } else {
        request.log.info(part.fieldname, 'files');
      }
    }
    return { message: 'files uploaded' };
  });

  app.post('/s3', async (request, reply) => {
    try {
      const data = await request.file();
      const putObject = new PutObjectCommand({
        Bucket: config.BUCKET_NAME,
        Key: data?.filename,
        Body: await data?.toBuffer(),
        ContentType: data?.mimetype,
      });

      await s3Client.send(putObject);
      return reply.status(201).send({
        message: 'File uploaded successfully',
        ok: true,
      });
    } catch (error) {
      reply.log.error(error, 'Error upload');
      throw error;
    }
  });
}
