const Teacher = require('./Teacher');
const Subject = require('./Subject');
const Class = require('./Class');
const Student = require('./Student');
const Grade = require('./Grade');
const User = require('./User');

// Связи
Teacher.hasMany(Class, { foreignKey: 'class_teacher_id', as: 'classes' });
Class.belongsTo(Teacher, { foreignKey: 'class_teacher_id', as: 'teacher' });

Class.hasMany(Student, { foreignKey: 'class_id', as: 'students' });
Student.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

Student.hasMany(Grade, { foreignKey: 'student_id', as: 'grades' });
Grade.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Subject.hasMany(Grade, { foreignKey: 'subject_id', as: 'grades' });
Grade.belongsTo(Subject, { foreignKey: 'subject_id', as: 'subject' });

Teacher.hasMany(Grade, { foreignKey: 'teacher_id', as: 'grades' });
Grade.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

User.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });
Teacher.hasOne(User, { foreignKey: 'teacher_id', as: 'user' });

module.exports = {
    Teacher,
    Subject,
    Class,
    Student,
    Grade,
    User
};