# @nelreina/ntfy.sh-service

This service reads from a Redis stream and sends push notifications through ntfy.sh.

### Configuration 
To configure the service, set the ntfy server URL in an .env file using the following syntax:
```sh
STREAM='mystream' # Redis Stream Key
NOTIFICATION_SERVICE=https://ntfy.sh
# If Set and no topic is given in payload it will use this topic or title
NOTIFICATION_TOPIC=my-topic
NOTIFICATION_TITLE=my-title


```

### Publishing to Redis Stream
To publish to the Redis stream from another application connected to the same Redis instance, use any language that can connect with Redis, not limited to Node.js. Here's a Node.js example using the `node-redis` package:
```js
const streamData = {
  event: "COMMAND:SEND-NOTIFICATION",
  aggregateId: <anIdentifier>,
  timestamp,
  payload: JSON.stringify({
    topic: "the channel/topic", // Optional or takes enc value
    title: "Notification Title", // Optional or takes env value 
    message: "The message", // Required 
  }),
  serviceName: "From which service this event is called",
};
await redis.xAdd(<redisStreamKeyName>, "*", streamData);
```