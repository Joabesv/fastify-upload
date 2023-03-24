import fastifyMultipart from '@fastify/multipart';
import fastify from 'fastify';
import { uploadS3Routes } from './modules/upload/s3-upload/s3-upload.routes';
import { uploadRoutes } from './modules/upload/upload.routes';
import { prettyLog } from './utils/logger';

export const app = fastify({
  logger: prettyLog,
});

app.register(fastifyMultipart);
app.register(uploadRoutes, {
  prefix: '/upload',
});
app.register(uploadS3Routes, {
  prefix: '/upload/s3',
});
