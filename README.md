# @nelreina/ntfy.sh-service

This service reads from a Redis stream and sends push notifications through ntfy.sh.

### Configuration 
To configure the service, set the ntfy server URL in an .env file using the following syntax:
```sh
NOTIFICATION_SERVICE=https://ntfy.sh
```

### Publishing to Redis Stream
To publish to the Redis stream from another application connected to the same Redis instance, use any language that can connect with Redis, not limited to Node.js. Here's a Node.js example using the `node-redis` package:
```js
const streamData = {
  event: "COMMAND:SEND-NOTIFICATION",
  aggregateId: <anIdentifier>,
  timestamp,
  payload: JSON.stringify({
    topic: "the channel/topic",
    title: "Notification Title",
    message: "The message",
  }),
  serviceName: "From which service this event is called",
};
await redis.xAdd(streamKeyName, "*", streamData);
```