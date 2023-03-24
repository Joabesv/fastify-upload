import { app } from './app';
import { config } from './config/env';

const start = async () => {
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
