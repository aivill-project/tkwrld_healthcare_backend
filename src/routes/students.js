const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');

// 모든 학생 조회
router.get('/', StudentController.getAllStudents.bind(StudentController));

// 특정 학생 조회
router.get('/:id', StudentController.getStudentById.bind(StudentController));

// 새로운 학생 생성
router.post('/', StudentController.createStudent.bind(StudentController));

// 학생 정보 업데이트
router.put('/:id', StudentController.updateStudent.bind(StudentController));

// 학생 삭제
router.delete('/:id', StudentController.deleteStudent.bind(StudentController));

module.exports = router;