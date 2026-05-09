const { Student, Class, Grade } = require('../models');
const { sequelize } = require('../config/database');
const metrics = require('../metrics');

// GET /api/students - получить всех учеников
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [{
                model: Class,
                as: 'class',
                attributes: ['id', 'name']
            }],
            order: [['full_name', 'ASC']]
        });
        
        res.json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch students'
        });
    }
};

// GET /api/students/:id - получить одного ученика
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id, {
            include: [
                {
                    model: Class,
                    as: 'class',
                    attributes: ['id', 'name']
                },
                {
                    model: Grade,
                    as: 'grades',
                    include: ['subject']
                }
            ]
        });
        
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error fetching student:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch student'
        });
    }
};

// POST /api/students - создать ученика
const createStudent = async (req, res) => {
    try {
        const { full_name, birth_date, address, class_id } = req.body;
        
        const student = await Student.create({
            full_name,
            birth_date,
            address,
            class_id
        });

        metrics.incrementStudentsCreated();
        
        res.status(201).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create student'
        });
    }
};

// PUT /api/students/:id - обновить ученика
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        const { full_name, birth_date, address, class_id } = req.body;
        
        await student.update({
            full_name,
            birth_date,
            address,
            class_id
        });
        
        res.json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update student'
        });
    }
};

// DELETE /api/students/:id - удалить ученика
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByPk(req.params.id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                error: 'Student not found'
            });
        }
        
        await student.destroy();
        
        res.json({
            success: true,
            message: 'Student deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete student'
        });
    }
};

// GET /api/students/class/:classId - получить учеников по классу (особый признак!)
const getStudentsByClass = async (req, res) => {
    try {
        const students = await Student.findAll({
            where: { class_id: req.params.classId },
            include: [{
                model: Class,
                as: 'class',
                attributes: ['id', 'name']
            }],
            order: [['full_name', 'ASC']]
        });
        
        res.json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (error) {
        console.error('Error fetching students by class:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch students'
        });
    }
};

// GET /api/students/:id/average-grade - средний балл ученика (особый признак!)
const getStudentAverageGrade = async (req, res) => {
    try {
        const result = await Grade.findOne({
            where: { student_id: req.params.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('grade')), 'average_grade'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_grades']
            ],
            raw: true
        });
        
        res.json({
            success: true,
            data: {
                student_id: req.params.id,
                average_grade: parseFloat(result.average_grade).toFixed(2),
                total_grades: parseInt(result.total_grades)
            }
        });
    } catch (error) {
        console.error('Error calculating average grade:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate average grade'
        });
    }
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentsByClass,
    getStudentAverageGrade
};