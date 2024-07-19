import "dotenv/config";

import { newEventStreamService as EventStream } from "@nelreina/redis-stream-consumer";

import { client } from "./config/redis-client.js";
import logger from "./config/logger.js";
import { handler } from "./lib/event-handler.js";
import { SERVICE } from "./config/constants.js";
import { sendNotification, sendNotificationMessage } from "./lib/notification.js";

const STREAM = process.env["STREAM"];
const NOTIFICATION_SERVICE = process.env["NOTIFICATION_SERVICE"];

const shutdown = async () => {
  try {
    logger.info("Disconnecting from redis...");
    await client.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
};

try {
  if (NOTIFICATION_SERVICE === undefined) {
    logger.error("NOTIFICATION_SERVICE environment variable not provided.");
    process.exit(1);
  }

  if (!client.isOpen) await client.connect();
  if (client.isOpen) {
    logger.info("✅ Successfully connected to redis");
    if (STREAM === undefined) {
      logger.error("STREAM environment variable not provided.");
      process.exit(1);
    } else {
      logger.info("✅ STREAM: " + STREAM);
      const msg = await EventStream(
        client,
        STREAM,
        SERVICE,
        "COMMAND:SEND-NOTIFICATION",
        handler
      );
      logger.info(msg);
    }
    
    logger.info("✅ Successfully started notification event stream service");
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } else {
    logger.error("Could not connect to Redis client!");
  }
} catch (error) {
  logger.error(error.message);
}
