import fastify from "fastify";
import { prettyLog } from "./utils/logger";

export const app = fastify({
  logger: prettyLog
})