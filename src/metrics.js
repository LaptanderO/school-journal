const client = require('prom-client');

// Создаём реестр метрик
const register = new client.Registry();

// Добавляем стандартные метрики (CPU, память, Event Loop)
client.collectDefaultMetrics({ register });

// Кастомные метрики

// Счётчик HTTP-запросов
const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

// Гистограмма времени ответа
const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10]
});

// Счётчик созданных учеников
const studentsCreatedTotal = new client.Counter({
    name: 'school_students_created_total',
    help: 'Total number of students created'
});

// Счётчик созданных учителей
const teachersCreatedTotal = new client.Counter({
    name: 'school_teachers_created_total',
    help: 'Total number of teachers created'
});

// Счётчик выставленных оценок (по значению)
const gradesGivenTotal = new client.Counter({
    name: 'school_grades_given_total',
    help: 'Total number of grades given',
    labelNames: ['grade']
});

// Счётчик созданных предметов
const subjectsCreatedTotal = new client.Counter({
    name: 'school_subjects_created_total',
    help: 'Total number of subjects created'
});

// Счётчик созданных классов
const classesCreatedTotal = new client.Counter({
    name: 'school_classes_created_total',
    help: 'Total number of classes created'
});

// Gauge - количество активных соединений с БД
const dbConnectionsGauge = new client.Gauge({
    name: 'school_db_connections',
    help: 'Number of active database connections'
});

// Регистрируем метрики
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDurationSeconds);
register.registerMetric(studentsCreatedTotal);
register.registerMetric(teachersCreatedTotal);
register.registerMetric(gradesGivenTotal);
register.registerMetric(subjectsCreatedTotal);
register.registerMetric(classesCreatedTotal);
register.registerMetric(dbConnectionsGauge);

// Middleware для сбора метрик HTTP
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        const route = req.route?.path || req.path;
        
        httpRequestsTotal.inc({
            method: req.method,
            route: route,
            status_code: res.statusCode
        });
        
        httpRequestDurationSeconds.observe({
            method: req.method,
            route: route,
            status_code: res.statusCode
        }, duration);
    });
    
    next();
};

// Функции для инкремента метрик
const incrementStudentsCreated = () => studentsCreatedTotal.inc();
const incrementTeachersCreated = () => teachersCreatedTotal.inc();
const incrementGradesGiven = (grade) => gradesGivenTotal.inc({ grade });
const incrementSubjectsCreated = () => subjectsCreatedTotal.inc();
const incrementClassesCreated = () => classesCreatedTotal.inc();

// Обновление gauge соединений с БД
const setDbConnections = (count) => dbConnectionsGauge.set(count);

// Эндпоинт для Prometheus
const metricsEndpoint = async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
};

module.exports = {
    metricsMiddleware,
    metricsEndpoint,
    incrementStudentsCreated,
    incrementTeachersCreated,
    incrementGradesGiven,
    incrementSubjectsCreated,
    incrementClassesCreated,
    setDbConnections
};