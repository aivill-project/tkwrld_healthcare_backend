const ExerciseRecordModel = require('../models/exerciseRecordModel');

class ExerciseRecordController {
  // 모든 운동 기록 조회
  async getAllRecords(req, res) {
    try {
      const records = await ExerciseRecordModel.getAllRecords();
      res.json({
        status: 'success',
        data: records
      });
    } catch (error) {
      console.error('운동 기록 조회 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 기록을 가져오는데 실패했습니다.'
      });
    }
  }

  // 특정 운동 기록 조회
  async getRecordById(req, res) {
    try {
      const recordId = req.params.id;
      const record = await ExerciseRecordModel.getRecordById(recordId);
      
      if (!record) {
        return res.status(404).json({
          status: 'error',
          message: '운동 기록을 찾을 수 없습니다.'
        });
      }
      
      res.json({
        status: 'success',
        data: record
      });
    } catch (error) {
      console.error('운동 기록 조회 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 기록을 가져오는데 실패했습니다.'
      });
    }
  }

  // 학생별 운동 기록 조회
  async getStudentRecords(req, res) {
    try {
      const studentId = req.params.studentId;
      const records = await ExerciseRecordModel.getStudentRecords(studentId);
      res.json({
        status: 'success',
        data: records
      });
    } catch (error) {
      console.error('학생 운동 기록 조회 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '학생의 운동 기록을 가져오는데 실패했습니다.'
      });
    }
  }

  // 운동 기록 생성
  async createRecord(req, res) {
    try {
      const recordData = {
        student_id: req.body.student_id,
        date: req.body.date,
        exercise_orders: req.body.exercise_orders
      };

      // 데이터 유효성 검사
      if (!recordData.student_id || !recordData.date || !recordData.exercise_orders) {
        return res.status(400).json({
          status: 'error',
          message: '필수 입력 항목이 누락되었습니다.'
        });
      }

      const recordId = await ExerciseRecordModel.createRecord(recordData);
      res.status(201).json({
        status: 'success',
        data: {
          id: recordId,
          message: '운동 기록이 성공적으로 생성되었습니다.'
        }
      });
    } catch (error) {
      console.error('운동 기록 생성 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 기록 생성에 실패했습니다.'
      });
    }
  }

  // 운동 기록 수정
  async updateRecord(req, res) {
    try {
      const recordId = req.params.id;
      const recordData = {
        exercise_orders: req.body.exercise_orders
      };

      // 데이터 유효성 검사
      if (!recordData.exercise_orders) {
        return res.status(400).json({
          status: 'error',
          message: '수정할 운동 기록 데이터가 없습니다.'
        });
      }

      const success = await ExerciseRecordModel.updateRecord(recordId, recordData);
      
      if (!success) {
        return res.status(404).json({
          status: 'error',
          message: '운동 기록을 찾을 수 없습니다.'
        });
      }
      
      res.json({
        status: 'success',
        message: '운동 기록이 성공적으로 업데이트되었습니다.'
      });
    } catch (error) {
      console.error('운동 기록 수정 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 기록 업데이트에 실패했습니다.'
      });
    }
  }

  // 운동 기록 삭제
  async deleteRecord(req, res) {
    try {
      const recordId = req.params.id;
      const success = await ExerciseRecordModel.deleteRecord(recordId);
      
      if (!success) {
        return res.status(404).json({
          status: 'error',
          message: '운동 기록을 찾을 수 없습니다.'
        });
      }
      
      res.json({
        status: 'success',
        message: '운동 기록이 성공적으로 삭제되었습니다.'
      });
    } catch (error) {
      console.error('운동 기록 삭제 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 기록 삭제에 실패했습니다.'
      });
    }
  }

  // 특정 운동 기록의 상세 정보 조회
  async getRecordDetails(req, res) {
    try {
      const recordId = req.params.id;
      const record = await ExerciseRecordModel.getRecordDetails(recordId);
      
      if (!record) {
        return res.status(404).json({
          status: 'error',
          message: '운동 기록을 찾을 수 없습니다.'
        });
      }
      
      res.json({
        status: 'success',
        data: record
      });
    } catch (error) {
      console.error('운동 기록 상세 조회 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 기록 상세 정보를 가져오는데 실패했습니다.'
      });
    }
  }

  // 특정 날짜의 운동 기록 조회
  async getRecordByDate(req, res) {
    try {
      const { studentId } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          status: 'error',
          message: '날짜를 지정해주세요.'
        });
      }

      const record = await ExerciseRecordModel.getRecordByDate(studentId, date);
      
      if (!record) {
        return res.status(404).json({
          status: 'error',
          message: '해당 날짜의 운동 기록을 찾을 수 없습니다.'
        });
      }
      
      res.json({
        status: 'success',
        data: record
      });
    } catch (error) {
      console.error('운동 기록 날짜 조회 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 기록을 가져오는데 실패했습니다.'
      });
    }
  }

  // 특정 날짜의 모든 운동 기록 조회
  async getRecordsByDate(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          status: 'error',
          message: '날짜를 지정해주세요.'
        });
      }

      const records = await ExerciseRecordModel.getRecordsByDate(date);
      
      res.json({
        status: 'success',
        data: records
      });
    } catch (error) {
      console.error('운동 기록 날짜 조회 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '운동 기록을 가져오는데 실패했습니다.'
      });
    }
  }

  // 특정 학생의 모든 운동 기록 조회
  async getAllStudentRecords(req, res) {
    try {
      const { studentId } = req.params;
      const records = await ExerciseRecordModel.getAllStudentRecords(studentId);
      
      res.json({
        status: 'success',
        data: {
          student_id: studentId,
          records: records
        }
      });
    } catch (error) {
      console.error('학생 운동 기록 조회 오류:', error);
      res.status(500).json({
        status: 'error',
        message: '학생의 운동 기록을 가져오는데 실패했습니다.'
      });
    }
  }
}

module.exports = new ExerciseRecordController();