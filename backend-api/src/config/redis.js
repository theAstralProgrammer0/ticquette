import redis from "redis";

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.client.on('error', (err) => {
            console.log(`Redis client not connected to the server ${err}`);
        });
    }
}

const redisClient = new RedisClient();

export default redisClient;