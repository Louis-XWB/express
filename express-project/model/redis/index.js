const Redis = require('ioredis');

const redis = new Redis()

redis.on('connect', () => {
  console.log('Redis connected successfully');
})

redis.on('error', (err) => {
  console.log(err);
  console.log('Redis connected failed');

  redis.quit()
})

redis.on('ready', () => {
  console.log('Redis is ready');
})

module.exports = redis