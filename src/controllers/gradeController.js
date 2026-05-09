const { Grade, Student, Subject, Teacher, Class } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');
const metrics = require('../metrics'); 

// GET /api/grades - все оценки (с фильтрами)
const getAllGrades = async (req, res) => {
    try {
        const { student_id, subject_id, teacher_id, grade, start_date, end_date } = req.query;
        
        const where = {};
        if (student_id) where.student_id = student_id;
        if (subject_id) where.subject_id = subject_id;
        if (teacher_id) where.teacher_id = teacher_id;
        if (grade) where.grade = grade;
        if (start_date || end_date) {
            where.date_received = {};
            if (start_date) where.date_received[Op.gte] = start_date;
            if (end_date) where.date_received[Op.lte] = end_date;
        }
        
        const grades = await Grade.findAll({
            where,
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id', 'full_name']
                },
                {
                    model: Subject,
                    as: 'subject',
                    attributes: ['id', 'name']
                },
                {
                    model: Teacher,
                    as: 'teacher',
                    attributes: ['id', 'full_name']
                }
            ],
            order: [['date_received', 'DESC']],
            limit: 100
        });
        
        res.json({
            success: true,
            count: grades.length,
            data: grades
        });
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch grades'
        });
    }
};

// GET /api/grades/:id - одна оценка
const getGradeById = async (req, res) => {
    try {
        const grade = await Grade.findByPk(req.params.id, {
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['id', 'full_name']
                },
                {
                    model: Subject,
                    as: 'subject',
                    attributes: ['id', 'name']
                },
                {
                    model: Teacher,
                    as: 'teacher',
                    attributes: ['id', 'full_name']
                }
            ]
        });
        
        if (!grade) {
            return res.status(404).json({
                success: false,
                error: 'Grade not found'
            });
        }
        
        res.json({
            success: true,
            data: grade
        });
    } catch (error) {
        console.error('Error fetching grade:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch grade'
        });
    }
};

// POST /api/grades - поставить оценку
const createGrade = async (req, res) => {
    try {
        const { student_id, subject_id, teacher_id, grade, date_received, comment } = req.body;
        
        const newGrade = await Grade.create({
            student_id,
            subject_id,
            teacher_id,
            grade,
            date_received: date_received || new Date(),
            comment
        });
        
        metrics.incrementGradesGiven(grade);

        res.status(201).json({
            success: true,
            data: newGrade
        });
    } catch (error) {
        console.error('Error creating grade:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create grade'
        });
    }
};

// PUT /api/grades/:id - исправить оценку
const updateGrade = async (req, res) => {
    try {
        const gradeObj = await Grade.findByPk(req.params.id);
        
        if (!gradeObj) {
            return res.status(404).json({
                success: false,
                error: 'Grade not found'
            });
        }
        
        const { grade, date_received, comment } = req.body;
        
        await gradeObj.update({
            grade,
            date_received,
            comment
        });
        
        res.json({
            success: true,
            data: gradeObj
        });
    } catch (error) {
        console.error('Error updating grade:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update grade'
        });
    }
};

// DELETE /api/grades/:id - удалить оценку
const deleteGrade = async (req, res) => {
    try {
        const grade = await Grade.findByPk(req.params.id);
        
        if (!grade) {
            return res.status(404).json({
                success: false,
                error: 'Grade not found'
            });
        }
        
        await grade.destroy();
        
        res.json({
            success: true,
            message: 'Grade deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting grade:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete grade'
        });
    }
};

// GET /api/grades/student/:studentId - все оценки ученика
const getStudentGrades = async (req, res) => {
    try {
        const grades = await Grade.findAll({
            where: { student_id: req.params.studentId },
            include: [
                {
                    model: Subject,
                    as: 'subject',
                    attributes: ['id', 'name']
                },
                {
                    model: Teacher,
                    as: 'teacher',
                    attributes: ['id', 'full_name']
                }
            ],
            order: [['date_received', 'DESC']]
        });
        
        res.json({
            success: true,
            count: grades.length,
            data: grades
        });
    } catch (error) {
        console.error('Error fetching student grades:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch student grades'
        });
    }
};

// GET /api/grades/failing - должники (оценка 2) - ОСОБЫЙ ПРИЗНАК!
const getFailingStudents = async (req, res) => {
    try {
        const failing = await Grade.findAll({
            where: { grade: 2 },
            attributes: [
                'student_id',
                [sequelize.fn('COUNT', sequelize.col('Grade.id')), 'failing_count']
            ],
            include: [{
                model: Student,
                as: 'student',
                attributes: ['id', 'full_name'],
                include: [{
                    model: Class,
                    as: 'class',
                    attributes: ['id', 'name']
                }]
            }],
            group: ['student_id', 'student.id', 'student.class.id'],
            having: sequelize.literal('COUNT(Grade.id) > 0'),
            order: [[sequelize.literal('failing_count'), 'DESC']],
            raw: false
        });
        
        res.json({
            success: true,
            count: failing.length,
            data: failing
        });
    } catch (error) {
        console.error('Error fetching failing students:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch failing students'
        });
    }
};

// GET /api/grades/class/:classId/report - отчёт по классу (ОСОБЫЙ ПРИЗНАК!)
const getClassReport = async (req, res) => {
    try {
        const students = await Student.findAll({
            where: { class_id: req.params.classId },
            include: [{
                model: Grade,
                as: 'grades',
                include: ['subject']
            }],
            order: [['full_name', 'ASC']]
        });
        
        const report = students.map(student => {
            const gradesBySubject = {};
            let totalSum = 0;
            let totalCount = 0;
            
            student.grades.forEach(g => {
                if (!gradesBySubject[g.subject.name]) {
                    gradesBySubject[g.subject.name] = [];
                }
                gradesBySubject[g.subject.name].push(g.grade);
                totalSum += g.grade;
                totalCount++;
            });
            
            const averages = {};
            Object.keys(gradesBySubject).forEach(subject => {
                const grades = gradesBySubject[subject];
                averages[subject] = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2);
            });
            
            return {
                student_id: student.id,
                student_name: student.full_name,
                subject_averages: averages,
                overall_average: totalCount > 0 ? (totalSum / totalCount).toFixed(2) : null,
                total_grades: totalCount
            };
        });
        
        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error('Error generating class report:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate class report'
        });
    }
};

module.exports = {
    getAllGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGrade,
    getStudentGrades,
    getFailingStudents,
    getClassReport
};