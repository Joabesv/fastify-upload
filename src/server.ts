import { app } from './app';

const start = async () => {
  try {
    await app.listen({ port: 5000 });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
