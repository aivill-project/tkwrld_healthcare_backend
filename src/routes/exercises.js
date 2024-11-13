const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/exerciseController');

// 모든 운동 조회
router.get('/', ExerciseController.getAllExercises.bind(ExerciseController));

// 특정 운동 조회
router.get('/:id', ExerciseController.getExerciseById.bind(ExerciseController));

// 새로운 운동 생성
router.post('/', ExerciseController.createExercise.bind(ExerciseController));

// 운동 정보 업데이트
router.put('/:id', ExerciseController.updateExercise.bind(ExerciseController));

// 운동 삭제
router.delete('/:id', ExerciseController.deleteExercise.bind(ExerciseController));

module.exports = router;