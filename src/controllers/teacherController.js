const { Teacher, Class, Grade } = require('../models');
const metrics = require('../metrics');

// GET /api/teachers - все учителя
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll({
            include: [{
                model: Class,
                as: 'classes',
                attributes: ['id', 'name']
            }],
            order: [['full_name', 'ASC']]
        });
        
        res.json({
            success: true,
            count: teachers.length,
            data: teachers
        });
    } catch (error) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch teachers'
        });
    }
};

// GET /api/teachers/:id - один учитель
const getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id, {
            include: [
                {
                    model: Class,
                    as: 'classes',
                    attributes: ['id', 'name']
                },
                {
                    model: Grade,
                    as: 'grades',
                    include: ['subject', 'student']
                }
            ]
        });
        
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'Teacher not found'
            });
        }
        
        res.json({
            success: true,
            data: teacher
        });
    } catch (error) {
        console.error('Error fetching teacher:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch teacher'
        });
    }
};

// POST /api/teachers - создать учителя
const createTeacher = async (req, res) => {
    try {
        const { full_name, birth_date, phone, hire_date } = req.body;
        
        const teacher = await Teacher.create({
            full_name,
            birth_date,
            phone,
            hire_date
        });

        metrics.incrementTeachersCreated();
        
        res.status(201).json({
            success: true,
            data: teacher
        });
    } catch (error) {
        console.error('Error creating teacher:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create teacher'
        });
    }
};

// PUT /api/teachers/:id - обновить учителя
const updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'Teacher not found'
            });
        }
        
        const { full_name, birth_date, phone, hire_date } = req.body;
        
        await teacher.update({
            full_name,
            birth_date,
            phone,
            hire_date
        });
        
        res.json({
            success: true,
            data: teacher
        });
    } catch (error) {
        console.error('Error updating teacher:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update teacher'
        });
    }
};

// DELETE /api/teachers/:id - удалить учителя
const deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByPk(req.params.id);
        
        if (!teacher) {
            return res.status(404).json({
                success: false,
                error: 'Teacher not found'
            });
        }
        
        await teacher.destroy();
        
        res.json({
            success: true,
            message: 'Teacher deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete teacher'
        });
    }
};

// GET /api/teachers/:id/workload - нагрузка учителя (особый признак!)
const getTeacherWorkload = async (req, res) => {
    try {
        const { count: classesCount } = await Class.findAndCountAll({
            where: { class_teacher_id: req.params.id }
        });
        
        const { count: gradesCount } = await Grade.findAndCountAll({
            where: { teacher_id: req.params.id }
        });
        
        res.json({
            success: true,
            data: {
                teacher_id: req.params.id,
                classes_teaching: classesCount,
                total_grades_given: gradesCount
            }
        });
    } catch (error) {
        console.error('Error calculating workload:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to calculate workload'
        });
    }
};

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherWorkload
};