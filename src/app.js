const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const exerciseRoutes = require('./routes/exercises');
const exerciseRecordRoutes = require('./routes/exerciseRecords');

const app = express();

app.use(cors());
app.use(express.json());

// 라우트 설정
app.use('/api/students', studentRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/exercise-records', exerciseRecordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 