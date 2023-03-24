import { config } from '@/config/env';
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: config.REGION,
  credentials: {
    accessKeyId: config.ACCESS_KEY_ID,
    secretAccessKey: config.SECRET_ACCESS_KEY,
  },
});

export { s3Client };
