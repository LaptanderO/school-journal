const { Subject, Grade } = require('../models');
const { sequelize } = require('../config/database');
const metrics = require('../metrics');  

// GET /api/subjects - все предметы
const getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.findAll({
            order: [['name', 'ASC']]
        });
        
        res.json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    } catch (error) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch subjects'
        });
    }
};

// GET /api/subjects/:id - один предмет
const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        
        if (!subject) {
            return res.status(404).json({
                success: false,
                error: 'Subject not found'
            });
        }
        
        res.json({
            success: true,
            data: subject
        });
    } catch (error) {
        console.error('Error fetching subject:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch subject'
        });
    }
};

// POST /api/subjects - создать предмет
const createSubject = async (req, res) => {
    try {
        const { name, description } = req.body;
        
        const subject = await Subject.create({
            name,
            description
        });

        metrics.incrementSubjectsCreated();
        
        res.status(201).json({
            success: true,
            data: subject
        });
    } catch (error) {
        console.error('Error creating subject:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'Subject with this name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to create subject'
        });
    }
};

// PUT /api/subjects/:id - обновить предмет
const updateSubject = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        
        if (!subject) {
            return res.status(404).json({
                success: false,
                error: 'Subject not found'
            });
        }
        
        const { name, description } = req.body;
        
        await subject.update({
            name,
            description
        });
        
        res.json({
            success: true,
            data: subject
        });
    } catch (error) {
        console.error('Error updating subject:', error);
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'Subject with this name already exists'
            });
        }
        
        res.status(500).json({
            success: false,
            error: 'Failed to update subject'
        });
    }
};

// DELETE /api/subjects/:id - удалить предмет
const deleteSubject = async (req, res) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        
        if (!subject) {
            return res.status(404).json({
                success: false,
                error: 'Subject not found'
            });
        }
        
        await subject.destroy();
        
        res.json({
            success: true,
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting subject:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete subject'
        });
    }
};

// GET /api/subjects/:id/statistics - статистика по предмету (особый признак!)
const getSubjectStatistics = async (req, res) => {
    try {
        const result = await Grade.findAll({
            where: { subject_id: req.params.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('grade')), 'average_grade'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'total_grades'],
                [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('student_id'))), 'students_count']
            ],
            raw: true
        });
        
        const stats = result[0];
        
        // Распределение оценок (сколько 5, 4, 3, 2)
        const distribution = await Grade.findAll({
            where: { subject_id: req.params.id },
            attributes: [
                'grade',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['grade'],
            order: [['grade', 'DESC']],
            raw: true
        });
        
        res.json({
            success: true,
            data: {
                subject_id: req.params.id,
                average_grade: stats.average_grade ? parseFloat(stats.average_grade).toFixed(2) : null,
                total_grades: parseInt(stats.total_grades) || 0,
                students_count: parseInt(stats.students_count) || 0,
                grade_distribution: distribution
            }
        });
    } catch (error) {
        console.error('Error fetching subject statistics:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch subject statistics'
        });
    }
};

module.exports = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject,
    getSubjectStatistics
};