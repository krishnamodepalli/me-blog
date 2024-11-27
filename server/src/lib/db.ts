import Redis from "ioredis";
import { Draft } from "../models";

const client = new Redis(process.env.REDIS_URI as string);

// subscribing to the keyspace notifications for expired keys
(async () => {
  const redis = new Redis(process.env.REDIS_URI as string);

  const channel = "__keyevent@0__:expired";
  await redis.config("SET", "notify-keyspace-events", "Ex");
  redis.subscribe(channel, (err) => {
    if (err) console.error("Failed to subscribe to Redis channel: ", err);
    else console.log(`Subscribed to Redis channel ${channel}`);
  });

  redis.on("message", async (ch, key) => {
    if (ch == channel) {
      if (key.startsWith("draft_key:")) {
        const uuid = key.split(":")[1];
        // getting the to be updated data from redis
        const { title, content } = await client.hgetall(`draft:${uuid}`);

        // updating the draft in the database
        const draft = (await Draft.findByPk(uuid)) as Draft;
        draft.update({ title, content });
        try {
          client.del(`draft:${uuid}`);
        } catch (e) {
          console.error(e);
        }
      }
    }
  });
})();

export { client };
