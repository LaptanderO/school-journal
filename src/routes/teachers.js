const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);
router.get('/:id/workload', teacherController.getTeacherWorkload);
router.post('/', authenticateToken, requireRole('admin'), teacherController.createTeacher);
router.put('/:id', authenticateToken, requireRole('admin'), teacherController.updateTeacher);
router.delete('/:id', authenticateToken, requireRole('admin'), teacherController.deleteTeacher);

module.exports = router;