import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

(async () => {
    await redisClient.connect();
})();

redisClient.on('connect', () => console.log('\x1b[35m', 'Redis Client Connected', '\x1b[0m'));

redisClient.on('error', error => {
    console.error('\x1b[31m', `Redis Connection Error - ${error.message}`, '\x1b[0m')
});
export default redisClient;