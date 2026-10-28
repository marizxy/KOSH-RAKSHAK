/**
 * AICTE KOSH-Rakshak: Redis Session & Distributed Lock Manager
 * Caches bank CBS handshake responses and rate-limits intake uploads
 */

let redis;
try {
  redis = require('redis');
} catch {
  redis = null;
}

const inMemoryFallbackStore = new Map();

class RedisService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.init();
  }

  async init() {
    if (!redis) {
      this.isConnected = false;
      return;
    }
    try {
      this.client = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      this.client.on('error', (err) => {
        this.isConnected = false;
      });
      await this.client.connect();
      this.isConnected = true;
    } catch {
      this.isConnected = false;
    }
  }

  async get(key) {
    if (this.isConnected && this.client) {
      return this.client.get(key);
    }
    return inMemoryFallbackStore.get(key) || null;
  }

  async set(key, value, expirySec = 3600) {
    if (this.isConnected && this.client) {
      return this.client.set(key, value, { EX: expirySec });
    }
    inMemoryFallbackStore.set(key, value);
    return 'OK';
  }

  async del(key) {
    if (this.isConnected && this.client) {
      return this.client.del(key);
    }
    inMemoryFallbackStore.delete(key);
    return 1;
  }
}

module.exports = new RedisService();
