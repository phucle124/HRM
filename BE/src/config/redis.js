const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
    url: process.env.REDIS_URL
});
client.on('error', err => console.log('Lỗi Redis', err));
client.connect().then(() => console.log('Redis kết nối thành công!'));
module.exports = client;