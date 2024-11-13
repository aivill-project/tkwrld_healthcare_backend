const pool = require('../config/database');

class ExerciseModel {
  async getAllExercises() {
    const [rows] = await pool.query('SELECT * FROM exercises');
    return rows;
  }

  async getExerciseById(exerciseId) {
    const [rows] = await pool.query('SELECT * FROM exercises WHERE exercise_id = ?', [exerciseId]);
    return rows[0];
  }

  async createExercise(exerciseData) {
    const { name, description } = exerciseData;
    const [result] = await pool.query(
      'INSERT INTO exercises (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result.insertId;
  }

  async updateExercise(exerciseId, exerciseData) {
    const { name, description } = exerciseData;
    const [result] = await pool.query(
      'UPDATE exercises SET name = ?, description = ? WHERE exercise_id = ?',
      [name, description, exerciseId]
    );
    return result.affectedRows > 0;
  }

  async deleteExercise(exerciseId) {
    const [result] = await pool.query('DELETE FROM exercises WHERE exercise_id = ?', [exerciseId]);
    return result.affectedRows > 0;
  }
}

module.exports = new ExerciseModel();