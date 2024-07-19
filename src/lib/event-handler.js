import logger from "../config/logger.js";
import { sendNotification } from "./notification.js";

export const handler = async (stream) => {
  const { streamId, aggregateId, event, payload, serviceName } = stream;

  logger.info(JSON.stringify({ serviceName, event, aggregateId, payload }));

  sendNotification(payload);
  stream.ack(streamId);
};
