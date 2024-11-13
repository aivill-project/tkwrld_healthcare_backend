const pool = require('../config/database');

class ExerciseRecordModel {
  async getAllRecords() {
    const [rows] = await pool.query(`
      SELECT er.*, s.name as student_name, e.name as exercise_name 
      FROM exercise_records er
      JOIN students s ON er.student_id = s.student_id
      JOIN exercises e ON er.exercise_id = e.exercise_id
    `);
    return rows;
  }

  async getRecordById(recordId) {
    const [rows] = await pool.query(`
      SELECT er.*, s.name as student_name, e.name as exercise_name 
      FROM exercise_records er
      JOIN students s ON er.student_id = s.student_id
      JOIN exercises e ON er.exercise_id = e.exercise_id
      WHERE er.record_id = ?
    `, [recordId]);
    return rows[0];
  }

  async getStudentRecords(studentId) {
    const [rows] = await pool.query(`
      SELECT er.*, e.name as exercise_name 
      FROM exercise_records er
      JOIN exercises e ON er.exercise_id = e.exercise_id
      WHERE er.student_id = ?
      ORDER BY er.date DESC
    `, [studentId]);
    return rows;
  }

  async createRecord(recordData) {
    const { student_id, exercise_id, date, duration, reps } = recordData;
    const [result] = await pool.query(
      'INSERT INTO exercise_records (student_id, exercise_id, date, duration, reps) VALUES (?, ?, ?, ?, ?)',
      [student_id, exercise_id, date, duration, reps]
    );
    return result.insertId;
  }

  async updateRecord(recordId, recordData) {
    const { duration, reps } = recordData;
    const [result] = await pool.query(
      'UPDATE exercise_records SET duration = ?, reps = ? WHERE record_id = ?',
      [duration, reps, recordId]
    );
    return result.affectedRows > 0;
  }

  async deleteRecord(recordId) {
    const [result] = await pool.query('DELETE FROM exercise_records WHERE record_id = ?', [recordId]);
    return result.affectedRows > 0;
  }
}

module.exports = new ExerciseRecordModel();