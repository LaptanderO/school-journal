const { sequelize } = require('./src/config/database');
const { Teacher, Subject, Class, Student, Grade, User } = require('./src/models');

const seedDatabase = async () => {
    try {
        // Синхронизация с пересозданием таблиц
        await sequelize.sync({ force: true });
        console.log('✅ Database synced');

        // Предметы
        const subjects = await Subject.bulkCreate([
            { name: 'Математика', description: 'Алгебра и геометрия' },
            { name: 'Русский язык', description: 'Грамматика и литература' },
            { name: 'Физика', description: 'Основы физики' },
            { name: 'Информатика', description: 'Программирование' }
        ]);
        console.log('✅ Subjects created');

        // Учителя
        const teachers = await Teacher.bulkCreate([
            { full_name: 'Иванова Мария Петровна', phone: '+79001234567' },
            { full_name: 'Петров Сергей Иванович', phone: '+79007654321' },
            { full_name: 'Сидорова Анна Владимировна', phone: '+79009876543' }
        ]);
        console.log('✅ Teachers created');

        // Пользователи (для авторизации)
        const users = await User.bulkCreate([
            {
                username: 'admin',
                password: 'admin123',
                role: 'admin'
            },
            {
                username: 'teacher1',
                password: 'teacher123',
                role: 'teacher',
                teacher_id: teachers[0].id
            }
        ], { individualHooks: true });
        console.log('✅ Users created');
        console.log('   Админ: admin / admin123');
        console.log('   Учитель: teacher1 / teacher123');

        // Классы
        const classes = await Class.bulkCreate([
            { name: '7А', class_teacher_id: teachers[0].id },
            { name: '7Б', class_teacher_id: teachers[1].id },
            { name: '8А', class_teacher_id: teachers[2].id }
        ]);
        console.log('✅ Classes created');

        // Ученики
        const students = await Student.bulkCreate([
            { full_name: 'Иванов Иван', birth_date: '2010-05-15', address: 'ул. Ленина, 1', class_id: classes[0].id },
            { full_name: 'Петрова Анна', birth_date: '2010-08-22', address: 'ул. Мира, 5', class_id: classes[0].id },
            { full_name: 'Сидоров Пётр', birth_date: '2010-03-10', address: 'ул. Пушкина, 3', class_id: classes[1].id },
            { full_name: 'Козлова Мария', birth_date: '2009-11-30', address: 'ул. Гагарина, 7', class_id: classes[2].id },
            { full_name: 'Новиков Алексей', birth_date: '2009-07-18', address: 'ул. Строителей, 12', class_id: classes[2].id }
        ]);
        console.log('✅ Students created');

        // Оценки
        const grades = await Grade.bulkCreate([
            { student_id: students[0].id, subject_id: subjects[0].id, teacher_id: teachers[0].id, grade: 5, comment: 'Отлично!' },
            { student_id: students[0].id, subject_id: subjects[1].id, teacher_id: teachers[1].id, grade: 4 },
            { student_id: students[1].id, subject_id: subjects[0].id, teacher_id: teachers[0].id, grade: 3 },
            { student_id: students[1].id, subject_id: subjects[3].id, teacher_id: teachers[2].id, grade: 2, comment: 'Плохо подготовился' },
            { student_id: students[2].id, subject_id: subjects[0].id, teacher_id: teachers[0].id, grade: 4 },
            { student_id: students[3].id, subject_id: subjects[3].id, teacher_id: teachers[2].id, grade: 5 }
        ]);
        console.log('✅ Grades created');

        console.log('\n🎉 Database seeded successfully!');
        console.log('Тестовые аккаунты:');
        console.log('  admin / admin123');
        console.log('  teacher1 / teacher123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();