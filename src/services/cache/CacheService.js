const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 1800) {
    await this._client.setEx(key, expirationInSecond, value);
  }

  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error('Cache not found');
    return result;
  }

  async delete(key) {
    await this._client.del(key);
  }
}

module.exports = CacheService;
