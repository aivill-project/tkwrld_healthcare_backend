class MemoryManager {
  constructor(maxSize = 1000) {
    this.cache = new LRU({ max: maxSize });
  }

  cleanup() {
    if (process.memoryUsage().heapUsed > threshold) {
      this.cache.reset();
      global.gc(); // Node.js --expose-gc 필요
    }
  }
} 