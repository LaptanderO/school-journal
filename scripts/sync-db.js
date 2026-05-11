const { sequelize } = require('../src/config/database');
require('../src/models');

(async () => {
    try {
        await sequelize.query('DROP TABLE IF EXISTS grades CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS students CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS classes CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS users CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS teachers CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS subjects CASCADE');
        
        // Создаём заново
        await sequelize.sync();
        console.log('Database synced');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error.message);
        process.exit(1);
    }
})();