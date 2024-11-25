const { ChatOpenAI } = require('@langchain/openai');
const { PromptTemplate } = require('@langchain/core/prompts');
const { LLMChain } = require('langchain/chains');
const { Document } = require('langchain/document');
const { FaissStore } = require('@langchain/community/vectorstores/faiss');
const { OpenAIEmbeddings } = require('@langchain/openai');
const cacheService = require('../utils/cache');
const { Promise } = require('bluebird');

class ExerciseAnalysisController {
  constructor() {
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-4o-mini',
      temperature: 0.7
    });

    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    this.vectorStore = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      const exerciseKnowledge = [
        new Document({
          pageContent: `
운동 강도 가이드라인:
- 초보자: 낮은 무게, 높은 반복 횟수 (12-15회), 세트당 1분 휴식
- 중급자: 중간 무게, 중간 반복 횟수 (8-12회), 세트당 1.5분 휴식
- 고급자: 높은 무게, 낮은 반복 횟수 (6-8회), 세트당 2분 휴식
          `
        }),
        new Document({
          pageContent: `
균형잡힌 운동 구성:
- 상체: 가슴(벤치프레스, 푸시업), 등(랫풀다운, 로우), 어깨(숄더프레스), 팔(컬, 트라이셉스)
- 하체: 대퇴사두근(스쿼트, 레그프레스), 햄스트링(데드리프트), 종아리(카프레이즈)
- 코어: 복근(크런치, 플랭크), 허리(백익스텐션)
          `
        }),
        new Document({
          pageContent: `
주간 운동 빈도 권장사항:
- 초보자: 주 2-3회, 전신 운동
- 중급자: 주 3-4회, 상/하체 분할
- 고급자: 주 4-6회, 부위별 분할

운동 순서 추천:
1. 대근육 운동 (스쿼트, 데드리프트, 벤치프레스)
2. 중간 근육 운동 (숄더프레스, 로우)
3. 소근육 운동 (이두근, 삼두근)
          `
        }),
        new Document({
          pageContent: `
운동 발전 단계:
1단계 (1-3개월): 기본 동작 습득, 낮은 강도
2단계 (4-6개월): 무게 증가, 정확한 자세 유지
3단계 (7-12개월): 운동 다양화, 세트 구성 변화
4단계 (1년 이상): 전문적 트레이닝 프로그램

부상 예방 팁:
- 적절한 웜업 (5-10분)
- 점진적 부하 증가
- 정확한 폼 유지
- 충분한 휴식과 영양
          `
        }),
        new Document({
          pageContent: `
학생 맞춤 운동 고려사항:
- 학업 스케줄과 운동 시간 조절
- 체력 수준에 맞는 운동 강도
- 운동 목표 설정 (체력 향상, 체중 조절 등)
- 정기적인 진도 체크와 피드백

회복과 휴식:
- 운동 부위별 48시간 휴식
- 충분한 수면 (7-8시간)
- 적절한 수분 섭취
- 균형 잡힌 식단
          `
        })
      ];

      this.vectorStore = await FaissStore.fromDocuments(
        exerciseKnowledge,
        this.embeddings
      );

      this.isInitialized = true;
      console.log('Knowledge base initialized successfully');
    } catch (error) {
      console.error('Knowledge base initialization failed:', error);
      throw error;
    }
  }

  async analyzeExercise(req, res) {
    try {
      // 컨트롤러 초기화 확인
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { exerciseHistory, studentInfo } = req.body;
      
      // 캐시 키 생성
      const cacheKey = `analysis_${JSON.stringify(exerciseHistory)}_${studentInfo.id}`;
      
      // 캐시 확인
      const cachedResult = cacheService.get(cacheKey);
      if (cachedResult) {
        return res.json({
          status: 'success',
          data: cachedResult,
          fromCache: true
        });
      }

      console.log('분석 시작:', new Date().toISOString());

      console.log('벡터 검색 시작:', new Date().toISOString());

      const relevantDocs = await this.vectorStore.similaritySearch(
        JSON.stringify({ exerciseHistory, studentInfo }),
        2
      );

      // 프롬프트 템플릿 생성
      const promptTemplate = new PromptTemplate({
        template: `
당신은 전문 운동 트레이너입니다. 다음 정보를 바탕으로 맞춤형 운동 분석과 추천을 제공해주세요.

학생 정보:
{studentInfo}

운동 기록:
{exerciseHistory}

관련 운동 지식:
{relevantKnowledge}

다음 형식으로 상세하게 답변해주세요:
1. 현재 운동 패턴 분석
   - 주요 운동 부위
   - 운동 빈도
   - 현재 강도 수준

2. 개선점 제안
   - 부족한 운동 부위
   - 운동 균형도
   - 강도 조절 방안

3. 맞춤형 운동 추천
   - 구체적인 운동 종류
   - 세트 수와 반복 횟수
   - 적절한 휴식 시간
   - 단계별 발전 계획

답변은 학생의 수준과 상황에 맞게 친근하고 이해하기 쉬운 말투로 작성해주세요.
`,
        inputVariables: ['studentInfo', 'exerciseHistory', 'relevantKnowledge']
      });

      // LLM Chain 생성
      const chain = new LLMChain({
        llm: this.model,
        prompt: promptTemplate
      });

      // 분석 실행
      console.log('분석 실행 시작:', new Date().toISOString());

      const response = await chain.call({
        studentInfo: JSON.stringify(studentInfo, null, 2),
        exerciseHistory: JSON.stringify(exerciseHistory, null, 2),
        relevantKnowledge: relevantDocs.map(doc => doc.pageContent).join('\n')
      });

      console.log('분석 실행 완료:', new Date().toISOString());

      // 결과 캐싱
      cacheService.set(cacheKey, response.text);
      
      res.json({
        status: 'success',
        data: {
          recommendation: response.text,
          relevantKnowledge: relevantDocs.map(doc => doc.pageContent)
        },
        fromCache: false
      });
    } catch (error) {
      console.error('운동 분석 중 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 분석 중 오류가 발생했습니다.',
        error: error.message
      });
    }
  }
}

// 싱글톤 인스턴스 생성 및 초기화
const controller = new ExerciseAnalysisController();
controller.initialize().catch(console.error);

module.exports = controller;