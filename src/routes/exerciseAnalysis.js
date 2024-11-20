const express = require('express');
const router = express.Router();
const ExerciseAnalysisController = require('../controllers/exerciseAnalysisController');

// 모든 운동 기록 조회
router.post('/analyze', ExerciseAnalysisController.analyzeExercise.bind(ExerciseAnalysisController));

module.exports = router;