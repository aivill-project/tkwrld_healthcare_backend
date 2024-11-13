const ExerciseRecordModel = require('../models/exerciseRecordModel');

class ExerciseRecordController {
  async getAllRecords(req, res) {
    try {
      const records = await ExerciseRecordModel.getAllRecords();
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: '운동 기록을 가져오는데 실패했습니다.', error: error.message });
    }
  }

  async getRecordById(req, res) {
    try {
      const recordId = req.params.id;
      const record = await ExerciseRecordModel.getRecordById(recordId);
      
      if (!record) {
        return res.status(404).json({ message: '운동 기록을 찾을 수 없습니다.' });
      }
      
      res.json(record);
    } catch (error) {
      res.status(500).json({ message: '운동 기록을 가져오는데 실패했습니다.', error: error.message });
    }
  }

  async getStudentRecords(req, res) {
    try {
      const studentId = req.params.studentId;
      const records = await ExerciseRecordModel.getStudentRecords(studentId);
      res.json(records);
    } catch (error) {
      res.status(500).json({ message: '학생의 운동 기록을 가져오는데 실패했습니다.', error: error.message });
    }
  }

  async createRecord(req, res) {
    try {
      const recordData = req.body;
      const recordId = await ExerciseRecordModel.createRecord(recordData);
      res.status(201).json({ id: recordId, message: '운동 기록이 성공적으로 생성되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '운동 기록 생성에 실패했습니다.', error: error.message });
    }
  }

  async updateRecord(req, res) {
    try {
      const recordId = req.params.id;
      const recordData = req.body;
      const success = await ExerciseRecordModel.updateRecord(recordId, recordData);
      
      if (!success) {
        return res.status(404).json({ message: '운동 기록을 찾을 수 없습니다.' });
      }
      
      res.json({ message: '운동 기록이 성공적으로 업데이트되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '운동 기록 업데이트에 실패했습니다.', error: error.message });
    }
  }

  async deleteRecord(req, res) {
    try {
      const recordId = req.params.id;
      const success = await ExerciseRecordModel.deleteRecord(recordId);
      
      if (!success) {
        return res.status(404).json({ message: '운동 기록을 찾을 수 없습니다.' });
      }
      
      res.json({ message: '운동 기록이 성공적으로 삭제되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '운동 기록 삭제에 실패했습니다.', error: error.message });
    }
  }
}

module.exports = new ExerciseRecordController();