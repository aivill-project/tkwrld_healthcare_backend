const express = require('express');
const router = express.Router();
const ExerciseRecordController = require('../controllers/exerciseRecordController');

// 모든 운동 기록 조회
router.get('/', ExerciseRecordController.getAllRecords.bind(ExerciseRecordController));

// 특정 운동 기록 조회
router.get('/:id', ExerciseRecordController.getRecordById.bind(ExerciseRecordController));

// 특정 학생의 운동 기록 조회
router.get('/student/:studentId', ExerciseRecordController.getStudentRecords.bind(ExerciseRecordController));

// 새로운 운동 기록 생성
router.post('/', ExerciseRecordController.createRecord.bind(ExerciseRecordController));

// 운동 기록 업데이트
router.put('/:id', ExerciseRecordController.updateRecord.bind(ExerciseRecordController));

// 운동 기록 삭제
router.delete('/:id', ExerciseRecordController.deleteRecord.bind(ExerciseRecordController));

module.exports = router;