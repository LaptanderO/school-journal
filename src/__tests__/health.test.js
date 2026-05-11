const request = require('supertest');
const { sequelize } = require('../config/database');
require('../models'); 

let app;

beforeAll(async () => {
    await sequelize.authenticate();
    await sequelize.query('DROP TABLE IF EXISTS grades CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS students CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS classes CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS users CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS teachers CASCADE');
    await sequelize.query('DROP TABLE IF EXISTS subjects CASCADE');
    await sequelize.sync();
    app = require('../app');
});

afterAll(async () => {
    await sequelize.close();
});

describe('Health Check', () => {
    test('GET /health', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('healthy');
    });

    test('GET /metrics', async () => {
        const res = await request(app).get('/metrics');
        expect(res.status).toBe(200);
        expect(res.text).toContain('http_requests_total');
    });

    test('GET /', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
    });
});