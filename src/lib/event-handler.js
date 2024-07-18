import logger from "../config/logger.js";

export const handler = async (stream) => {
  const { streamId, aggregateId, event, payload, serviceName } = stream;

  logger.info(JSON.stringify({ serviceName, event, aggregateId, payload }));
  stream.ack(streamId);
};
