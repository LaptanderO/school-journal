const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { testConnection, sequelize } = require('./config/database');
const metrics = require('./metrics');  

// Импорт роутов
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const subjectRoutes = require('./routes/subjects');
const classRoutes = require('./routes/classes');
const gradeRoutes = require('./routes/grades');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(metrics.metricsMiddleware);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Metrics endpoint для Prometheus
app.get('/metrics', metrics.metricsEndpoint);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
    });
});

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/grades', gradeRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Школьный журнал API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            students: '/api/students',
            teachers: '/api/teachers',
            subjects: '/api/subjects',
            classes: '/api/classes',
            grades: '/api/grades'
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error'
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
    await testConnection();
    
    // Синхронизация моделей с БД
    await sequelize.sync({ alter: true });
    console.log('✅ Models synchronized with database');
    
    // Обновляем метрику соединений с БД
    const pool = sequelize.connectionManager.pool;
    if (pool) {
        metrics.setDbConnections(pool.size);
    }
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`📈 Metrics: http://localhost:${PORT}/metrics`);
    });
};

startServer();

module.exports = app;