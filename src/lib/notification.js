import "dotenv/config";
import fetch from "node-fetch";
import logger from "../config/logger.js"
const NOTIFICATION_SERVICE = process.env["NOTIFICATION_SERVICE"];
const NOTIFICATION_TOPIC = process.env["NOTIFICATION_TOPIC"];
const NOTIFICATION_TITLE = process.env["NOTIFICATION_TITLE"];

export const sendNotificationMessage = async (message) => {
  if (!message || message === "") {
    logger.error("Cannot send notification without a message, Please provide a message");
    return;
  }
  await sendNotification({ message });

}


export const sendNotification = async (payload) => {
  let { topic, title, message } = payload;

  if (!message) {
    logger.error("Cannot send notification without a message, Please provide a message in payload");
    return;
  }

  if (!topic) {
    topic = NOTIFICATION_TOPIC;
  }

  if (!topic) {
    logger.error("Cannot send notification without a topic, Please provide a topic in payload or set NOTIFICATION_TOPIC in .env file");
    return;
  }


  if (!title) {
    title = NOTIFICATION_TITLE;
  }

  const response = fetch(`${NOTIFICATION_SERVICE}/${topic}`, {
    method: "POST", // PUT works too
    headers: {
      "Content-Type": "application/json",
      "Title": title,
    },
    body: message,
  });
  logger.info(`Sending notification to ${NOTIFICATION_SERVICE}/${topic}`);
  const result = (await response).json();
  //logger.info(result);
  return result;
};
