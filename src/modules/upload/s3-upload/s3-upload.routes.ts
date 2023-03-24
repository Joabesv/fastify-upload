import type { FastifyInstance, FastifyRequest } from 'fastify';
import { MultipartFile } from '@fastify/multipart';
import {
  type CompletedPart,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  PutObjectCommand,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/integration/s3';
import { config } from '@/config/env';

type SignPartBody = { key: string; uploadId: string; partNumber: number };
type CompleteUploadBody = {
  key: string;
  uploadId: string;
  parts: CompletedPart[];
};
export async function uploadS3Routes(app: FastifyInstance) {
  app.post(
    '/init',
    async (request: FastifyRequest<{ Body: MultipartFile }>, reply) => {
      const { filename, mimetype } = request.body;
      const command = new CreateMultipartUploadCommand({
        Bucket: config.BUCKET_NAME,
        Key: filename,
        ContentType: mimetype,
      });

      const result = await s3Client.send(command);

      return {
        uploadId: result.UploadId,
        key: result.Key,
      };
    },
  );
  app.post(
    '/sign-part',
    async (request: FastifyRequest<{ Body: SignPartBody }>, reply) => {
      const { key, uploadId, partNumber } = request.body;
      const command = new UploadPartCommand({
        Bucket: config.BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 60,
      });

      return { signedUrl };
    },
  );

  app.post(
    '/complete',
    async (request: FastifyRequest<{ Body: CompleteUploadBody }>, reply) => {
      const { key, uploadId, parts } = request.body;

      const command = new CompleteMultipartUploadCommand({
        Bucket: config.BUCKET_NAME,
        UploadId: uploadId,
        Key: key,
        MultipartUpload: {
          Parts: parts,
        },
      });
      await s3Client.send(command);

      return reply
        .status(201)
        .send({ message: 'Uploaded completed!', ok: true });
    },
  );

  app.post('/', async (request, reply) => {
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
