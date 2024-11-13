const StudentModel = require('../models/studentModel');

class StudentController {
  async getAllStudents(req, res) {
    try {
      const students = await StudentModel.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: '학생 목록을 가져오는데 실패했습니다.', error: error.message });
    }
  }

  async getStudentById(req, res) {
    try {
      const studentId = req.params.id;
      const student = await StudentModel.getStudentById(studentId);
      
      if (!student) {
        return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
      }
      
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: '학생 정보를 가져오는데 실패했습니다.', error: error.message });
    }
  }

  async createStudent(req, res) {
    try {
      const studentData = req.body;
      const studentId = await StudentModel.createStudent(studentData);
      res.status(201).json({ id: studentId, message: '학생이 성공적으로 생성되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '학생 생성에 실패했습니다.', error: error.message });
    }
  }

  async updateStudent(req, res) {
    try {
      const studentId = req.params.id;
      const studentData = req.body;
      const success = await StudentModel.updateStudent(studentId, studentData);
      
      if (!success) {
        return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
      }
      
      res.json({ message: '학생 정보가 성공적으로 업데이트되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '학생 정보 업데이트에 실패했습니다.', error: error.message });
    }
  }

  async deleteStudent(req, res) {
    try {
      const studentId = req.params.id;
      const success = await StudentModel.deleteStudent(studentId);
      
      if (!success) {
        return res.status(404).json({ message: '학생을 찾을 수 없습니다.' });
      }
      
      res.json({ message: '학생이 성공적으로 삭제되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '학생 삭제에 실패했습니다.', error: error.message });
    }
  }
}

module.exports = new StudentController();