const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
router.get('/:id/students-count', classController.getClassStudentsCount);
router.post('/', authenticateToken, requireRole('admin'), classController.createClass);
router.put('/:id', authenticateToken, requireRole('admin'), classController.updateClass);
router.delete('/:id', authenticateToken, requireRole('admin'), classController.deleteClass);

module.exports = router;