const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class ExerciseAnalysisController {
  async analyzeExercise(req, res) {
    try {
      const { exerciseHistory, studentInfo } = req.body;
      
      console.log('Received request data:', {
        exerciseHistory,
        studentInfo
      });

      const prompt = `
운동 기록을 분석하고 개선점과 추천 운동을 제안해주세요.

학생 정보:
${JSON.stringify(studentInfo, null, 2)}

운동 기록:
${JSON.stringify(exerciseHistory, null, 2)}

다음 형식으로 답변해주세요:
1. 현재 운동 패턴 분석
2. 균형적인 발전을 위한 제안
3. 추천 운동 및 세트 수

답변은 학생 정보를 포함하여 친근하고 이해하기 쉬운 말투로 작성해주세요.
`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 500
      });

      res.json({
        status: 'success',
        data: {
          recommendation: completion.choices[0].message.content
        }
      });
    } catch (error) {
      console.error('운동 분석 중 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 분석 중 오류가 발생했습니다.'
      });
    }
  }
}

module.exports = new ExerciseAnalysisController();