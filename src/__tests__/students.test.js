const request = require('supertest');
const { sequelize } = require('../config/database');
require('../models'); 

let app;
let adminToken;

beforeAll(async () => {
    await sequelize.authenticate();
    
    // Сбрасываем таблицы
    await sequelize.query('DROP TABLE IF EXISTS grades CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS students CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS classes CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS users CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS teachers CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS subjects CASCADE');
    
    await sequelize.sync();
    app = require('../app');
    
    // Создаём админа
    await request(app)
        .post('/api/auth/register')
        .send({ username: 'testadmin', password: 'test123', role: 'admin' });
    
    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testadmin', password: 'test123' });
    
    adminToken = loginRes.body.data.token;
});

afterAll(async () => {
    await sequelize.close();
});

describe('Students API', () => {
    let studentId;

    test('GET /api/students — пустой список', async () => {
        const res = await request(app).get('/api/students');
        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
    });

    test('POST /api/students — создать ученика', async () => {
        const res = await request(app)
            .post('/api/students')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ full_name: 'Тестовый Ученик', birth_date: '2010-01-01' });
        
        expect(res.status).toBe(201);
        expect(res.body.data.full_name).toBe('Тестовый Ученик');
        studentId = res.body.data.id;
    });

    test('POST /api/students — без токена', async () => {
        const res = await request(app)
            .post('/api/students')
            .send({ full_name: 'Хакер' });
        
        expect(res.status).toBe(401);
    });

    test('GET /api/students/:id — получить ученика', async () => {
        const res = await request(app).get(`/api/students/${studentId}`);
        expect(res.status).toBe(200);
        expect(res.body.data.full_name).toBe('Тестовый Ученик');
    });

    test('PUT /api/students/:id — обновить', async () => {
        const res = await request(app)
            .put(`/api/students/${studentId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ full_name: 'Обновлённый' });
        
        expect(res.body.data.full_name).toBe('Обновлённый');
    });

    test('DELETE /api/students/:id — удалить', async () => {
        const res = await request(app)
            .delete(`/api/students/${studentId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(res.body.success).toBe(true);
    });
});