import fastifyMultipart from '@fastify/multipart';
import fastify from 'fastify';
import { uploadRoutes } from './modules/upload/upload.routes';
import { prettyLog } from './utils/logger';

export const app = fastify({
  logger: prettyLog,
});

app.register(fastifyMultipart);
app.register(uploadRoutes, {
  prefix: '/upload',
});
