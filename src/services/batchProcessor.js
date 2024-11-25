class BatchProcessor {
  constructor() {
    this.queue = [];
    this.processing = false;
    this.batchSize = 5;
    this.batchTimeout = 1000; // 1초
  }

  async addToQueue(analysisRequest) {
    this.queue.push(analysisRequest);
    
    if (!this.processing) {
      this.processBatch();
    }
  }

  async processBatch() {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const batch = this.queue.splice(0, this.batchSize);
    
    // 배치 처리
    const results = await Promise.all(
      batch.map(request => this.processRequest(request))
    );

    // 다음 배치 처리
    setTimeout(() => this.processBatch(), this.batchTimeout);
  }
} 