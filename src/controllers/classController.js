const { Class, Teacher, Student } = require('../models');
const metrics = require('../metrics');

// GET /api/classes - все классы
const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll({
            include: [
                {
                    model: Teacher,
                    as: 'teacher',
                    attributes: ['id', 'full_name']
                },
                {
                    model: Student,
                    as: 'students',
                    attributes: ['id', 'full_name']
                }
            ],
            order: [['name', 'ASC']]
        });
        
        res.json({
            success: true,
            count: classes.length,
            data: classes
        });
    } catch (error) {
        console.error('Error fetching classes:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch classes'
        });
    }
};

// GET /api/classes/:id - один класс
const getClassById = async (req, res) => {
    try {
        const classObj = await Class.findByPk(req.params.id, {
            include: [
                {
                    model: Teacher,
                    as: 'teacher',
                    attributes: ['id', 'full_name', 'phone']
                },
                {
                    model: Student,
                    as: 'students',
                    attributes: ['id', 'full_name', 'birth_date'],
                    order: [['full_name', 'ASC']]
                }
            ]
        });
        
        if (!classObj) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }
        
        res.json({
            success: true,
            data: classObj
        });
    } catch (error) {
        console.error('Error fetching class:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch class'
        });
    }
};

// POST /api/classes - создать класс
const createClass = async (req, res) => {
    try {
        const { name, class_teacher_id } = req.body;
        
        const classObj = await Class.create({
            name,
            class_teacher_id
        });
        
        metrics.incrementClassesCreated();

        res.status(201).json({
            success: true,
            data: classObj
        });
    } catch (error) {
        console.error('Error creating class:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'Class with this name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to create class'
        });
    }
};

// PUT /api/classes/:id - обновить класс
const updateClass = async (req, res) => {
    try {
        const classObj = await Class.findByPk(req.params.id);
        
        if (!classObj) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }
        
        const { name, class_teacher_id } = req.body;
        
        await classObj.update({
            name,
            class_teacher_id
        });
        
        res.json({
            success: true,
            data: classObj
        });
    } catch (error) {
        console.error('Error updating class:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'Class with this name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to update class'
        });
    }
};

// DELETE /api/classes/:id - удалить класс
const deleteClass = async (req, res) => {
    try {
        const classObj = await Class.findByPk(req.params.id);
        
        if (!classObj) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }
        
        await classObj.destroy();
        
        res.json({
            success: true,
            message: 'Class deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting class:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete class'
        });
    }
};

// GET /api/classes/:id/students-count - количество учеников (особый признак!)
const getClassStudentsCount = async (req, res) => {
    try {
        const classObj = await Class.findByPk(req.params.id, {
            include: [{
                model: Student,
                as: 'students',
                attributes: []
            }]
        });
        
        if (!classObj) {
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }
        
        res.json({
            success: true,
            data: {
                class_id: req.params.id,
                class_name: classObj.name,
                students_count: classObj.students.length
            }
        });
    } catch (error) {
        console.error('Error counting students:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to count students'
        });
    }
};

module.exports = {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    getClassStudentsCount
};