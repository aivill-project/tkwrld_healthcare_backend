const pool = require('../config/database');

class ExerciseRecordModel {
  async getAllRecords() {
    const [records] = await pool.query(`
      SELECT er.*, erd.* 
      FROM exercise_records er
      LEFT JOIN exercise_record_details erd ON er.id = erd.exercise_record_id
      ORDER BY er.date DESC, erd.exercise_order ASC
    `);
    return this.formatExerciseRecords(records);
  }

  async getRecordById(recordId) {
    const [records] = await pool.query(`
      SELECT er.*, erd.* 
      FROM exercise_records er
      LEFT JOIN exercise_record_details erd ON er.id = erd.exercise_record_id
      WHERE er.id = ?
      ORDER BY erd.exercise_order ASC
    `, [recordId]);
    return this.formatExerciseRecords(records)[0];
  }

  async getStudentRecords(studentId) {
    const [records] = await pool.query(`
      SELECT er.*, erd.* 
      FROM exercise_records er
      LEFT JOIN exercise_record_details erd ON er.id = erd.exercise_record_id
      WHERE er.student_id = ?
      ORDER BY er.date DESC, erd.exercise_order ASC
    `, [studentId]);
    return this.formatExerciseRecords(records);
  }

  async createRecord(recordData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 운동 기록 헤더 생성
      const [recordResult] = await connection.query(
        'INSERT INTO exercise_records (student_id, date) VALUES (?, ?)',
        [recordData.student_id, recordData.date]
      );
      const recordId = recordResult.insertId;

      // 운동 상세 기록 생성
      for (const [order, exercises] of Object.entries(recordData.exercise_orders)) {
        for (const [exerciseName, reps] of Object.entries(exercises)) {
          await connection.query(
            'INSERT INTO exercise_record_details (exercise_record_id, exercise_name, exercise_order, reps) VALUES (?, ?, ?, ?)',
            [
              recordId,
              exerciseName,
              parseInt(order.replace('차', '')),
              reps
            ]
          );
        }
      }

      await connection.commit();
      return recordId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async updateRecord(recordId, recordData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 기존 상세 기록 삭제
      await connection.query(
        'DELETE FROM exercise_record_details WHERE exercise_record_id = ?',
        [recordId]
      );

      // 새로운 상세 기록 생성
      for (const [order, exercises] of Object.entries(recordData.exercise_orders)) {
        for (const [exerciseName, reps] of Object.entries(exercises)) {
          await connection.query(
            'INSERT INTO exercise_record_details (exercise_record_id, exercise_name, exercise_order, reps) VALUES (?, ?, ?, ?)',
            [
              recordId,
              exerciseName,
              parseInt(order.replace('차', '')),
              reps
            ]
          );
        }
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async deleteRecord(recordId) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // 상세 기록 먼저 삭제
      await connection.query(
        'DELETE FROM exercise_record_details WHERE exercise_record_id = ?',
        [recordId]
      );
      
      // 헤더 기록 삭제
      await connection.query(
        'DELETE FROM exercise_records WHERE id = ?',
        [recordId]
      );

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  formatExerciseRecords(records) {
    const formattedRecords = {};
    
    records.forEach(record => {
      if (!formattedRecords[record.id]) {
        formattedRecords[record.id] = {
          id: record.id,
          student_id: record.student_id,
          date: record.date,
          exercises: new Set(),
          exercise_orders: {},
          created_at: record.created_at
        };
      }

      const currentRecord = formattedRecords[record.id];
      if (record.exercise_name) {
        const orderKey = `${record.exercise_order}차`;
        currentRecord.exercises.add(record.exercise_name);
        
        if (!currentRecord.exercise_orders[orderKey]) {
          currentRecord.exercise_orders[orderKey] = {};
        }
        currentRecord.exercise_orders[orderKey][record.exercise_name] = record.reps;
      }
    });

    return Object.values(formattedRecords).map(record => ({
      ...record,
      exercises: Array.from(record.exercises)
    }));
  }

  // 특정 운동 기록의 상세 정보 조회
  async getRecordDetails(recordId) {
    const [records] = await pool.query(`
      SELECT 
        er.id,
        er.student_id,
        er.date,
        er.created_at,
        erd.exercise_name,
        erd.exercise_order,
        erd.reps
      FROM exercise_records er
      LEFT JOIN exercise_record_details erd ON er.id = erd.exercise_record_id
      WHERE er.id = ?
      ORDER BY erd.exercise_order ASC
    `, [recordId]);

    if (records.length === 0) {
      return null;
    }

    // 데이터 구조화
    const formattedRecord = {
      id: records[0].id,
      student_id: records[0].student_id,
      date: records[0].date,
      created_at: records[0].created_at,
      exercise_orders: {}
    };

    records.forEach(record => {
      const orderKey = `${record.exercise_order}차`;
      if (!formattedRecord.exercise_orders[orderKey]) {
        formattedRecord.exercise_orders[orderKey] = {};
      }
      formattedRecord.exercise_orders[orderKey][record.exercise_name] = record.reps;
    });

    return formattedRecord;
  }

  // 특정 날짜의 운동 기록 조회
  async getRecordByDate(studentId, date) {
    const [records] = await pool.query(`
      SELECT 
        er.id,
        er.student_id,
        er.date,
        er.created_at,
        erd.exercise_name,
        erd.exercise_order,
        erd.reps
      FROM exercise_records er
      LEFT JOIN exercise_record_details erd ON er.id = erd.exercise_record_id
      WHERE er.student_id = ? AND er.date = ?
      ORDER BY erd.exercise_order ASC
    `, [studentId, date]);

    if (records.length === 0) {
      return null;
    }

    // 데이터 구조화
    const formattedRecord = {
      id: records[0].id,
      student_id: records[0].student_id,
      date: records[0].date,
      created_at: records[0].created_at,
      exercise_orders: {}
    };

    records.forEach(record => {
      const orderKey = `${record.exercise_order}차`;
      if (!formattedRecord.exercise_orders[orderKey]) {
        formattedRecord.exercise_orders[orderKey] = {};
      }
      formattedRecord.exercise_orders[orderKey][record.exercise_name] = record.reps;
    });

    return formattedRecord;
  }

  // 특정 날짜의 모든 운동 기록 조회
  async getRecordsByDate(date) {
    const [records] = await pool.query(`
      SELECT 
        er.id,
        er.student_id,
        er.date,
        er.created_at,
        erd.exercise_name,
        erd.exercise_order,
        erd.reps,
        s.name as student_name,
        s.school_type
      FROM exercise_records er
      LEFT JOIN exercise_record_details erd ON er.id = erd.exercise_record_id
      LEFT JOIN students s ON er.student_id = s.student_id
      WHERE DATE(er.date) = ?
      ORDER BY er.student_id, erd.exercise_order ASC
    `, [date]);

    // 학생별로 데이터 그룹화
    const formattedRecords = records.reduce((acc, record) => {
      if (!acc[record.student_id]) {
        acc[record.student_id] = {
          id: record.id,
          student_id: record.student_id,
          student_name: record.student_name,
          school_type: record.school_type,
          date: record.date,
          created_at: record.created_at,
          exercise_orders: {}
        };
      }

      if (record.exercise_name) {
        const orderKey = `${record.exercise_order}차`;
        if (!acc[record.student_id].exercise_orders[orderKey]) {
          acc[record.student_id].exercise_orders[orderKey] = {};
        }
        acc[record.student_id].exercise_orders[orderKey][record.exercise_name] = record.reps;
      }

      return acc;
    }, {});

    return Object.values(formattedRecords);
  }

  // 특정 학생의 모든 운동 기록 조회 (학생 정보 포함)
  async getAllStudentRecords(studentId) {
    const [records] = await pool.query(`
      SELECT 
        er.id,
        er.student_id,
        er.date,
        er.created_at,
        erd.exercise_name,
        erd.exercise_order,
        erd.reps,
        s.name as student_name,
        s.school_type
      FROM exercise_records er
      LEFT JOIN exercise_record_details erd ON er.id = erd.exercise_record_id
      LEFT JOIN students s ON er.student_id = s.student_id
      WHERE er.student_id = ?
      ORDER BY er.date DESC, erd.exercise_order ASC
    `, [studentId]);

    if (records.length === 0) {
      return [];
    }

    // 날짜별로 데이터 그룹화
    const formattedRecords = records.reduce((acc, record) => {
      if (!acc[record.id]) {
        acc[record.id] = {
          id: record.id,
          student_id: record.student_id,
          student_name: record.student_name,
          school_type: record.school_type,
          date: record.date,
          created_at: record.created_at,
          exercise_orders: {}
        };
      }

      if (record.exercise_name) {
        const orderKey = `${record.exercise_order}차`;
        if (!acc[record.id].exercise_orders[orderKey]) {
          acc[record.id].exercise_orders[orderKey] = {};
        }
        acc[record.id].exercise_orders[orderKey][record.exercise_name] = record.reps;
      }

      return acc;
    }, {});

    return Object.values(formattedRecords);
  }
}

module.exports = new ExerciseRecordModel();