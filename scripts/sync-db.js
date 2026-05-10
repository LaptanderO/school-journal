const { sequelize } = require('../src/config/database');

(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synced');
        process.exit(0);
    } catch (error) {
        console.error('Sync failed:', error);
        process.exit(1);
    }
})();