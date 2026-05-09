const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// CRUD операции
router.get('/', studentController.getAllStudents);
router.get('/class/:classId', studentController.getStudentsByClass);  // Особый признак!
router.get('/:id', studentController.getStudentById);
router.get('/:id/average', studentController.getStudentAverageGrade); // Особый признак!
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;