const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
    url: process.env.REDIS_URL
});
client.on('error', err => console.log('Redis Client Error', err));
client.connect().then(() => console.log('==> Redis Connected!'));
module.exports = client;