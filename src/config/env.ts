import { config as dotEnvConfig } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
  dotEnvConfig({ path: '.env.test' });
} else {
  dotEnvConfig();
}

const envSchema = z.object({
  // Local machine
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
  PORT: z.coerce.number().default(5000),
  HOST: z.string().min(4).default('localhost'),
  // AWS
  REGION: z.string().min(7).default('sa-east-1'),
  ACCESS_KEY_ID: z.string().min(10).max(21),
  SECRET_ACCESS_KEY: z.string(),
  BUCKET_NAME: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  throw new Error('Invalid environments variables');
}

export const config = _env.data;
