const pool = require('../config/database');

class StudentModel {
  async getAllStudents() {
    const [rows] = await pool.query('SELECT * FROM students');
    return rows;
  }

  async getStudentById(studentId) {
    const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
    return rows[0];
  }

  async createStudent(studentData) {
    const { name, grade, profile_image, school_type } = studentData;
    const [result] = await pool.query(
      'INSERT INTO students (name, grade, profile_image, school_type) VALUES (?, ?, ?, ?)',
      [name, grade, profile_image, school_type]
    );
    return result.insertId;
  }

  async updateStudent(studentId, studentData) {
    const { name, grade, profile_image, school_type } = studentData;
    const [result] = await pool.query(
      'UPDATE students SET name = ?, grade = ?, profile_image = ?, school_type = ? WHERE student_id = ?',
      [name, grade, profile_image, school_type, studentId]
    );
    return result.affectedRows > 0;
  }

  async deleteStudent(studentId) {
    const [result] = await pool.query('DELETE FROM students WHERE student_id = ?', [studentId]);
    return result.affectedRows > 0;
  }
}

module.exports = new StudentModel();