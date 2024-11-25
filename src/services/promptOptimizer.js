class PromptOptimizer {
  constructor() {
    this.templates = new Map();
  }

  getOptimizedPrompt(type, context) {
    const template = this.templates.get(type);
    return template.format(context);
  }

  // 프롬프트 템플릿 최적화
  optimizeTemplate(prompt) {
    return prompt
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n');
  }
} 