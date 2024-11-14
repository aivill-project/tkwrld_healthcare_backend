const ExerciseModel = require('../models/exerciseModel');

class ExerciseController {
  async getAllExercises(req, res) {
    try {
      const exercises = await ExerciseModel.getAllExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: '운동 목록을 가져오는데 실패했습니다.', error: error.message });
    }
  }

  async getExerciseById(req, res) {
    try {
      const exerciseId = req.params.id;
      const exercise = await ExerciseModel.getExerciseById(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({ message: '운동을 찾을 수 없습니다.' });
      }
      
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: '운동 정보를 가져오는데 실패했습니다.', error: error.message });
    }
  }

  async createExercise(req, res) {
    try {
      const exerciseData = req.body;
      const exerciseId = await ExerciseModel.createExercise(exerciseData);
      res.status(201).json({ id: exerciseId, message: '운동이 성공적으로 생성되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '운동 생성에 실패했습니다.', error: error.message });
    }
  }

  async updateExercise(req, res) {
    try {
      const exerciseId = req.params.id;
      const exerciseData = req.body;
      const success = await ExerciseModel.updateExercise(exerciseId, exerciseData);
      
      if (!success) {
        return res.status(404).json({ message: '운동을 찾을 수 없습니다.' });
      }
      
      res.json({ message: '운동 정보가 성공적으로 업데이트되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '운동 정보 업데이트에 실패했습니다.', error: error.message });
    }
  }

  async deleteExercise(req, res) {
    try {
      const exerciseId = req.params.id;
      const success = await ExerciseModel.deleteExercise(exerciseId);
      
      if (!success) {
        return res.status(404).json({ message: '운동을 찾을 수 없습니다.' });
      }
      
      res.json({ message: '운동이 성공적으로 삭제되었습니다.' });
    } catch (error) {
      res.status(500).json({ message: '운동 삭제에 실패했습니다.', error: error.message });
    }
  }
}

module.exports = new ExerciseController();