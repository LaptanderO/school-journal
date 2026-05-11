const request = require('supertest');
const { sequelize } = require('../config/database');
require('../models'); 

let app;

beforeAll(async () => {
    await sequelize.authenticate();
    
    // Удаляем таблицы в правильном порядке (сначала зависимые)
    await sequelize.query('DROP TABLE IF EXISTS grades CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS students CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS classes CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS users CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS teachers CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS subjects CASCADE');
    
    // Создаём заново
    await sequelize.sync();
    
    app = require('../app');
});

afterAll(async () => {
    await sequelize.close();
});

describe('Auth API', () => {
    test('POST /api/auth/register — регистрация', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({ username: 'admin', password: 'admin123', role: 'admin' });
        
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.token).toBeDefined();
    });

    test('POST /api/auth/login — правильный пароль', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'admin123' });
        
        expect(res.status).toBe(200);
        expect(res.body.data.token).toBeDefined();
    });

    test('POST /api/auth/login — неправильный пароль', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'wrong' });
        
        expect(res.status).toBe(401);
    });

    test('GET /api/auth/me — с токеном', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ username: 'admin', password: 'admin123' });
        
        const token = loginRes.body.data.token;
        
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.status).toBe(200);
        expect(res.body.data.username).toBe('admin');
    });

    test('GET /api/auth/me — без токена (401)', async () => {
        const res = await request(app).get('/api/auth/me');
        expect(res.status).toBe(401);
    });
});