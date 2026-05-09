const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

router.get('/', gradeController.getAllGrades);
router.get('/failing', gradeController.getFailingStudents);  // Особый признак!
router.get('/class/:classId/report', gradeController.getClassReport);  // Особый признак!
router.get('/student/:studentId', gradeController.getStudentGrades);
router.get('/:id', gradeController.getGradeById);
router.post('/', gradeController.createGrade);
router.put('/:id', gradeController.updateGrade);
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;