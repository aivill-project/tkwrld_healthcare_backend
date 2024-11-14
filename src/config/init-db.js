const pool = require('./database');

async function initializeDatabase() {
  try {
    // students 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        student_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        age INT,
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // exercises 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        exercise_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // exercise_records 테이블 생성
    await pool.query(`
      CREATE TABLE IF NOT EXISTS exercise_records (
        record_id INT PRIMARY KEY AUTO_INCREMENT,
        student_id INT NOT NULL,
        exercise_id INT NOT NULL,
        sets INT,
        reps INT,
        weight DECIMAL(5,2),
        date DATE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE
      )
    `);

    console.log('모든 테이블이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('테이블 생성 중 오류 발생:', error);
  }
}

// 스크립트 실행
initializeDatabase(); 