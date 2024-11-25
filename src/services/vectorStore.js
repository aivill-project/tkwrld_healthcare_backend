const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const path = require('path');

class VectorStoreService {
  constructor() {
    this.store = null;
    this.indexPath = path.join(__dirname, '../data/faiss_index');
  }

  async initialize() {
    try {
      // 기존 인덱스 로드 시도
      this.store = await FaissStore.load(
        this.indexPath,
        this.embeddings
      );
    } catch {
      // 새 인덱스 생성
      this.store = await this.createNewIndex();
    }
  }

  async createNewIndex() {
    // ... 인덱스 생성 로직 ...
  }

  async similaritySearch(query, k = 2) {
    return this.store.similaritySearch(query, k);
  }
} 