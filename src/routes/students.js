const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// CRUD операции
router.get('/', studentController.getAllStudents);
router.get('/class/:classId', studentController.getStudentsByClass);  // Особый признак!
router.get('/:id', studentController.getStudentById);
router.get('/:id/average', studentController.getStudentAverageGrade); // Особый признак!
router.post('/', authenticateToken, requireRole('admin', 'teacher'), studentController.createStudent);
router.put('/:id', authenticateToken, requireRole('admin', 'teacher'), studentController.updateStudent);
router.delete('/:id', authenticateToken, requireRole('admin'), studentController.deleteStudent);

module.exports = router;