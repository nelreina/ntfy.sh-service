import "dotenv/config";
import fetch from "node-fetch";
import logger from "../config/logger.js"
const NOTIFICATION_SERVICE = process.env["NOTIFICATION_SERVICE"];

export const sendNotification = async (payload) => {
  const { topic, title, message } = payload;
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
