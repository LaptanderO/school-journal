const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', gradeController.getAllGrades);
router.get('/failing', gradeController.getFailingStudents);  // Особый признак!
router.get('/class/:classId/report', gradeController.getClassReport);  // Особый признак!
router.get('/student/:studentId', gradeController.getStudentGrades);
router.get('/:id', gradeController.getGradeById);
router.post('/', authenticateToken, requireRole('admin', 'teacher'), gradeController.createGrade);
router.put('/:id', authenticateToken, requireRole('admin', 'teacher'), gradeController.updateGrade);
router.delete('/:id', authenticateToken, requireRole('admin', 'teacher'), gradeController.deleteGrade);

module.exports = router;