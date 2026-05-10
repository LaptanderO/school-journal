const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const { authenticateToken, requireRole } = require('../middleware/auth');

router.get('/', subjectController.getAllSubjects);
router.get('/:id', subjectController.getSubjectById);
router.get('/:id/statistics', subjectController.getSubjectStatistics);
router.post('/', authenticateToken, requireRole('admin'), subjectController.createSubject);
router.put('/:id', authenticateToken, requireRole('admin'), subjectController.updateSubject);
router.delete('/:id', authenticateToken, requireRole('admin'), subjectController.deleteSubject);

module.exports = router;