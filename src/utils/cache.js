const NodeCache = require('node-cache');

class CacheService {
  constructor(ttlSeconds = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2
    });
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, data) {
    return this.cache.set(key, data);
  }

  delete(key) {
    return this.cache.del(key);
  }
}

module.exports = new CacheService(); 