import { createClient } from "redis";
import { SERVICE } from "./constants.js";
import { addToEventLog } from "@nelreina/redis-stream-consumer";
import { isObject } from "lodash-es";

let url;
const REDIS_HOST = process.env["REDIS_HOST"];
const REDIS_PORT = process.env["REDIS_PORT"] || 6379;
const REDIS_USER = process.env["REDIS_USER"];
const REDIS_PW = process.env["REDIS_PW"];
const STREAM = process.env["STREAM"];

if (REDIS_HOST) {
  url = "redis://";
  if (REDIS_USER && REDIS_PW) {
    url += `${REDIS_USER}:${REDIS_PW}@`;
  }
  url += `${REDIS_HOST}:${REDIS_PORT}`;
}

export const client = createClient({ url, name: SERVICE });
export const pubsub = client.duplicate();
export const addToStream = async (event, aggregateId, payload) => {
  const streamData = {
    streamKeyName: STREAM,
    aggregateId,
    payload,
    event,
    serviceName: SERVICE,
  };
  await addToEventLog(client, streamData);
};

export const subscribe2RedisChannel = async (channel, callback) => {
  if (!pubsub.isOpen) await pubsub.connect();
  await pubsub.subscribe(channel, (payload) => {
    try {
      callback(JSON.parse(payload));
      // console.log("parsed")
    } catch (error) {
      callback(payload);
    }
  });
  logger.info(`✅ Subscribed to redis channel: ${channel}`);
};

export const publish2RedisChannel = async (channel, payload) => {
  if (!client.isOpen) await client.connect();
  return await client.publish(
    channel,
    isObject(payload) ? JSON.stringify(payload) : payload
  );
};
