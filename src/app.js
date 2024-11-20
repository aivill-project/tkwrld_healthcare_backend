const express = require('express');
const cors = require('cors');
require('dotenv').config();

const studentRoutes = require('./routes/students');
const exerciseRoutes = require('./routes/exercises');
const exerciseRecordRoutes = require('./routes/exerciseRecords');
const exerciseAnalysisRoutes = require('./routes/exerciseAnalysis');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // 프론트엔드 URL
  credentials: true, // 쿠키 전달을 위해 필요
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use('/api/students', studentRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/exercise-records', exerciseRecordRoutes);
app.use('/api/exercise-analysis', exerciseAnalysisRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 